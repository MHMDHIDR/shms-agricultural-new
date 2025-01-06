'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signin'
import { signInAction } from './actions'
import type { SignInFormValues } from '@/schemas/signin'

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { setTheme } = useTheme()
  const toast = useToast()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrPhone: '', password: '' }
  })

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true)
      const result = await signInAction(values)

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      setTheme(result.theme ?? 'light')
      toast.success('You have successfully signed in.')
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An unexpected error occurred')
      setIsLoading(false)
    }

    redirect('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='emailOrPhone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Phone</FormLabel>
              <FormControl>
                <Input placeholder='Email or phone number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Enter your password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='animate-spin text-green-500' />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
