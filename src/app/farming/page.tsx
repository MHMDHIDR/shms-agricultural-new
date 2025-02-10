import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import { env } from "@/env";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: `الـــزراعة | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
};

export default async function Farming() {
  const MAIN_IMAGE = `${env.NEXT_PUBLIC_APP_URL}/our-services/farming.webp`;
  const blurImage = await api.optimizeImage.getBlurPlaceholder({
    imageSrc: MAIN_IMAGE,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
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

          <div className="absolute inset-0 flex items-center">
            <p className="px-12 text-right text-xl leading-12 text-white">
              خطوة الزراعة وتتم أولاً بتحديد طريقة الزراعة إما يدوية أو آلية.
              ثانياً، تخطيط المسافات. ثالثاً، يتم وضع البذور أو الشتلات في
              التربة ثم يليها الري المنتظم، وإضافة الأسمدة وتكتمل بمكافحة
              الآفات.
            </p>
          </div>
        </div>

        <Link className="my-5 text-xl" href="/contact">
          <Button variant={"pressable"} className="px-12">
            طلب الخــدمة
          </Button>
        </Link>
      </div>
    </main>
  );
}
