import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, Faq, HelperCta, IconList, PageHeader, RelatedCards, WordGrid, type QA } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { getWords } from "@/lib/data.mjs";
import { rankByFrequency } from "@/lib/engine.mjs";
import { LIST_KINDS, listPage, listSlugs, parseListSlug } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

export const dynamicParams = false;
const ABC = "abcdefghijklmnopqrstuvwxyz".split("");
const VOWELS = "aeiou";

export function generateStaticParams() {
  return listSlugs(getWords(5).valid).map(({ slug }) => ({ slug }));
}

function data(slug: string) {
  const parsed = parseListSlug(slug);
  if (!parsed) return null;
  const five = getWords(5);
  const all: string[] = five.valid.filter(LIST_KINDS[parsed.kind].test(parsed.letter));
  if (!all.length) return null;
  const common = all.filter((w) => five.answerSet.has(w));
  return { ...parsed, all, common, rare: all.filter((w) => !five.answerSet.has(w)), page: listPage(slug, { all: all.length, common: common.length }) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = data((await params).slug);
  return d ? metadataFor(d.page) : {};
}

function topLetters(list: string[], skip: string) {
  const freq: Record<string, number> = {};
  for (const w of list) for (const ch of new Set(w)) if (ch !== skip) freq[ch] = (freq[ch] || 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([ch, n]) => ({ ch: ch.toUpperCase(), pct: Math.round((100 * n) / list.length) }));
}

export default async function ListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = data(slug);
  if (!d) notFound();
  const { kind, letter, all, common, rare, page } = d;
  const L = letter.toUpperCase();
  const phrase = LIST_KINDS[kind].phrase(L);
  const base = common.length ? common : all;
  const best = (rankByFrequency(base) as { word: string }[]).slice(0, 8).map((x) => x.word);
  const letters = topLetters(base, letter);
  const doubles = common.filter((w) => new Set(w).size < 5).length;
  const oneVowel = common.filter((w) => Array.from(w).filter((c) => VOWELS.includes(c)).length <= 1).length;
  const available = new Set(listSlugs(getWords(5).valid).map((s) => s.slug));
  const link = (k: string, c: string, text: string) =>
    available.has(`${k}-${c}`) ? (
      <Link href={`/5-letter-words/${k}-${c}/`}>{text}</Link>
    ) : (
      <span className="muted">{text}</span>
    );

  const insights: React.ReactNode[] = common.length
    ? [
        <>There are <strong>{common.length}</strong> common five-letter words {phrase}, the kind Wordle picks as answers, and <strong>{all.length}</strong> in total with rare words.</>,
        ...(letters.length ? [<>The letters that most often appear with {L} here are {letters.map((l) => `${l.ch} (${l.pct}%)`).join(", ")}. They&apos;re great letters to test next.</>] : []),
        ...(doubles ? [<>{doubles} of the common words repeat a letter, so don&apos;t rule out doubles.</>] : []),
        ...(oneVowel ? [<>{oneVowel} have only one vowel (A, E, I, O or U).</>] : []),
      ]
    : [<>{L} is rare in this spot. No common five-letter words are {phrase}, only {all.length} rare {all.length === 1 ? "word" : "words"} that count as valid guesses. It&apos;s very unlikely to be a Wordle answer pattern.</>];

  const faqs: QA[] = [
    {
      q: `How many 5 letter words are ${phrase}?`,
      text: `Our Wordle dictionary has ${common.length} common five-letter words ${phrase}, and ${all.length} including rare ones.`,
      a: <p>Our Wordle dictionary has {common.length} common five-letter words {phrase}, and {all.length} including rare ones.</p>,
    },
    {
      q: `What's a good Wordle guess ${phrase}?`,
      text: best.length ? `${best.slice(0, 3).map((w) => w.toUpperCase()).join(", ")} are strong picks because they use the letters most common in this list.` : "Try a different pattern.",
      a: (
        <p>
          {best.slice(0, 3).map((w) => w.toUpperCase()).join(", ")} are strong picks. They use the letters that appear most often in the other words on this list, so they rule out
          the most options.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        page={page}
        trail={[
          { href: "/5-letter-words/", label: "5 Letter Words" },
          { href: page.path, label: page.heading },
        ]}
        showImage={false}
        lead={`${all.length} five-letter words ${phrase}, with the most likely Wordle answers first.`}
      />
      {best.length > 0 && (
        <div className="suggest">
          <h3>Best Wordle guesses {phrase}</h3>
          <p style={{ margin: 0 }}>
            {best.map((w, i) => (
              <span key={w}>
                {i > 0 && " · "}
                <strong className="w">{w.toUpperCase()}</strong>
              </span>
            ))}
          </p>
        </div>
      )}
      <IconList icon="Sparkles" items={insights} />
      <p>
        Know more than one letter? Enter your guesses into the <Link href="/">Wordle Helper</Link> to use every clue at once, or search by several letters with the{" "}
        <Link href="/5-letter-word-finder/">5 letter word finder</Link>.
      </p>
      {common.length > 0 && (
        <section>
          <div className="list-toolbar">
            <h2 style={{ margin: "24px 0 0" }}>
              Common 5 letter words {phrase} ({common.length})
            </h2>
            <CopyButton text={common.map((w) => w.toUpperCase()).join(", ")} label="Copy list" what="Word list" />
          </div>
          <WordGrid words={common} />
        </section>
      )}
      {rare.length > 0 && (
        <section>
          <div className="list-toolbar">
            <h2 style={{ margin: "24px 0 0" }}>
              Rare 5 letter words {phrase} ({rare.length})
            </h2>
            <CopyButton text={rare.map((w) => w.toUpperCase()).join(", ")} label="Copy list" what="Word list" />
          </div>
          <p className="small muted">Accepted as guesses, but unlikely to be the answer.</p>
          <WordGrid words={rare} />
        </section>
      )}
      <HelperCta />
      <h2>More 5 letter word lists</h2>
      <p>
        {Object.keys(LIST_KINDS)
          .filter((k) => k !== kind)
          .map((k, i) => (
            <span key={k}>
              {i > 0 && " · "}
              {link(k, letter, LIST_KINDS[k].label(L))}
            </span>
          ))}
      </p>
      <ul className="az" aria-label={`Other letters: 5 letter words ${LIST_KINDS[kind].phrase("").trim()}`}>
        {ABC.filter((c) => c !== letter).map((c) => (
          <li key={c}>{available.has(`${kind}-${c}`) ? <Link href={`/5-letter-words/${kind}-${c}/`} aria-label={LIST_KINDS[kind].label(c.toUpperCase())}>{c.toUpperCase()}</Link> : <span aria-hidden="true">{c.toUpperCase()}</span>}</li>
        ))}
      </ul>
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/5-letter-word-finder/", "/wordle-word-list/", "/wordle-dictionary/"]} />
      <AuthorBox>Word counts on this page are generated straight from our word list, so they always match what the tools search.</AuthorBox>
    </>
  );
}
