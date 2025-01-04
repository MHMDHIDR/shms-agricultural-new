"use server";

import { SignInFormValues } from "@/schemas/signin";
import { signIn } from "@/server/auth";

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
