import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const FAQ = {
    heading: "الأسئلة الشائعة",
    items: [
      {
        question: "ما هو مشروع استثمار الفول السوداني؟",
        answer:
          "مشروع استثمار الفول السوداني هو مبادرة تهدف إلى زيادة إنتاجية وجودة الفول السوداني في السودان باستخدام التقنيات الزراعية المتقدمة، وذلك لتلبية الطلب المحلي والعالمي المتزايد.",
      },
      {
        question: "أين يقع المشروع؟",
        answer: "يقع المشروع في مدينة الأبيض بولاية شمال كردفان، السودان.",
      },
      {
        question: "ما هي قيمة السهم الواحد؟",
        answer: "قيمة السهم الواحد هي 2500 ريال قطري.",
      },
      {
        question: "كم مدة المشروع؟",
        answer: "يستمر المشروع لمدة 6 أشهر.",
      },
      {
        question: "متى يتم توزيع الأرباح؟",
        answer: "يتم توزيع الأرباح في 1 فبراير 2025.",
      },
      {
        question: "ما هو العائد المتوقع لكل سهم؟",
        answer:
          "من المتوقع تحقيق أرباح بقيمة 1000 ريال قطري لكل سهم خلال فترة المشروع.",
      },
      {
        question: "ما هو آخر موعد للمساهمة في المشروع؟",
        answer: "يتم إيقاف استلام المساهمات في 15 مايو 2024.",
      },
      {
        question: "كيف يمكنني الاستثمار في المشروع؟",
        answer:
          "يمكنك الاستثمار عن طريق شراء الأسهم بقيمة 2500 ريال قطري لكل سهم.",
      },
      {
        question: "ما الذي يميز هذا المشروع عن غيره؟",
        answer:
          "يتميز المشروع باستخدام التكنولوجيا الزراعية المتقدمة، مما يساهم في تحسين جودة وكمية الإنتاج، ويمنح المستثمرين فرصة للاستفادة من الطلب المتزايد على الفول السوداني.",
      },
      {
        question: "هل يمكنني بيع أسهمي قبل انتهاء المشروع؟",
        answer:
          "لا يمكن بيع الأسهم قبل انتهاء مدة المشروع، ولكن يمكنك الاستفادة من الأرباح المحققة بعد انتهاء فترة الاستثمار.",
      },
    ],
  };
  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      <h1 className="mb-4 select-none text-center text-3xl font-semibold md:mb-14">
        {FAQ.heading}
      </h1>
      {FAQ.items.map((item, index) => (
        <Accordion key={index} type="single" collapsible>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="focus-within:text-foreground/60 hover:text-foreground/60 hover:no-underline dark:focus-within:text-secondary-foreground dark:hover:text-secondary-foreground">
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
