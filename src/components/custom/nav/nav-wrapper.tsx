"use client";
import { useEffect, useState } from "react";
import { ShmsIcon } from "@/components/custom/icons";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  console.log(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full bg-white transition-all duration-200",
        { "h-12": scrolled, "h-16": !scrolled },
      )}
      dir="ltr"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 text-black select-none">
        <div className="flex items-center">
          <Link href="/">
            <ShmsIcon
              className={clsx("transition-all duration-200", {
                "h-8 w-20": scrolled,
                "h-11 w-24": !scrolled,
              })}
            />
          </Link>
        </div>
        {children}
      </div>
    </nav>
  );
}
