import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    const role = session?.user?.role;

    const [projects, count] = await Promise.all([
      ctx.db.projects.findMany(),
      ctx.db.projects.count(),
    ]);

    return { projects, count, role };
  }),
});
