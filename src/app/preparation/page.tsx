import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `التحضيــــــر | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
};

export default function Preparation() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <h1 className="mt-10 text-2xl">التحضير للموسم الزراعي</h1>

      <div className="flex w-full flex-col items-center">
        <div className="relative my-12 w-full min-w-screen">
          <Image
            src="/our-services/preparation.webp"
            width={1200}
            height={800}
            alt="تحضير التربة"
            className="h-[600px] w-full object-cover"
            priority
          />

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="absolute inset-0 flex items-center">
            <p className="px-12 text-right text-xl leading-12 text-white">
              يتم التحضير للموسم الزراعي بالخطوات التالي أولا تحديد المحصول
              المراد زراعته وتحليل التربة، والتأكد من أنها صالحة للزراعة تجهيز
              التربة وذلك يتضمن الحراثة وإضافة الأسمدة والتسوية، ثم الخطوة التي
              تليها تنظيف الأرض وتجهيز آليات الري وأيضا شراء البذور المراد
              زرعتها، والتأكد من جودتها وتطهيرها تماماً قبل الزراعة.
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
