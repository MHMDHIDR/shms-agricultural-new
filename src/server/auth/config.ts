import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { db } from "@/server/db";
import crypto from "crypto";
import { getUser } from "@/server/auth/actions";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        // logic to salt and hash password
        const pwHash = saltAndHashPassword(password);

        // logic to verify if the user exists
        user = await getUser(email, pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;

function saltAndHashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}
