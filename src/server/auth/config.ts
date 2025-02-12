import { signInSchema } from "@/schemas/signin";
import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { User as UserTable, UserTheme } from "@prisma/client";
import { compare } from "bcryptjs";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "@auth/core/adapters";

/* eslint-disable no-unused-vars */
declare module "next-auth" {
  interface User {
    role: UserTable["role"];
    theme: UserTheme;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserTable["role"];
    theme: UserTheme;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserTable["role"];
    theme: UserTheme;
  }
}

/* eslint-enable no-unused-vars */
export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        emailOrPhone: { label: "Email or Phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
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
                { isDeleted: false },
              ],
            },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              theme: true,
              role: true,
              accountStatus: true,
            },
          });

          if (!user) {
            return null;
          }

          if (user.accountStatus !== "active") {
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
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: User | AdapterUser;
      trigger?: "signIn" | "update" | "signUp";
      session?: Session["user"];
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.theme = user.theme;
      }

      // Handle updates to the session via update() function
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      // if (session?.user?.email && token.jti) {
      //   await db.session.upsert({
      //     where: { sessionToken: token.jti },
      //     create: {
      //       sessionToken: token.jti,
      //       userId: token.id as string,
      //       expires: new Date(token.exp! * 1000),
      //     },
      //     update: { expires: new Date(token.exp! * 1000) },
      //   });
      // }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserTable["role"],
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
      if ("token" in message && message.token) {
        const token = message.token;
        if (token.jti) {
          await db.session.delete({ where: { sessionToken: token.jti } });
        }
      }
    },
  },
} satisfies NextAuthConfig;
