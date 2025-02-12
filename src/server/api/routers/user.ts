import { signupSchema, updatePublicSchema } from "@/schemas/signup";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";

const updateUserSchema = signupSchema
  .omit({ confirmPassword: true, doc: true })
  .partial();

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

  getUserByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({ where: { email: input.email } });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const [users, count] = await Promise.all([
      ctx.db.user.findMany(),
      ctx.db.user.count(),
    ]);

    return { users, count };
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        ...updateUserSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: Partial<Prisma.UserUpdateInput> = {}; // Use Prisma's UserUpdateInput type

      // Only include defined fields
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          data[key as keyof Prisma.UserUpdateInput] = value; // Assign the value
        }
      });

      if (input.password) {
        data.password = await hash(input.password, 12); // Ensure this is assigned correctly
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data,
      });
    }),

  updatePublic: publicProcedure
    .input(updatePublicSchema)
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, string | number> = {};

      if (input.image !== undefined) {
        updateData.image = input.image;
      }
      if (input.doc !== undefined) {
        updateData.doc = input.doc;
      }
      updateData.sn = input.sn;

      return ctx.db.user.update({ where: { id: input.id }, data: updateData });
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
