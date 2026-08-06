import { Geist, Geist_Mono, Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getLocale } from "next-intl/server";

import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ThemeBlockingHeadScript } from "@/components/theme-blocking-head-script";
import { ThemeProvider } from "@/components/theme-provider";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildRootHtmlAttributes } from "@/lib/seo/document-language";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestedLocale = await getLocale();
  const locale: AppLocale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const { lang } = buildRootHtmlAttributes(locale);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <ThemeBlockingHeadScript />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
