import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { contactRouter } from "./routers/contact";
import { projectRouter } from "./routers/projects";

export const appRouter = createTRPCRouter({
  user: userRouter,
  contact: contactRouter,
  projects: projectRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
