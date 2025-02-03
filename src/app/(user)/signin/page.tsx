import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SignInForm } from "./signin-form";

export default async function SignInPage() {
  const session = await auth();
  const user = session?.user;

  return user ? (
    redirect("/")
  ) : (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="mb-14 select-none text-center text-2xl font-bold">
        تسجيل الدخول
      </h1>
      <SignInForm />
    </div>
  );
}
