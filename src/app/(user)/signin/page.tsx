import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { SignInForm } from './signin-form'

export default async function SignInPage() {
  const session = await auth()
  const user = session?.user

  return user ? (
    redirect('/')
  ) : (
    <div className='container mx-auto max-w-md py-12'>
      <h1 className='mb-6 text-2xl font-bold'>Sign In</h1>
      <SignInForm />
    </div>
  )
}
