import { z } from "zod"
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
})
