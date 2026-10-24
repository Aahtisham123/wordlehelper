import type { ReactNode } from "react";
import { AuthorBox, Faq, HelperCta, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { JsonLd } from "@/components/JsonLd";
import { getPage } from "@/lib/registry-types";
import { SITE } from "@/lib/site.mjs";

/** Shared frame for guides: header, Article schema, CTA, FAQ, related links. */
export function GuideLayout({ path, lead, readingTime, faqs, related, children }: { path: string; lead: ReactNode; readingTime: number; faqs?: QA[]; related: string[]; children: ReactNode }) {
  const page = getPage(path);
  return (
    <>
      <PageHeader
        page={page}
        trail={[
          { href: "/guides/", label: "Guides" },
          { href: path, label: page.nav },
        ]}
        lead={lead}
        readingTime={readingTime}
      />
      <article className="prose">{children}</article>
      <HelperCta />
      {faqs && <Faq items={faqs} />}
      <AuthorBox />
      <RelatedCards paths={related} title="Keep reading" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.heading,
          description: page.description,
          url: SITE.url + path,
          mainEntityOfPage: SITE.url + path,
          image: [`${SITE.url}/og/${page.og}.jpg`, ...(page.image ? [`${SITE.url}/images/${page.image}.webp`] : [])],
          datePublished: "2026-10-24",
          dateModified: page.updated,
          author: { "@type": "Organization", name: `${SITE.name} team`, url: `${SITE.url}/about/` },
          publisher: { "@id": `${SITE.url}/#organization` },
          inLanguage: "en-US",
        }}
      />
    </>
  );
}
