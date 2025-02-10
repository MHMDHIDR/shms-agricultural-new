import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { contactRouter } from "./routers/contact";
import { projectRouter } from "./routers/projects";
import { socialLinksRouter } from "./routers/social-links";
import { faqRouter } from "./routers/faq";
import { optimizeImageRouter } from "./routers/optimize-image";
import { operationsRouter } from "./routers/operations";

export const appRouter = createTRPCRouter({
  user: userRouter,
  contact: contactRouter,
  projects: projectRouter,
  socialLinks: socialLinksRouter,
  faq: faqRouter,
  optimizeImage: optimizeImageRouter,
  operations: operationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
