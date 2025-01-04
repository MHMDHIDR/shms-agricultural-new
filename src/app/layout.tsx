import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import { ThemeProvider } from "./providers/theme-provider";
import { auth } from "@/server/auth";
import type { Viewport, Metadata } from "next";

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
  const session = await auth();
  const user = session?.user;

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
            defaultTheme={user?.theme ?? "light"}
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
