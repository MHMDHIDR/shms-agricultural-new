import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { env } from "@/env"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { services } from "@/schemas/contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `الـــزراعة | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default async function Farming() {
  const MAIN_IMAGE = `${env.NEXT_PUBLIC_APP_URL}/our-services/farming.webp`
  const blurImage = await getBlurPlaceholder({ imageSrc: MAIN_IMAGE })

  const serviceIndex = 1

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="mt-10 text-2xl select-none">الزراعة</h1>

      <div className="flex w-full flex-col items-center">
        <div className="relative my-12 w-full min-w-screen">
          <Image
            src="/our-services/farming.webp"
            width={1200}
            height={800}
            alt="الزراعة"
            className="h-[600px] w-full object-cover"
            placeholder="blur"
            blurDataURL={blurImage ?? MAIN_IMAGE}
            priority
          />

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-7">
            <p className="px-5 text-right text-lg leading-10 text-white md:px-10 md:leading-12">
              خطوة الزراعة وتتم أولاً بتحديد طريقة الزراعة إما يدوية أو آلية. ثانياً، تخطيط
              المسافات. ثالثاً، يتم وضع البذور أو الشتلات في التربة ثم يليها الري المنتظم، وإضافة
              الأسمدة وتكتمل بمكافحة الآفات.
            </p>

            <Link className="my-5 text-xl" href={`/contact?service=${services[serviceIndex]}`}>
              <Button variant={"pressable"} className="px-10">
                طلب الخــدمة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
