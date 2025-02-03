import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "الخدمات",
    links: [
      { name: "تحضير", href: "/preparation" },
      { name: "زراعة", href: "/farming" },
      { name: "حصاد", href: "/harvest" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { name: "من نحن", href: "about" },
      { name: "الفريق", href: "#" },
    ],
  },
  {
    title: "الموارد",
    links: [
      { name: "الدعم", href: "contact" },
      { name: "الخصوصية", href: "privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-right">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <img
                    src="https://shadcnblocks.com/images/block/block-1.svg"
                    alt="logo"
                    className="h-11"
                  />
                  <p className="text-3xl font-semibold">شمــس</p>
                </span>
                <p className="mt-6 text-sm text-muted-foreground">
                  منصة استثمارية زراعية توفر مشاريع متنوعة لتعزيز الإنتاج
                  الزراعي باستخدام أحدث التقنيات.
                </p>
              </div>
              <ul className="flex items-center space-x-6 text-muted-foreground">
                <li className="font-medium hover:text-primary">
                  <Link href="#">
                    <Instagram className="size-6" />
                  </Link>
                </li>
                <li className="font-medium hover:text-primary">
                  <Link href="#">
                    <Facebook className="size-6" />
                  </Link>
                </li>
                <li className="font-medium hover:text-primary">
                  <Link href="#">
                    <Twitter className="size-6" />
                  </Link>
                </li>
                <li className="font-medium hover:text-primary">
                  <Link href="#">
                    <Linkedin className="size-6" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="font-medium hover:text-primary"
                      >
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-right">
            <p>© 2024 شمــس. جميع الحقوق محفوظة.</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <Link href="/terms"> الشروط والأحكام</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="/privacy"> سياسة الخصوصية</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
