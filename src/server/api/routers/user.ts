import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserTheme: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: { id: ctx.session?.user?.id },
      select: { theme: true },
    });

    return user?.theme ?? "light";
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const [users, count] = await Promise.all([
      ctx.db.user.findMany(),
      ctx.db.user.count(),
    ]);

    return { users, count };
  }),
});
