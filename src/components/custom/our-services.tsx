"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { services } from "@/schemas/contact"

export default function OurServices() {
  const serviceIndex = 4

  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      <div className="relative grid gap-16 md:grid-cols-2">
        <div className="top-40 h-fit md:sticky">
          <h2 className="mt-4 mb-6 text-4xl font-semibold md:text-5xl">اختبر الفرق معنا</h2>
          <p className="text-muted-foreground dark:text-secondary-foreground font-medium md:text-xl">
            نحن نؤمن بإنشاء شراكات دائمة مع مستثمرينا مع التركيز على النجاح طويل الأمد من خلال
            الابتكار التعاوني والدعم المخصص.
          </p>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row">
            <Button className="gap-2" size="lg" asChild>
              <Link href="/signup">ابدأ الآن</Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href={`/contact?service=${services[serviceIndex]}`}>
                {services[serviceIndex]}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-12 md:gap-20">
          {[
            {
              image: "/our-services/agricultural-investment.webp",
              title: "استثمار",
              text: "نوفر فرص استثمارية مستدامة تساهم في تطوير القطاع الزراعي وتحقيق النمو الاقتصادي.",
              href: "/projects",
            },
            {
              image: "/our-services/preparation.webp",
              title: "تحضير",
              text: "نضمن تحضير التربة واستخدام أفضل الأدوات والتقنيات الحديثة لبدء الزراعة بأفضل جودة.",
              href: "/preparation",
            },
            {
              image: "/our-services/farming.webp",
              title: "زراعة",
              text: "نستخدم أحدث الأساليب لضمان زراعة فعالة وإنتاج محاصيل ذات جودة عالية وصحية.",
              href: "/farming",
            },
            {
              image: "/our-services/harvest.webp",
              title: "حصاد",
              text: "نحرص على تنفيذ عمليات الحصاد بأعلى المعايير لضمان الحصول على أفضل إنتاج.",
              href: "/harvest",
            },
          ].map((service, index) => (
            <Link href={service.href} key={index} className="block">
              <motion.div
                className="rounded-xl border p-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  className="aspect-video w-full rounded-xl border border-dashed object-cover"
                  width={400}
                  height={200}
                  priority
                />
                <div className="p-6">
                  <h3 className="mb-1 text-2xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground dark:text-secondary-foreground">
                    {service.text}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
