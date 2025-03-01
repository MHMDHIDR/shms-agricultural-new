"use server"

import { signOut } from "@/server/auth"

export async function handleSignout() {
  // Use the redirectTo parameter to ensure proper signout before redirect
  await signOut({ redirectTo: "/signin" })
}
