import Link from "next/link";
import { PageHeader } from "@/components/Content";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/terms/");
export const metadata = metadataFor(page);

export default function Terms() {
  return (
    <>
      <PageHeader page={page} trail={[{ href: page.path, label: "Terms of Use" }]} showImage={false} lead={`By using ${SITE.domain}, you agree to these simple terms.`} />
      <section className="prose">
        <h2>Using the Site</h2>
        <p>
          The Site and its tools, including the <Link href="/">Wordle Helper</Link>, are free for personal, non-commercial use. Please don&apos;t copy or republish large parts of the
          Site, scrape it in a way that slows it down, or use it for anything unlawful.
        </p>
        <h2>Accuracy</h2>
        <p>
          We work hard to keep our word lists, hints and answers accurate, but the Site is provided &ldquo;as is&rdquo;, without warranties of any kind. Word games may use different
          dictionaries from ours, and we can&apos;t promise that a suggested word is the answer to any particular puzzle.
        </p>
        <h2>Intellectual property</h2>
        <p>
          The Site&apos;s design, text, images and code belong to {SITE.name}. Word lists are based on SCOWL, copyright Kevin Atkinson and contributors, used under its{" "}
          <a href="/LICENSE-SCOWL.txt">license</a>. Wordle is a trademark of The New York Times Company; see our <Link href="/disclaimer/">disclaimer</Link>.
        </p>
        <h2>Limitation of liability</h2>
        <p>To the fullest extent the law allows, {SITE.name} isn&apos;t liable for any loss from using the Site. Yes, that includes broken streaks.</p>
        <h2>Changes</h2>
        <p>
          We may update these terms at any time. Using the Site after a change means you accept the new terms. Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </>
  );
}
