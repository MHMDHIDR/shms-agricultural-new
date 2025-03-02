"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from "@/schemas/signin"
import { signInAction } from "./actions"
import type { SignInFormValues } from "@/schemas/signin"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { setTheme } = useTheme()
  const toast = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  })

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true)
      const result = await signInAction(values)

      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      setTheme(result.theme ?? "light")
      toast.success("تم تسجيل الدخول بنجاح")

      router.push(callbackUrl ?? "/")
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("حدث خطأ اثناء تسجيل الدخول")
      setIsLoading(false)
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
              <FormLabel className="text-xs select-none">رقم الهاتف او البريد الالكتروني</FormLabel>
              <FormControl>
                <Input
                  placeholder="البريد الالكتروني أو رقم الهاتف"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  {...field}
                />
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
              <FormLabel className="text-xs select-none">كلمة المرور</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"pressable"} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="animate-spin text-green-500" />}
          تسجيل الدخول
        </Button>
      </form>
    </Form>
  )
}
