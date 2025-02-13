import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `نبذة عــن | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default function AboutPage() {
  return (
    <main className="rtl flex min-h-screen flex-col justify-between p-24">
      <h1 className="underline-hover mx-auto w-fit text-center text-xl">نبذة عن منصة شمس</h1>

      <h2 className="mt-8 text-right text-lg font-bold underline underline-offset-4">رؤيتنا:</h2>
      <p className="text-xl leading-10">
        رؤيتنا في منصة شمس الزراعية هي أن نصبح الرائدين في مجال توفير الخدمات الزراعية الاستثمارية
        بالمساهمة وتحقيق الاستدامة البيئية والاقتصادية في القطاع الزراعي.
      </p>

      <h2 className="mt-8 text-right text-lg font-bold underline underline-offset-4">أهدافنا:</h2>
      <p className="text-xl leading-10">
        تسعى منصة شمس لتحقيق عدة أهداف، منها دعم المزارعين والمستثمرين في القطاع الزراعي، وتعزيز
        البنية التحتية الزراعية، وتطوير التكنولوجيا المستخدمة في الزراعة لتحقيق أفضل العوائد.
      </p>

      <h2 className="mt-8 text-right text-lg font-bold underline underline-offset-4">قيمنا:</h2>
      <p className="text-xl leading-10">
        تقوم منصة شمس على عدة قيم، منها الشفافية والنزاهة في التعاملات، والاحترافية في تقديم
        الخدمات، والابتكار والتطوير المستمر لتحسين الأداء وتلبية احتياجات العملاء بشكل مستمر.
      </p>
    </main>
  )
}
