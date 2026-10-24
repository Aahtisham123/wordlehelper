import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollExtras } from "@/components/ScrollExtras";
import { SearchDialog } from "@/components/Search";
import { SiteChrome, type NavGroup } from "@/components/SiteChrome";
import { themeScript } from "@/components/ThemeToggle";
import { ToastProvider } from "@/components/Toast";
import { buildDate } from "@/lib/data.mjs";
import { NAV_GROUPS, getPage } from "@/lib/registry-types";
import { SITE } from "@/lib/site.mjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: "Wordle Helper", template: "%s" },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1117" },
  ],
};

const groups: NavGroup[] = NAV_GROUPS.map((g) => ({
  label: g.label,
  items: g.items.map((href) => {
    const p = getPage(href);
    return { href, label: p.nav, icon: p.icon };
  }),
}));

const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/icon-512.png`,
    email: SITE.email,
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en-US",
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={siteSchema} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ToastProvider>
          <ScrollExtras />
          <SiteChrome groups={groups}>
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer buildYear={Number(buildDate().slice(0, 4))} />
          </SiteChrome>
          <SearchDialog />
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
