import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LayoutChrome } from "@/components/LayoutChrome";
import { MetaPixel } from "@/components/MetaPixel";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";
import "@/components/home/approved.css";

export const viewport: Viewport = {
  // The site is paper; the dark landing pages override this per route.
  themeColor: "#f8f7f1",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DomiSearch - AI Search Visibility Agency",
    template: "%s · DomiSearch",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "AEO agency",
    "Answer Engine Optimisation",
    "AI search visibility",
    "AI search agency",
    "ChatGPT visibility",
    "Perplexity visibility",
    "Gemini visibility",
    "Google AI Overviews",
    "AI visibility for service businesses",
    "Google Ads management",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "DomiSearch - AI Search Visibility Agency",
    description: site.description,
    locale: "en_GB",
    images: [{ url: "/brand/logo.png", width: 1200, height: 630, alt: "DomiSearch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DomiSearch - AI Search Visibility Agency",
    description: site.description,
    images: ["/brand/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link
          rel="preload"
          href="/fonts/Axiforma-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <MetaPixel />
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <div className="grain" aria-hidden />
        <LayoutChrome header={<Header />} footer={<Footer />}>
          {children}
        </LayoutChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
