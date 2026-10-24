import Link from "next/link";
import { IconList, PageHeader } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { Icon } from "@/components/Icon";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/contact/");
export const metadata = metadataFor(page);

export default function Contact() {
  return (
    <>
      <PageHeader page={page} trail={[{ href: page.path, label: "Contact" }]} lead="Questions, feedback, a missing word or a bug to report? We'd love to hear from you." />
      <section className="card tool-card">
        <p style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: 0 }}>
          <Icon name="Mail" size={22} />
          <a href={`mailto:${SITE.email}`} style={{ fontWeight: 700, fontSize: "1.15rem" }}>
            {SITE.email}
          </a>
          <CopyButton text={SITE.email} label="Copy email" what="Email address" />
        </p>
        <p className="small muted" style={{ margin: "10px 0 0" }}>
          We read every message and reply to most within a few days.
        </p>
      </section>
      <section className="prose">
        <h2>What to include</h2>
        <IconList
          items={[
            <><strong>Word list fixes:</strong> the word, and the game where you saw it.</>,
            <><strong>Bug reports:</strong> the page, your device and browser, and the guesses and colors you entered.</>,
            <><strong>Hint fixes:</strong> the puzzle number and date.</>,
          ]}
        />
        <p>
          Please don&apos;t ask us for tomorrow&apos;s answer early. We only publish hints once a puzzle is live. Stuck on today&apos;s? The <Link href="/">Wordle Helper</Link> can get
          you there.
        </p>
      </section>
    </>
  );
}
