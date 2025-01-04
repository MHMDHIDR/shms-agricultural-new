import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { db } from "@/server/db";
import { compare } from "bcryptjs";
import { signInSchema } from "@/schemas/signin";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        emailOrPhone: { label: "Email or Phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { emailOrPhone, password } =
            await signInSchema.parseAsync(credentials);

          if (!emailOrPhone || !password) {
            return null;
          }

          const user = await db.user.findFirst({
            where: {
              AND: [
                { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
                { userIsDeleted: false },
              ],
            },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              userAccountStatus: true,
            },
          });

          if (!user) {
            return null;
          }

          if (user.userAccountStatus !== "active") {
            throw new Error("Account is not active");
          }

          const isValidPassword = await compare(password, user.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
