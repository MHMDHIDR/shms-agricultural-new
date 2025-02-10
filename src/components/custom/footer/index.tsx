import Divider from "@/components/custom/divider";
import { APP_TITLE } from "@/lib/constants";
import { api } from "@/trpc/server";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterWrapper from "./footer-wrapper";

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
      { name: "الفريق", href: "/" },
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

export default async function Footer() {
  const socialLinks = await api.socialLinks.getSocialLinks();
  const IconMap = {
    facebook: <Facebook className="size-6" />,
    instagram: <Instagram className="size-6" />,
    twitter: <Twitter className="size-6" />,
    youtube: <Youtube className="size-6" />,
  };

  return (
    <FooterWrapper>
      <footer className="mt-auto bg-slate-50 select-none dark:bg-slate-900">
        <div className="container mx-auto overflow-clip px-4 pt-10 pb-5 md:max-w-[70rem] md:px-0">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-right">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Image
                    src="/logo.svg"
                    alt="logo"
                    className="h-10 w-10 md:h-20 md:w-20"
                    width={56}
                    height={56}
                  />
                  <p className="text-xl font-semibold select-none md:text-3xl">
                    شمــس
                  </p>
                </span>
                <p className="text-muted-foreground mt-6 text-sm leading-loose">
                  منصة استثمارية زراعية توفر مشاريع متنوعة لتعزيز الإنتاج
                  الزراعي باستخدام أحدث التقنيات.
                </p>
              </div>
              <ul className="text-muted-foreground flex items-center gap-3">
                {socialLinks &&
                  socialLinks.length > 0 &&
                  socialLinks.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <Link
                        href={link.socialLink}
                        aria-label={link.socialType}
                        target="_blank"
                      >
                        {
                          IconMap[
                            link.socialType.toLowerCase() as keyof typeof IconMap
                          ]
                        }
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-14 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold">{section.title}</h3>
                  <ul className="text-muted-foreground space-y-4 text-sm">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="hover:text-primary font-medium"
                      >
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Divider className="my-5" />
          <div className="text-muted-foreground flex flex-col justify-between gap-4 pt-4 text-center text-xs font-medium select-none lg:flex-row lg:items-center lg:text-right">
            <p>
              <span>&copy; 2023 - {new Date().getFullYear()} </span> {APP_TITLE}
            </p>
            <ul className="divide-primary flex justify-center divide-x divide-dotted">
              <li className="hover:text-primary px-3">
                <Link href="/terms">الشروط والأحكام</Link>
              </li>
              <li className="hover:text-primary px-3">
                <Link href="/privacy">الخصوصية</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  );
}
