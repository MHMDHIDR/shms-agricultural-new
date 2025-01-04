"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { type SignInFormValues, signInSchema } from "@/schemas/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUserTheme, signInAction } from "./actions";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();
  const toast = useToast();
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    const result = await signInAction(values);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("You have successfully signed in.");
      void setConfigurations();
    }
  }

  async function setConfigurations() {
    try {
      const [userTheme] = await getUserTheme();
      setTheme(userTheme ?? "light");
      router.push("/");
    } catch (error) {
      console.error("Error while setting configurations", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="emailOrPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Phone</FormLabel>
              <FormControl>
                <Input placeholder="Email or phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="text-green-600" /> : null}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
