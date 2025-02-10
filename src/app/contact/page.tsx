import { Suspense } from "react";
import { ContactForm } from "./contact-form";
import { LoadingCard } from "@/components/custom/loading";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `تواصل مع | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
};

export default function Contact() {
  return (
    <section className="flex h-screen min-h-screen items-center justify-center p-2.5">
      <Suspense fallback={<LoadingCard renderedSkeletons={3} />}>
        <ContactForm />
      </Suspense>
    </section>
  );
}
