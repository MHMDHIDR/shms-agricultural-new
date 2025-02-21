import { withdrawAmountSchema } from "@/schemas/withdraw"
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

  getUserWithdrawOperations: protectedProcedure.query(async ({ ctx }) => {
    const operations = await ctx.db.withdraw_actions.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            sn: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return operations
  }),

  createWithdrawRequest: protectedProcedure
    .input(withdrawAmountSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true },
      })

      if (!user) {
        throw new Error("المستخدم غير موجود!")
      }

      if (input.amount > user.credits) {
        throw new Error("الرصيد المطلوب سحبه أكبر من الرصيد المتاح!")
      }

      const [withdrawAction] = await ctx.db.$transaction([
        // Create withdrawal action
        ctx.db.withdraw_actions.create({
          data: {
            withdraw_amount: input.amount,
            action_type: "withdraw",
            accounting_operation_status: "pending",
            user: { connect: { id: ctx.session.user.id } },
          },
        }),
        // deduct the amount from the user's credits if withdrawal action is successful
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { credits: { decrement: input.amount } },
        }),
      ])

      return withdrawAction
    }),
})
