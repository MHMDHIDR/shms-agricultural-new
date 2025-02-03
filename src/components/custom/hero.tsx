'use client'

import { BookOpen, PenTool, Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCountUp } from '@/hooks/use-count-up'

const COURSES_BY_EXPERTS = 87
const HOURS_OF_CONTENT = 200
const USER_SATISFACTION = 100
const TOTAL_USERS = 7000

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const coursesCount = useCountUp(COURSES_BY_EXPERTS)
  const hoursCount = useCountUp(HOURS_OF_CONTENT)
  const satisfactionCount = useCountUp(USER_SATISFACTION)
  const usersCount = useCountUp(TOTAL_USERS)

  return (
    <section className='relative overflow-hidden bg-background py-12 md:py-32'>
      <div className='absolute inset-0 z-0'>
        <div className='absolute inset-0 bg-black/50 z-10' />
        <video
          src='/hero.mp4'
          loop
          muted
          autoPlay
          controls={false}
          className='block w-full h-full object-cover object-center'
        />
      </div>

      <div className='container relative z-20 max-w-[60rem] mx-auto'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='md:w-1/2'>
            <div className='relative mx-auto mt-28 h-[21.25rem] w-[21.25rem] rounded-full bg-orange-300 shadow-2xl transition-transform duration-300 hover:-translate-y-2 md:mx-0 md:mt-0 lg:h-[25rem] lg:w-[25rem]'>
              <div className='absolute inset-0 overflow-hidden rounded-full'>
                <Image
                  src='/vision-hero.webp'
                  alt='Hero'
                  className='h-full w-full object-cover'
                  width={500}
                  height={500}
                />
              </div>
              <div className='absolute -right-5 bottom-10 flex w-[17.5rem] items-center justify-center gap-1 rounded-full bg-white px-4 py-3 shadow-md'>
                <div className='flex -space-x-[0.875rem]'>
                  {[{ fallback: 'AB' }, { fallback: 'CD' }, { fallback: 'EF' }].map(
                    ({ fallback }, i) => (
                      <Avatar
                        key={i}
                        className='flex h-12 w-12 flex-shrink-0 rounded-full border-4 border-white object-cover'
                      >
                        <AvatarFallback>{fallback}</AvatarFallback>
                      </Avatar>
                    )
                  )}
                </div>
                <div className='flex-1 text-sm text-gray-800'>
                  {usersCount.toLocaleString()}+ people already joined
                </div>
              </div>
              <div className='absolute right-0 top-0 flex h-[6.25rem] w-[6.25rem] rotate-12 rounded-3xl border-8 border-white bg-primary lg:h-[6.875rem] lg:w-[6.875rem]'>
                <BookOpen className='m-auto h-[2.5rem] w-[2.5rem] stroke-white lg:h-[3.125rem] lg:w-[3.125rem]' />
              </div>
              <div className='absolute -left-10 top-1/3 flex h-[6.25rem] w-[6.25rem] -rotate-12 rounded-3xl border-8 border-white bg-primary lg:h-[6.875rem] lg:w-[6.875rem]'>
                <PenTool className='m-auto h-[3.5rem] w-[3.5rem] -rotate-90 fill-white lg:h-[4.5rem] lg:w-[4.5rem]' />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6 md:w-1/2'>
            <h1 className='text-4xl font-medium leading-tight lg:text-6xl text-white'>
              Advanced Framer Expert Tutorials
            </h1>
            <p className='text-lg text-gray-200 lg:max-w-[80%]'>
              Unlock exclusive access to premium tutorials, insider insights, and more. Enhance your
              creativity and elevate your learning journey.
            </p>
            <div className='relative z-10 flex flex-wrap items-center gap-6'>
              <Button asChild variant='default'>
                <a href='/signup'>Become a Member</a>
              </Button>
              <Button
                variant='ghost'
                className='group flex items-center gap-2 hover:bg-transparent text-white'
                onClick={() => setIsVideoOpen(true)}
              >
                <div className='flex h-10 w-10 rounded-full bg-orange-500 transition-transform group-hover:scale-110'>
                  <Play className='m-auto h-5 w-5 fill-white stroke-white' />
                </div>
                <div>Presentation Video</div>
              </Button>
            </div>
          </div>
        </div>

        <div className='mt-20 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm p-6'>
          <div className='flex w-full flex-col md:flex-row'>
            <div className='flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 md:border-b-0 md:border-r-[1px] text-center'>
              <div className='text-2xl font-medium text-primary lg:text-4xl'>{coursesCount}</div>
              <div className='text-gray-200 lg:text-lg'>Courses by Experts</div>
            </div>
            <div className='flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 md:border-b-0 md:border-r-[1px] text-center'>
              <div className='text-2xl font-medium text-primary lg:text-4xl'>{hoursCount}+</div>
              <div className='text-gray-200 lg:text-lg'>Hours of Content</div>
            </div>
            <div className='flex flex-1 flex-col gap-3 p-6 text-center'>
              <div className='text-2xl font-medium text-primary lg:text-4xl'>
                {satisfactionCount}%
              </div>
              <div className='text-gray-200 lg:text-lg'>User Satisfaction Rating</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className='sm:max-w-[800px] p-2.5'>
          <DialogHeader>
            <DialogTitle>Presentation Video</DialogTitle>
            <DialogDescription>
              Watch the presentation video to get a better understanding of our platform.
            </DialogDescription>
          </DialogHeader>
          <div className='aspect-video'>
            <video
              className='h-full w-full rounded-md'
              src='/hero.mp4'
              title='Presentation Video'
              autoPlay
              loop
              muted
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
