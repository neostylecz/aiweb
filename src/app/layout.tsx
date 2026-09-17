import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries/site";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase).catch(() => null);
  const siteName = settings?.site_name ?? "NEOAIWEBY";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings?.default_seo_title ?? `${siteName} — AI-driven web design & development`,
      template: `%s — ${siteName}`,
    },
    description:
      settings?.default_seo_description ??
      "NEOAIWEBY designs and builds fast, modern websites and digital products powered by thoughtful design and applied AI.",
    robots: settings?.robots_index === false ? { index: false, follow: false } : undefined,
    verification: settings?.google_site_verification
      ? { google: settings.google_site_verification }
      : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
