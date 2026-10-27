import Image from "next/image";
import Link from "next/link";
import { HelperCta, PageHeader, RelatedCards } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PAGES, getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE, formatDate } from "@/lib/site.mjs";

const page = getPage("/blog/");
export const metadata = metadataFor(page);

export default function Blog() {
  const posts = PAGES.filter((p) => p.section === "blog" && p.published).sort((a, b) => (a.published! < b.published! ? 1 : -1));
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: "Blog" }]}
        showImage={false}
        lead="Articles for curious Wordle players, written in plain English and backed by data from our own solver."
      />
      <ul className="post-list">
        {posts.map((p, i) => (
          <li key={p.path} className="reveal">
            <Link href={p.path} className="post-card">
              <Image src={`/images/${p.image}.webp`} alt={p.imageAlt ?? ""} width={1200} height={630} priority={i === 0} sizes="(min-width: 768px) 360px, 100vw" />
              <div className="post-body">
                <p className="post-meta">
                  <span>
                    <Icon name="CalendarDays" size={14} /> <time dateTime={p.published}>{formatDate(p.published!)}</time>
                  </span>
                  <span>
                    <Icon name="Clock" size={14} /> {p.readingTime} min read
                  </span>
                </p>
                <h2>{p.heading}</h2>
                <p>{p.description}</p>
                <span className="go">
                  Read the article <Icon name="ArrowRight" size={15} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <HelperCta title="Want to play while you read?" />
      <RelatedCards title="Popular guides" paths={["/guides/best-wordle-starting-words/", "/guides/wordle-tips-strategy/", "/guides/wordle-filler-words/"]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${SITE.name} Blog`,
          url: `${SITE.url}/blog/`,
          description: page.description,
          publisher: { "@id": `${SITE.url}/#organization` },
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.heading, url: SITE.url + p.path, datePublished: p.published, image: `${SITE.url}/images/${p.image}.webp` })),
        }}
      />
    </>
  );
}
