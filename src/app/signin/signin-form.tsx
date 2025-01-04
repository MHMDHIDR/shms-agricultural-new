"use client";

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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUserTheme, signInAction } from "./actions";
import { useTheme } from "next-themes";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const toast = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true);
      const result = await signInAction(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Sign-in successful
      toast.success("You have successfully signed in.");

      // Get user theme after successful authentication
      try {
        const userTheme = await getUserTheme();
        setTheme(userTheme || "light");
      } catch (error) {
        console.error("Error setting theme:", error);
        // Continue with default theme if theme setting fails
      }

      // Use router.push instead of redirect
      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
