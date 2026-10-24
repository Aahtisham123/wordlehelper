import Link from "next/link";
import { PageHeader } from "@/components/Content";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/disclaimer/");
export const metadata = metadataFor(page);

export default function Disclaimer() {
  return (
    <>
      <PageHeader page={page} trail={[{ href: page.path, label: "Disclaimer" }]} showImage={false} lead={<strong>{SITE.name} is not affiliated with The New York Times.</strong>} />
      <section className="prose">
        <p>
          Wordle® is a registered trademark of The New York Times Company. {SITE.name} ({SITE.domain}) is an independent, fan-made website with tools, hints and guides for players. It
          is not affiliated with, endorsed by, sponsored by or otherwise connected to The New York Times Company or the creator of Wordle.
        </p>
        <p>
          We use the name &ldquo;Wordle&rdquo; only to describe the game our tools help with. We don&apos;t use The New York Times&apos; logos or game design, and our tools don&apos;t
          copy the game itself.
        </p>
        <p>
          Hints and answers are published for players who want them and are always hidden behind a reveal. Our word lists are our own and are not the official Wordle word list.
        </p>
        <p>
          To play the official game, visit The New York Times website. To get help with it, use our <Link href="/">Wordle Helper</Link>.
        </p>
      </section>
    </>
  );
}
