import "@/styles/globals.css";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Nav } from "@/components/custom/nav";
import { Providers } from "@/providers";
import { ThemeProvider } from "@/providers/theme-provider";
import Footer from "@/components/custom/footer";
import { NavigateTop } from "@/components/custom/navigate-top";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: APP_TITLE,
  authors: [{ name: "Mohammed Ibrahim", url: "https://mohammedhaydar.com" }],
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: "#22c55f",
};

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-kufi",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      className={`${notoKufiArabic.variable}`}
      suppressHydrationWarning
      dir="rtl"
    >
      <body className="font-noto-kufi flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <Providers>
          <ThemeProvider attribute="class">
            <Nav />
            <main className="flex-1">{children}</main>
            <NavigateTop />
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
