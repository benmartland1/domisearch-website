import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LayoutChrome } from "@/components/LayoutChrome";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DomiSearch - The Search Agency for the AI Era",
    template: "%s · DomiSearch",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "Google Ads agency",
    "AEO",
    "AI Engine Optimisation",
    "AI search",
    "Answer Engine Optimisation",
    "Google Partner",
    "Shopify Partner",
    "ChatGPT visibility",
    "Perplexity visibility",
    "Gemini visibility",
    "AI visibility",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "DomiSearch - The Search Agency for the AI Era",
    description: site.description,
    locale: "en_GB",
    images: [{ url: "/brand/logo.png", width: 1200, height: 630, alt: "DomiSearch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DomiSearch - The Search Agency for the AI Era",
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
