import type { ReactNode } from "react";
import { AuthorBox, Faq, HelperCta, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { JsonLd } from "@/components/JsonLd";
import { getPage } from "@/lib/registry-types";
import { SITE } from "@/lib/site.mjs";

/** Shared frame for blog posts: header, BlogPosting schema, CTA, FAQ, related links. */
export function BlogLayout({ path, lead, faqs, related, children }: { path: string; lead: ReactNode; faqs?: QA[]; related: string[]; children: ReactNode }) {
  const page = getPage(path);
  return (
    <>
      <PageHeader
        page={page}
        trail={[
          { href: "/blog/", label: "Blog" },
          { href: path, label: page.nav },
        ]}
        lead={lead}
        readingTime={page.readingTime}
      />
      <article className="prose">{children}</article>
      <HelperCta />
      {faqs && <Faq items={faqs} />}
      <AuthorBox />
      <RelatedCards paths={related} title="Keep reading" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: page.heading,
          description: page.description,
          url: SITE.url + path,
          mainEntityOfPage: SITE.url + path,
          image: [`${SITE.url}/og/${page.og}.jpg`, ...(page.image ? [`${SITE.url}/images/${page.image}.webp`] : [])],
          datePublished: page.published,
          dateModified: page.updated,
          keywords: page.keywords.join(", "),
          author: { "@type": "Organization", name: `${SITE.name} team`, url: `${SITE.url}/about/` },
          publisher: { "@id": `${SITE.url}/#organization` },
          isPartOf: { "@type": "Blog", name: `${SITE.name} Blog`, url: `${SITE.url}/blog/` },
          inLanguage: "en-US",
        }}
      />
    </>
  );
}
