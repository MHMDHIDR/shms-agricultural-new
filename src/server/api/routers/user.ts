import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { hash } from "bcryptjs";
import { signupSchema } from "@/schemas/signup";

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

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({ where: { id: input.id } });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const [users, count] = await Promise.all([
      ctx.db.user.findMany(),
      ctx.db.user.count(),
    ]);

    return { users, count };
  }),

  create: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await hash(input.password, 12);

      try {
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            nationality: input.nationality,
            dateOfBirth: input.dateOfBirth,
            password: hashedPassword,
            image: input.image,
            doc: input.doc,
          },
        });
        return user.id;
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new Error("البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل");
        }
        throw new Error("حدث خطأ أثناء تسجيل الحساب، يرجى المحاولة مرة أخرى");
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        nationality: z.string().optional(),
        dateOfBirth: z.date().optional(),
        theme: z.enum(["light", "dark"]).optional(),
        image: z.string().optional(),
        doc: z.string().optional(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: any = {};

      // Only include defined fields
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          data[key] = value;
        }
      });

      if (input.password) {
        data.password = await hash(input.password, 12);
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data,
      });
    }),

  updatePublic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string().optional(),
        doc: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          image: input.image,
          doc: input.doc,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get user's stocks
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: { stocks: true },
      });

      // Return stocks to projects if any
      if (user?.stocks?.length) {
        for (const stock of user.stocks) {
          await ctx.db.projects.update({
            where: { id: stock.id },
            data: {
              projectAvailableStocks: {
                increment: stock.stocks,
              },
            },
          });
        }
      }

      // Mark user as deleted
      return ctx.db.user.update({
        where: { id: input.id },
        data: { isDeleted: true },
      });
    }),
});
