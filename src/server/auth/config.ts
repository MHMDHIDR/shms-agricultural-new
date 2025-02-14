import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { signInSchema } from "@/schemas/signin"
import { db } from "@/server/db"
import type { AdapterUser } from "@auth/core/adapters"
import type { User as UserTable, UserTheme } from "@prisma/client"
import type { NextAuthConfig, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

/* eslint-disable no-unused-vars */
declare module "next-auth" {
  interface User {
    role: UserTable["role"]
    theme: UserTheme
    blurImageDataURL: string | null
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: UserTable["role"]
    theme: UserTheme
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserTable["role"]
    theme: UserTheme
    blurImageDataURL: string | null
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
          const { emailOrPhone, password } = await signInSchema.parseAsync(credentials)

          if (!emailOrPhone || !password) {
            return null
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
          })

          if (!user) {
            return null
          }

          if (user.accountStatus !== "active") {
            throw new Error("Account is not active")
          }

          const isValidPassword = await compare(password, user.password)
          if (!isValidPassword) {
            return null
          }

          let blurImage: string | null = null
          if (user.image) {
            blurImage = await getBlurPlaceholder({ imageSrc: user.image })
          }

          const cookieStore = await cookies()
          cookieStore.set("theme", user.theme)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            theme: user.theme,
            role: user.role,
            blurImageDataURL: blurImage,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT
      user: User | AdapterUser
      trigger?: "signIn" | "update" | "signUp"
      session?: Session
    }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user }
      }

      if (user) {
        token.id = user.id
        token.role = user.role
        token.theme = user.theme
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      const blurImage = session.user?.image
        ? await getBlurPlaceholder({ imageSrc: session.user.image })
        : null

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserTable["role"],
          theme: token.theme as UserTheme,
          name: token.name,
          image: token.image as string | null,
          blurImageDataURL: blurImage,
        },
      }
    },
  },
  events: {
    async signIn({ user, account }) {
      if (user.id && account?.providerAccountId) {
        await db.session.create({
          data: {
            userId: user.id,
            sessionToken: `${account.providerAccountId}_${Date.now()}`,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }
    },
    async signOut(message) {
      if ("token" in message && message.token?.id) {
        await db.session.deleteMany({
          where: {
            userId: message.token.id,
          },
        })
      }
    },
  },
} satisfies NextAuthConfig
