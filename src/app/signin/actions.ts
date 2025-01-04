"use server";

import { SignInFormValues } from "@/schemas/signin";
import { auth, signIn } from "@/server/auth";
import { db } from "@/server/db";
import { UserTheme } from "@prisma/client";

export async function signInAction(values: SignInFormValues) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      emailOrPhone: values.emailOrPhone,
      password: values.password,
    });

    if (!result) {
      return { error: "An unexpected error occurred" };
    }

    if (result.error) {
      return { error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof Error) {
      if (error.message === "Account is not active") {
        return { error: "Account is not active" };
      }
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserTheme(): Promise<UserTheme> {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) return "light";

    const theme = await db.user.findFirst({
      where: { id: user.id },
      select: { theme: true },
    });

    return theme?.theme ?? "light";
  } catch (error) {
    console.error("Error getting user theme:", error);
    return "light";
  }
}
