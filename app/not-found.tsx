import type { Metadata } from "next";
import Link from "next/link";
import { RelatedCards } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { SearchButton } from "@/components/Search";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Wordle Helper" },
  description: "We couldn't find that page. Try the Wordle Helper, today's hint or search the site.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <div className="notfound">
        <div className="big-tiles" aria-hidden="true">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </div>
        <h1>This word isn&apos;t in our list</h1>
        <p className="lead" style={{ margin: "0 auto" }}>
          The page you&apos;re looking for doesn&apos;t exist. It may have moved, or the link has a typo.
        </p>
        <div className="actions">
          <Link className="btn btn-lg" href="/">
            <Icon name="WandSparkles" size={18} /> Go to the Wordle Helper
          </Link>
          <Link className="btn btn-ghost btn-lg" href="/wordle-hint-today/">
            <Icon name="Lightbulb" size={18} /> Today&apos;s hint
          </Link>
        </div>
        <div style={{ maxWidth: 420, margin: "18px auto 0" }}>
          <SearchButton />
        </div>
      </div>
      <RelatedCards paths={["/wordle-guesser/", "/5-letter-word-finder/", "/wordle-answers/", "/guides/"]} title="Popular pages" />
    </>
  );
}
