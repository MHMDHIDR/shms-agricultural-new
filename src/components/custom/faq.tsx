import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/trpc/server";

export default async function FAQ() {
  const FAQ = await api.faq.getAll();
  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      <h1 className="mb-4 text-center text-3xl font-semibold select-none md:mb-14">
        الأسئلة الشائعة
      </h1>
      {FAQ.map((item, index) => (
        <Accordion key={index} type="single" collapsible>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="focus-within:text-foreground/60 hover:text-foreground/60 dark:focus-within:text-secondary-foreground dark:hover:text-secondary-foreground hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="leading-loose">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </section>
  );
}
