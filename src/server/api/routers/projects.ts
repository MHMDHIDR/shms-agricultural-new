import { z } from "zod"
import { sendPurchaseConfirmationEmail } from "@/lib/email/purchase-confirmation"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

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
      return await ctx.db.projects.findUnique({
        where: { id: input.projectId },
      })
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
})
