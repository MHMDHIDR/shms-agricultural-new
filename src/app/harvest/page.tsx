import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `الحصـــــــــاد | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION,
};

export default function Harvest() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <h1 className="mt-10 mb-2 text-2xl">موسم الحصاد</h1>

      <div dir="rtl" style={{ marginTop: 10, justifyContent: "center" }}>
        <div style={{ margin: 50, display: "flex", justifyContent: "center" }}>
          <Image
            src="/our-services/harvest.webp"
            width={500}
            height={500}
            alt="موسم الحصاد"
            className="w-svw rounded-md shadow-md"
            priority
          />
        </div>
        <div className="mx-5 px-5 text-right">
          <p style={{ fontSize: 20 }}>
            يعتبر الحصاد إحدى المراحل الحاسمة في عملية الزراعة، حيث يتم فيها جني
            المحاصيل الناضجة وجمعها بعد جهد وعناء عملية الزراعة. يشمل الحصاد عدة
            خطوات وتقنيات يجب مراعاتها لضمان الحصول على محاصيل ذات جودة عالية
            وإتمام عملية الإنتاج بنجاح. في هذا المقال، سنستعرض الخطوات الأساسية
            والتقنيات الفعّالة لمرحلة الحصاد.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            1. تحديد موعد الحصاد المناسب
          </h3>
          <p style={{ fontSize: 20 }}>
            يعتمد موعد الحصاد على نوع المحصول وظروف الطقس والمناخ. يجب تحديد
            موعد الحصاد بعناية لضمان نضج المحاصيل بشكل كامل وتجنب جنيها قبل أو
            بعد الوقت المناسب.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            2. استخدام الأدوات والمعدات المناسبة
          </h3>
          <p style={{ fontSize: 20 }}>
            يجب استخدام الأدوات والمعدات المناسبة لكل نوع من المحاصيل المزروعة.
            من ضمن هذه الأدوات: المناجل، الحصّادات الآلية، وأدوات القطاف المخصصة
            لبعض الثمار.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            3. جني المحاصيل بعناية
          </h3>
          <p style={{ fontSize: 20 }}>
            يجب جني المحاصيل بعناية لضمان عدم تلفها أو فقدها. يجب التحكم في سرعة
            العمل وتوجيه الأدوات بحذر لتجنب الإصابة بالمحاصيل القريبة غير
            الناضجة.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            4. التخزين السليم
          </h3>
          <p style={{ fontSize: 20 }}>
            بعد الحصاد، يجب تخزين المحاصيل بطريقة تحافظ على جودتها وتمنع تلفها.
            يجب مراعاة الظروف المناخية المناسبة لكل نوع من المحاصيل وتوفير
            التهوية والرطوبة المناسبة.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            5. التجهيز للتسويق
          </h3>
          <p style={{ fontSize: 20 }}>
            يجب التجهيز لعملية التسويق للمحاصيل بعد الحصاد، بما في ذلك تحضير
            العبوات اللازمة وتوفير وسائل النقل اللازمة لنقل المحاصيل إلى
            الأسواق.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            6. الحفاظ على السلامة
          </h3>
          <p style={{ fontSize: 20 }}>
            يجب الحرص على السلامة خلال عملية الحصاد، بما في ذلك استخدام الأدوات
            بحذر واتباع إجراءات السلامة المعتمدة.
          </p>
          <h3 style={{ fontSize: 30, fontWeight: "bold" }}>
            7. الاستفادة من المخلفات
          </h3>
          <p style={{ fontSize: 20 }}>
            يمكن استخدام المخلفات الناتجة عن عملية الحصاد في عدة طرق مفيدة، مثل
            تحويلها إلى سماد عضوي أو استخدامها في إنتاج الطاقة البيولوجية.
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
