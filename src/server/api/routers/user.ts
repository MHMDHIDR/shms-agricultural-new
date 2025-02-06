import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserThemeByCredentials: publicProcedure
    .input(z.object({ emailOrPhone: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [{ email: input.emailOrPhone }, { phone: input.emailOrPhone }],
        },
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
