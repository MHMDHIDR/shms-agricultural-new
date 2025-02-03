import "@/styles/globals.css";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Nav } from "@/components/custom/nav";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/providers";
import { ThemeProvider } from "@/providers/theme-provider";
import Footer from "@/components/custom/footer";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-kufi",
});

export const metadata: Metadata = {
  title: "Shms Agricultural",
  authors: [{ name: "Mohammed Ibrahim", url: "https://mohammedhaydar.com" }],
  description: "Shms Agricultural",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: "#22c55f",
};

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
      <body className="bg-slate-50 font-noto-kufi text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <Providers>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            enableSystem
          >
            <Nav />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
