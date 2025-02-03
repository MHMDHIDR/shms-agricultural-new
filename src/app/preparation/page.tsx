import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `التحضيــــــر | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION,
};

export default function Preparation() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <h1 className="mb-2 mt-10 text-2xl">التحضير للموسم الزراعي</h1>

      <div dir="rtl" style={{ marginTop: 10, justifyContent: "center" }}>
        <div style={{ margin: 50, display: "flex", justifyContent: "center" }}>
          <Image
            src="/our-services/preparation.webp"
            width={500}
            height={500}
            alt="تحضير التربة"
            className="w-svw rounded-md shadow-md"
          />
        </div>
        <div className="mx-5 px-20 text-right">
          <p style={{ fontSize: 20 }}>
            تعد عملية تحضير الأرض قبل الزراعة خطوة حاسمة في نجاح المزروعات. فهي
            تسهم في إعداد البيئة المثلى لنمو النباتات، وتعزز امتصاص الأسمدة
            والماء، وتقلل من تواجه الأمراض والآفات. في هذا المقال، سنستعرض
            الخطوات الرئيسية والممارسات الفعّالة لتحضير الأرض قبل الزراعة.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>1. تحليل التربة</h3>
          <p style={{ fontSize: 20 }}>
            يعتبر تحليل التربة أول خطوة في تحضير الأرض. من خلال جمع عينات من
            التربة وتحليلها، يمكن تحديد نوعية التربة ومحتواها الغذائي ومستوى
            الحموضة. يتيح هذا التحليل للمزارعين ضبط التركيبة الغذائية المثلى
            وتعديل مستوى الحموضة إذا لزم الأمر.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            2. إزالة الحشائش والمخلفات
          </h3>
          <p style={{ fontSize: 20 }}>
            يجب إزالة الحشائش والمخلفات النباتية من سطح الأرض قبل البدء في
            تحضيرها. فالحشائش يمكن أن تنافس النباتات المزروعة على الموارد وتقلل
            من كفاءة الإنتاجية، بينما تقلل المخلفات من جودة التربة وتزيد من
            احتمال تواجد الآفات والأمراض.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>3. تنقيح الأرض</h3>
          <p style={{ fontSize: 20 }}>
            يتضمن تنقيح الأرض عدة عمليات مثل الحراثة والحراثة العميقة والتقليب.
            هذه العمليات تهدف إلى تحطيم التربة وتهويتها وتحسين تهويتها، مما يعزز
            تدفق الهواء والماء إلى جذور النباتات.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            4. إضافة المواد العضوية
          </h3>
          <p style={{ fontSize: 20 }}>
            تسهم المواد العضوية مثل السماد الطبيعي والسماد الأخضر في تغذية
            التربة وتحسين تركيبتها. يمكن خلط هذه المواد مع التربة أثناء تحضيرها
            أو وضعها في طبقات على سطح التربة للتحلل التدريجي.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>5. تسوية الأرض</h3>
          <p style={{ fontSize: 20 }}>
            يجب تسوية سطح الأرض بعناية بعد إجراء عمليات التحضير السابقة. يساهم
            ذلك في توزيع الرطوبة بشكل متساوٍ وتوفير سطح مستوٍ لزراعة البذور.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            6. إنشاء الأخاديد أو السراديب
          </h3>
          <p style={{ fontSize: 20 }}>
            قد تتطلب بعض المزروعات إنشاء أخاديد أو سراديب في التربة قبل زراعة
            البذور. يساهم ذلك في توفير بيئة مناسبة لزراعة البذور وتقليل فقدانها
            وزيادة فرص نجاح الزراعة.
          </p>
        </div>

        <Link className="mt-8 text-xl" href="/contact">
          <Button variant={"pressable"} className="mr-24 mt-10">
            طلب الخــدمة
          </Button>
        </Link>
      </div>
    </main>
  );
}
