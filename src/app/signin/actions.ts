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

    if (result?.error) {
      return { error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred" };
  }
}
