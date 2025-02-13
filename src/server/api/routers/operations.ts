import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const operationsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const [operations, count] = await Promise.all([
      ctx.db.withdraw_actions.findMany({
        include: {
          user: {
            select: {
              sn: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      ctx.db.withdraw_actions.count(),
    ])

    return { operations, count }
  }),
})
