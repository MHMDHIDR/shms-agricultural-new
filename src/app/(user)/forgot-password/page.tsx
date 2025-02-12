import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SignInForm } from "./forgot-password-form";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import Divider from "@/components/custom/divider";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `إستعادة كلمة المرور | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
};

export default async function ForgotPasswordPage() {
  const session = await auth();
  const user = session?.user;

  if (user?.role === "admin") {
    redirect("/admin");
  } else if (user?.role === "user") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto max-w-md px-2.5 py-20">
      <h1 className="mb-14 text-center text-2xl font-bold select-none">
        إستعادة كلمة المرور
      </h1>
      <SignInForm />
      <Divider className="my-10" />

      <div className="divide-primary flex items-center justify-center gap-x-4 divide-x divide-dotted select-none">
        <h2 className="text-sm">تذكرت كلمة المرور؟</h2>
        <Link
          href="/signin"
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white"
        >
          سجل الدخول
        </Link>
      </div>
    </div>
  );
}
