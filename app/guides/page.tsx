import { AuthorBox, HelperCta, PageHeader, RelatedCards } from "@/components/Content";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/guides/");
export const metadata = metadataFor(page);

export default function Guides() {
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: "Guides" }]}
        lead="Clear, simple Wordle guides built on real data from our own solver. Learn the best openers, smarter habits and how to break out of word traps."
      />
      <p>
        We wrote these guides for everyday players, not math fans. Each one explains an idea in plain English and backs it up with numbers from tests we ran on our own word
        lists, so you know the advice actually works.
      </p>
      <RelatedCards
        title="Start here"
        paths={["/guides/best-wordle-starting-words/", "/guides/wordle-tips-strategy/", "/guides/wordle-filler-words/", "/guides/how-to-cheat-at-wordle/", "/guides/how-wordle-helper-works/"]}
      />
      <HelperCta title="Ready to put it into practice?" />
      <AuthorBox />
    </>
  );
}
