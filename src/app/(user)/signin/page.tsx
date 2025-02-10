import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SignInForm } from "./signin-form";

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
    </div>
  );
}
