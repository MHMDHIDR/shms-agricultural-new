"use server";

import { signIn } from "@/server/auth";
import { api } from "@/trpc/server";
import type { SignInFormValues } from "@/schemas/signin";

export async function signInAction(values: SignInFormValues) {
  try {
    const result = (await signIn("credentials", {
      redirect: false,
      emailOrPhone: values.emailOrPhone,
      password: values.password,
    })) as { error: string };

    if (!result) {
      return { error: "An unexpected error occurred" };
    }

    if (result.error) {
      return { error: "Invalid credentials" };
    }

    const theme = await api.user.getUserThemeByCredentials({
      emailOrPhone: values.emailOrPhone,
    });

    return { success: true, theme };
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
