import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SignInForm } from "./signin-form";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import Divider from "@/components/custom/divider";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `تسجيل الدخول | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
};

export default async function SignInPage() {
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
        تسجيل الدخول
      </h1>
      <SignInForm />
      <Divider className="my-10" />

      <div className="flex items-center justify-center gap-x-6 select-none">
        <h2 className="text-sm">ليس لديك حساب؟</h2>
        <Link
          href="/signup"
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white"
        >
          سجل الآن
        </Link>
      </div>
    </div>
  );
}
