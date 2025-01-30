import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4'>
      <div className='mx-auto w-full max-w-3xl space-y-8 text-center duration-1000 animate-in fade-in slide-in-from-bottom-4'>
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary'>
            Oops! You&apos;re Lost in Space
          </h1>
          <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
            Houston, we have a problem. The page you&apos;re looking for seems to have floated away.
          </p>
        </div>

        <div className='group relative mx-auto aspect-[2/1] w-full max-w-2xl'>
          <Image
            src='/not-found.svg'
            alt='404 Illustration'
            fill
            className='animate-float object-contain'
            priority
          />
        </div>

        <div className='space-y-4'>
          <p className='text-lg text-muted-foreground'>
            Let&apos;s get you back to familiar territory
          </p>
          <Link href='/' className='pressable inline-flex text-lg'>
            Return to Home Base
          </Link>
        </div>
      </div>
    </div>
  )
}
