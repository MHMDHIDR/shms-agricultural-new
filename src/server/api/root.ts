import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { contactRouter } from "./routers/contact";

export const appRouter = createTRPCRouter({
  user: userRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
