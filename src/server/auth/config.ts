import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { db } from "@/server/db";
import { compare } from "bcryptjs";
import { signInSchema } from "@/schemas/signin";
import type { UserTheme } from "@prisma/client";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      theme: UserTheme;
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
              theme: true,
              userAccountStatus: true,
              emailVerified: true,
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

          const cookieStore = await cookies();
          cookieStore.set("theme", user.theme);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            theme: user.theme,
            emailVerified: null,
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
      // Create a database session record
      if (session?.user?.email && token.jti) {
        await db.session.upsert({
          where: { sessionToken: token.jti },
          create: {
            sessionToken: token.jti,
            userId: token.id as string,
            expires: new Date(token.exp! * 1000),
          },
          update: { expires: new Date(token.exp! * 1000) },
        });
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          theme: token.theme as UserTheme,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signOut(message) {
      // Check if we have a JWT token in the message
      if ("token" in message && message.token) {
        const token = message.token;
        if (token.jti) {
          await db.session.delete({ where: { sessionToken: token.jti } });
        }
      }
    },
  },
} satisfies NextAuthConfig;
