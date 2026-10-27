import type { Metadata } from "next";
import { SITE } from "./site.mjs";
import { getPage, type PageEntry } from "./registry-types";

export function metadataFor(entryOrPath: PageEntry | string): Metadata {
  const page = typeof entryOrPath === "string" ? (getPage(entryOrPath) as PageEntry) : entryOrPath;
  const image = { url: `/og/${page.og}.jpg`, width: 1200, height: 630, alt: `${page.heading} — ${SITE.name}` };
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: (page.section === "guides" && page.path !== "/guides/") || page.published ? "article" : "website",
      ...(page.published ? { publishedTime: page.published, modifiedTime: page.updated } : {}),
      url: page.path,
      siteName: SITE.name,
      title: page.title,
      description: page.description,
      images: [image],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image.url],
    },
  };
}

export const abs = (path: string) => SITE.url + path;
