import type { MetadataRoute } from "next";
import { allPages } from "@/lib/allPages";
import { buildDate, getDaily } from "@/lib/data.mjs";
import { SITE } from "@/lib/site.mjs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = getDaily()[0]?.date ?? buildDate();
  return allPages()
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: SITE.url + p.path,
      lastModified: p.section === "daily" ? latest : p.updated,
      changeFrequency: p.changefreq,
      priority: p.priority,
      images: [`${SITE.url}/og/${p.og}.jpg`, ...(p.image ? [`${SITE.url}/images/${p.image}.webp`] : [])],
    }));
}
