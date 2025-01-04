import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  sayHello: publicProcedure.query(async () => {
    return `Hello World`;
  }),
});
