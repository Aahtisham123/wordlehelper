import Link from "next/link";
import { AuthorBox, HelperCta, PageHeader, RelatedCards } from "@/components/Content";
import { getWords } from "@/lib/data.mjs";
import { LIST_KINDS, getPage, listSlugs } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/5-letter-words/");
export const metadata = metadataFor(page);
const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

export default function ListsIndex() {
  const five = getWords(5);
  const available = new Set(listSlugs(five.valid).map((s) => s.slug));
  const section = (kind: string, title: string, intro: string) => (
    <section className="reveal">
      <h2>{title}</h2>
      <p>{intro}</p>
      <ul className="az">
        {ABC.map((c) =>
          available.has(`${kind}-${c}`) ? (
            <li key={c}>
              <Link href={`/5-letter-words/${kind}-${c}/`} aria-label={LIST_KINDS[kind].label(c.toUpperCase())}>
                {c.toUpperCase()}
              </Link>
            </li>
          ) : (
            <li key={c}>
              <span aria-hidden="true">{c.toUpperCase()}</span>
            </li>
          ),
        )}
      </ul>
    </section>
  );
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        lead="Five-letter word lists for Wordle and other word games, grouped by the letter they start with, end in or contain."
      />
      <p>
        Every list puts the common words, the realistic Wordle answers, first and suggests the best guesses for that pattern. Our dictionary holds{" "}
        {five.answers.length.toLocaleString()} common five-letter words and {five.valid.length.toLocaleString()} valid guesses. You can see them all on the{" "}
        <Link href="/wordle-word-list/">Wordle word list</Link>.
      </p>
      {section("starting-with", "5 letter words starting with…", "Know the first letter? Pick it below to see every five-letter word that starts with it.")}
      {section("ending-in", "5 letter words ending in…", "Got a green tile in the last spot? These lists show every word that ends with that letter.")}
      {section("containing", "5 letter words containing…", "Have a yellow letter but no idea where it goes? Start with the words that contain it anywhere.")}
      <HelperCta title="Have green, yellow and gray letters?" />
      <RelatedCards paths={["/", "/5-letter-word-finder/", "/wordle-word-list/", "/wordle-unscrambler/"]} />
      <AuthorBox />
    </>
  );
}
