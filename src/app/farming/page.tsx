import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `الـــزراعة | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION,
};

export default function Farming() {
  return (
    <main className="flex flex-col items-center justify-between">
      <h1 className="mt-10 mb-2 text-2xl">الزراعة</h1>

      <div dir="rtl" className="mt-3 justify-center">
        <div className="m-12 flex justify-center">
          <Image
            src="/our-services/farming.webp"
            width={500}
            height={500}
            className="w-svw rounded-md shadow-md"
            alt="الزراعة"
            priority
          />
        </div>
        <div className="mx-5 px-5 text-right">
          <p className="text-lg">
            تُعتبر مرحلة رمي البذور والزراعة أحد أهم مراحل عملية الزراعة، حيث
            يتم فيها زراعة البذور في التربة بطريقة تسهل نموها وتطورها لتنتج
            محصولًا جيدًا. في هذا المقال، سنستعرض الخطوات الأساسية والتقنيات
            الفعّالة لمرحلة رمي البذور والزراعة.
          </p>
          <h3 className="text-2xl font-bold">1. اختيار البذور المناسبة</h3>
          <p className="text-lg">
            يُعتبر اختيار البذور المناسبة أمرًا حاسمًا في نجاح عملية الزراعة.
            يجب اختيار البذور ذات الجودة العالية والمناسبة للظروف المناخية
            والتربوية في منطقتك.
          </p>
          <h3 className="text-2xl font-bold">2. تحضير التربة</h3>
          <p className="text-lg">
            قبل رمي البذور، يجب تحضير التربة بشكل جيد. يمكن ذلك من خلال تخليط
            التربة بالمواد العضوية وتسويتها بشكل مناسب لتوفير بيئة مثالية لنمو
            البذور.
          </p>
          <h3 className="text-2xl font-bold">
            3. تحديد الفترة المناسبة للزراعة
          </h3>
          <p className="text-lg">
            يجب تحديد الفترة المناسبة لزراعة كل نوع من النباتات وفقًا لمتطلباتها
            البيئية والمناخية. يُفضل زراعة بعض النباتات في الفصل الربيعي، بينما
            يُفضل زراعة البعض الآخر في الخريف.
          </p>
          <h3 className="text-2xl font-bold">
            4. تقسيم الحقل ورسم الخطوط الزراعية
          </h3>
          <p className="text-lg">
            قبل رمي البذور، يجب تقسيم الحقل إلى أقسام صغيرة ورسم الخطوط الزراعية
            بواسطة الحراثة أو الآلات الزراعية المناسبة. يسهل ذلك عملية توزيع
            البذور بشكل متساوٍ ومنتظم.
          </p>
          <h3 className="text-2xl font-bold">5. رمي البذور</h3>
          <p className="text-lg">
            بعد التحضيرات السابقة، يمكن البدء في رمي البذور في الخطوط الزراعية
            بشكل متساوٍ ومنتظم. يجب ضبط كمية البذور المزروعة بحيث تكون مناسبة
            لكل نوع من النباتات.
          </p>
          <h3 className="text-2xl font-bold">6. تسوية الأرض والري</h3>
          <p className="text-lg">
            بعد رمي البذور، يتم تسوية الأرض بشكل جيد وريها بشكل منتظم لتوفير
            الرطوبة اللازمة لنمو البذور.
          </p>
        </div>

        <Link className="mt-8 text-xl" href="/contact">
          <Button variant={"pressable"} className="mt-10 mr-24">
            طلب الخــدمة
          </Button>
        </Link>
      </div>
    </main>
  );
}
