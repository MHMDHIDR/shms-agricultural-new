import { Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import Divider from "@/components/custom/divider"
import { LoadingCard } from "@/components/custom/loading"
import { ADMIN_EMAIL, ADMIN_PHONE, APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { ContactForm } from "./contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `تواصل مع | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default function Contact() {
  return (
    <section className="flex select-none flex-col h-screen min-h-screen items-center justify-center p-2.5 pt-16 mb-20">
      <div className="mt-14 flex w-full flex-col items-center text-center gap-y-10">
        <div>
          <span className="text-sm font-semibold">تواصل معنا</span>
          <h1 className="mb-3 mt-1 text-balance text-3xl font-semibold md:text-4xl">
            تواصل مع فريقنا المتحمس
          </h1>
          <p className="text-lg text-muted-foreground">
            نحن نحب أن نساعدك. قم بملء النموذج أو أرسل لنا بريدًا إلكترونيًا.
          </p>
        </div>
        <div className="flex justify-evenly items-center w-full">
          <div>
            <span className="mb-3 mx-auto flex size-12 flex-col items-center justify-center rounded-full bg-accent">
              <Mail className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">البريد الإلكتروني</p>
            <p className="mb-3 text-muted-foreground">فريقنا على أتم الاستعداد لمساعدتك.</p>
            <Link href={`mailto:${ADMIN_EMAIL}`} className="font-semibold hover:underline">
              {ADMIN_EMAIL}
            </Link>
          </div>
          <div>
            <span className="mb-3 mx-auto flex size-12 flex-col items-center justify-center rounded-full bg-accent">
              <Phone className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">اتصل بنا</p>
            <p className="mb-3 text-muted-foreground">نحن متاحون يوميًا في كل الأوقات.</p>
            <Link href={`tel:${ADMIN_PHONE}`} className="font-semibold hover:underline" dir="ltr">
              {ADMIN_PHONE}
            </Link>
          </div>
        </div>
      </div>

      <Divider className="my-10" />

      <Suspense fallback={<LoadingCard renderedSkeletons={3} />}>
        <ContactForm />
      </Suspense>
    </section>
  )
}
