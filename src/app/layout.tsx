import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./providers/theme-provider";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;

  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme={theme}
            disableTransitionOnChange
            enableSystem
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
