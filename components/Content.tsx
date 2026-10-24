import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getPage, type PageEntry } from "@/lib/registry-types";
import { SITE, formatDate } from "@/lib/site.mjs";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ href: "/", label: "Wordle Helper" }, ...trail];
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((c, i) => (
            <li key={c.href}>
              {i > 0 && <Icon name="ChevronRight" size={14} />}
              {i === all.length - 1 ? <span aria-current="page">{c.label}</span> : <Link href={c.href}>{c.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE.url + c.href })),
        }}
      />
    </>
  );
}

const EYEBROW: Record<string, string> = {
  home: "Free Wordle solver",
  daily: "Daily puzzle",
  solvers: "Wordle solver",
  words: "Word tool",
  lists: "Word list",
  guides: "Guide",
  site: "Wordle Helper",
};

/** Breadcrumbs, eyebrow, H1, lead, "last updated" line and optional hero image. */
export function PageHeader({
  page,
  trail,
  lead,
  readingTime,
  showImage = true,
  imagePriority = true,
}: {
  page: PageEntry;
  trail?: Crumb[];
  lead: ReactNode;
  readingTime?: number;
  showImage?: boolean;
  imagePriority?: boolean;
}) {
  return (
    <header className="page-head">
      {trail && <Breadcrumbs trail={trail} />}
      <span className="eyebrow">
        <span className="eyebrow-icon">
          <Icon name={page.icon} size={14} />
        </span>
        {EYEBROW[page.section]}
      </span>
      <h1>{page.heading}</h1>
      <p className="lead">{lead}</p>
      <div className="meta-row">
        <span>
          <Icon name="CalendarDays" size={15} /> Last updated <time dateTime={page.updated}>{formatDate(page.updated)}</time>
        </span>
        <span>
          <Icon name="UserRound" size={15} /> By the <Link href="/about/">Wordle Helper team</Link>
        </span>
        {readingTime ? (
          <span>
            <Icon name="Clock" size={15} /> {readingTime} min read
          </span>
        ) : null}
      </div>
      {showImage && page.image && <HeroImage name={page.image} alt={page.imageAlt ?? ""} priority={imagePriority} />}
    </header>
  );
}

export function HeroImage({ name, alt, priority = false, caption }: { name: string; alt: string; priority?: boolean; caption?: string }) {
  return (
    <figure className="hero-figure">
      <Image src={`/images/${name}.webp`} alt={alt} width={1200} height={630} priority={priority} sizes="(min-width: 1024px) 820px, 100vw" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function IconList({ items, icon = "CircleCheckBig", tone }: { items: ReactNode[]; icon?: string; tone?: "amber" | "red" | "blue" }) {
  return (
    <ul className={`icon-list${tone ? ` ${tone}` : ""}`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className="li-icon">
            <Icon name={icon} size={16} />
          </span>
          <div>{item}</div>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="steps">
      {items.map((item, i) => (
        <li key={i}>
          <div>{item}</div>
        </li>
      ))}
    </ol>
  );
}

export type QA = { q: string; a: ReactNode; text: string };

/** Expandable FAQ with FAQPage schema. `text` is the plain-text answer for schema. */
export function Faq({ items, title = "Frequently asked questions" }: { items: QA[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="reveal">
      <h2 id="faq-title">{title}</h2>
      <div className="faq">
        {items.map((it, i) => (
          <details key={i} open={i === 0}>
            <summary>
              <Icon name="CircleHelp" size={20} className="q-icon" />
              <span>{it.q}</span>
              <Icon name="ChevronDown" size={18} className="chev" />
            </summary>
            <div className="faq-a">{it.a}</div>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.text } })),
        }}
      />
    </section>
  );
}

export function HelperCta({ title = "Stuck on a puzzle?", text }: { title?: string; text?: ReactNode }) {
  return (
    <aside className="cta reveal">
      <p>
        <strong>{title}</strong>
        {text ?? (
          <>
            Enter your guesses into our <Link href="/">Wordle Helper</Link> and see every word that still fits, best options first.
          </>
        )}
      </p>
      <Link className="btn" href="/">
        <Icon name="WandSparkles" size={18} /> Open the Wordle Helper
      </Link>
    </aside>
  );
}

export function RelatedCards({ paths, title = "More free Wordle tools" }: { paths: string[]; title?: string }) {
  return (
    <section className="reveal" aria-labelledby="related-title">
      <h2 id="related-title">{title}</h2>
      <ul className="cards">
        {paths.map((href) => {
          const p = getPage(href);
          return (
            <li key={href}>
              <Link href={href}>
                <span className="card-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <strong>{p.nav}</strong>
                <span className="desc">{p.description}</span>
                <span className="go">
                  Open <Icon name="ArrowRight" size={15} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Stats({ items }: { items: { icon: string; value: string; label: string }[] }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stat reveal" key={s.label}>
          <Icon name={s.icon} size={22} className="stat-icon" />
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function WordGrid({ words, common }: { words: string[]; common?: Set<string> }) {
  return (
    <ul className="word-grid">
      {words.map((w) => (
        <li key={w} className={common?.has(w) ? "common" : undefined}>
          <span>{w}</span>
        </li>
      ))}
    </ul>
  );
}

/** EEAT: who wrote the page and how it was checked. */
export function AuthorBox({ children }: { children?: ReactNode }) {
  return (
    <aside className="author-box reveal" aria-label="About this page">
      <span className="avatar">
        <Icon name="BadgeCheck" size={26} />
      </span>
      <div>
        <strong>Written and tested by the Wordle Helper team</strong>
        <p>
          {children ?? (
            <>
              Every number on this page comes from running our own solver against our word lists, not from guesswork. Learn{" "}
              <Link href="/guides/how-wordle-helper-works/">how our helper works</Link> or <Link href="/contact/">tell us</Link> if you spot a mistake.
            </>
          )}
        </p>
      </div>
    </aside>
  );
}

export function Testimonials({ items }: { items: { quote: string; name: string; detail?: string; rating?: number }[] }) {
  if (!items.length) return null;
  return (
    <section className="reveal" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title">What players say</h2>
      <div className="testimonials">
        {items.map((t, i) => (
          <figure className="testimonial" key={i}>
            {t.rating ? (
              <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }, (_, j) => (
                  <Icon key={j} name="Star" size={16} />
                ))}
              </div>
            ) : null}
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              {t.name}
              {t.detail && <span>{t.detail}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
