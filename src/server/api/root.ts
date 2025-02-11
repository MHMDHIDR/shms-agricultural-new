import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { contactRouter } from "./routers/contact";
import { projectRouter } from "./routers/projects";
import { socialLinksRouter } from "./routers/social-links";
import { faqRouter } from "./routers/faq";
import { operationsRouter } from "./routers/operations";
import { optimizeImageRouter } from "./routers/optimize-image";
import { S3Router } from "./routers/s3";

export const appRouter = createTRPCRouter({
  user: userRouter,
  contact: contactRouter,
  projects: projectRouter,
  socialLinks: socialLinksRouter,
  faq: faqRouter,
  operations: operationsRouter,
  optimizeImage: optimizeImageRouter,
  S3: S3Router,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
