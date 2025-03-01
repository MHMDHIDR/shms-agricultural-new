import Link from "next/link"
import { redirect } from "next/navigation"
import Divider from "@/components/custom/divider"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { auth } from "@/server/auth"
import { SignInForm } from "./signin-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `تسجيل الدخول | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await auth()
  const user = session?.user
  const searchParamsProp = await searchParams
  const callbackUrl = searchParamsProp.callbackUrl

  if (user) {
    if (callbackUrl) {
      redirect(decodeURIComponent(callbackUrl))
    }

    // Otherwise, use role-based redirects
    if (user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="container mx-auto max-w-md px-2.5 py-20">
      <h1 className="mb-14 text-center text-2xl font-bold select-none">تسجيل الدخول</h1>
      <SignInForm />
      <Divider className="my-10">أو</Divider>

      <div className="divide-primary flex items-center justify-center gap-x-4 divide-x divide-dotted select-none">
        <div className="flex items-center gap-x-4 pl-3">
          <h2 className="text-sm">ليس لديك حساب؟</h2>
          <Link
            href="/signup"
            className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white"
          >
            سجل الآن
          </Link>
        </div>

        <Link
          href="/forgot-password"
          className="text-primary hover:text-primary/70 text-sm hover:underline hover:underline-offset-4"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>
    </div>
  )
}
