"use server";

import { signOut as authJsSignOut } from "@/server/auth";

export async function signOut() {
  await authJsSignOut();
}
