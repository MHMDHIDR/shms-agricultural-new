import { SignInForm } from "./signin-form";

export default function SignInPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
      <SignInForm />
    </div>
  );
}
