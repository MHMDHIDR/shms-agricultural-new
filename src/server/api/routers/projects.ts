import { z } from "zod"
import { sendPurchaseConfirmationEmail } from "@/lib/email/purchase-confirmation"
import { extractS3FileName } from "@/lib/extract-s3-filename"
import { projectSchema } from "@/schemas/project"
import { createCaller } from "@/server/api/root"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

const updateProjectSchema = projectSchema.partial()

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session
    const role = session?.user?.role

    const [projects, count] = await Promise.all([
      ctx.db.projects.findMany(),
      ctx.db.projects.count(),
    ])

    return { projects, count, role }
  }),

  getProjectById: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.projects.findUnique({ where: { id: input.projectId } })
    }),

  updateProfitsPercentage: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        percentage: z.number().min(0).max(100),
        percentageCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.update({
        where: { id: input.projectId },
        data: {
          projectSpecialPercentage: input.percentage,
          projectSpecialPercentageCode: input.percentageCode,
          updatePercentage: true,
        },
      })

      return project
    }),

  deleteProfitsPercentage: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.update({
        where: { id: input.projectId },
        data: {
          projectSpecialPercentage: null,
          projectSpecialPercentageCode: null,
          updatePercentage: true,
        },
      })

      return project
    }),

  validatePercentageCode: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.findUnique({
        where: { id: input.projectId },
        select: {
          projectSpecialPercentageCode: true,
          projectSpecialPercentage: true,
        },
      })

      if (project?.projectSpecialPercentageCode === input.code) {
        return { percentage: project.projectSpecialPercentage ?? 0 }
      }

      throw new Error("رمز غير صالح")
    }),

  confirmPurchase: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        stocks: z.number().min(1),
        percentageCode: z.string().optional(),
        newPercentage: z.number(),
        totalPayment: z.number(),
        totalProfit: z.number(),
        totalReturn: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, stocks, percentageCode, newPercentage } = input
      const userId = ctx.session?.user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      // Start transaction with longer timeout
      const result = await ctx.db.$transaction(
        async tx => {
          // Get project and user
          const [project, user] = await Promise.all([
            tx.projects.findUnique({ where: { id: projectId } }),
            tx.user.findUnique({ where: { id: userId } }),
          ])

          if (!project || !user) {
            throw new Error("Project or user not found")
          }

          if (project.projectAvailableStocks < stocks) {
            throw new Error("Not enough stocks available")
          }

          // Update project available stocks
          await tx.projects.update({
            where: { id: projectId },
            data: {
              projectAvailableStocks: {
                decrement: stocks,
              },
            },
          })

          // Add stocks to user
          const newStock = {
            id: projectId,
            stocks,
            newPercentage,
            percentageCode: percentageCode ?? "",
            createdAt: new Date(),
            capitalDeposited: false,
            profitsDeposited: false,
          }

          await tx.user.update({
            where: { id: userId },
            data: {
              stocks: {
                push: newStock,
              },
            },
          })

          return { project, user }
        },
        {
          timeout: 10000, // 10 seconds
          maxWait: 5000, // 5 seconds max wait for lock
        },
      )

      // Send email after transaction completes
      try {
        await sendPurchaseConfirmationEmail({
          user: result.user,
          project: result.project,
          purchaseDetails: input,
        })
      } catch (error) {
        // Log email error but don't fail the transaction
        console.error("Failed to send confirmation email:", error)
      }

      return { success: true }
    }),

  create: protectedProcedure
    .input(projectSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.projectImages.length || !input.projectStudyCase) {
        throw new Error("صور المشروع ودراسة الجدوى مطلوبة")
      }

      const project = await ctx.db.projects.create({
        data: {
          ...input,
          // projectStatus: "pending",
          projectAvailableStocks: input.projectTotalStocks,
          projectImages: input.projectImages.map(url => ({
            imgDisplayName: url.split("/").pop() ?? "",
            imgDisplayPath: url,
          })),
          projectStudyCase: [
            {
              imgDisplayName: input.projectStudyCase.split("/").pop() ?? "",
              imgDisplayPath: input.projectStudyCase,
            },
          ],
        },
      })

      return project.id
    }),

  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)

      // remove project images and study case from s3
      const project = await ctx.db.projects.findUnique({ where: { id: input.id } })
      if (project) {
        // Delete project images
        if (project.projectImages) {
          for (const image of project.projectImages) {
            const oldFileKey = extractS3FileName(image.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
        // Delete study case
        if (project.projectStudyCase) {
          for (const study of project.projectStudyCase) {
            const oldFileKey = extractS3FileName(study.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
      }

      await ctx.db.projects.delete({ where: { id: input.id } })
      return { success: true }
    }),

  deleteManyById: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)

      // Remove all projects' files from S3 and delete projects
      const projects = await ctx.db.projects.findMany({
        where: { id: { in: input.ids } },
      })

      for (const project of projects) {
        // Delete project images
        if (project.projectImages) {
          for (const image of project.projectImages) {
            const oldFileKey = extractS3FileName(image.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
        // Delete study case
        if (project.projectStudyCase) {
          for (const study of project.projectStudyCase) {
            const oldFileKey = extractS3FileName(study.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
      }

      await ctx.db.projects.deleteMany({
        where: { id: { in: input.ids } },
      })

      return { success: true }
    }),

  update: protectedProcedure
    .input(updateProjectSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const project = await ctx.db.projects.update({
        where: { id },
        data: {
          ...data,
          projectImages: data.projectImages?.map(url => ({
            imgDisplayName: url.split("/").pop() ?? "",
            imgDisplayPath: url,
          })),
          projectStudyCase: [
            {
              imgDisplayName: data.projectStudyCase?.split("/").pop() ?? "",
              imgDisplayPath: data.projectStudyCase ?? "",
            },
          ],
        },
      })

      return project
    }),
})
