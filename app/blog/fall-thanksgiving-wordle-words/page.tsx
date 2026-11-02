import Link from "next/link";
import { HeroImage, IconList, Stats, WordGrid, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { CopyButton } from "@/components/CopyButton";
import { getOpeners, getWords } from "@/lib/data.mjs";
import { entropy } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/fall-thanksgiving-wordle-words/";
export const metadata = metadataFor(path);

// Our seasonal picks. Each list is filtered against the word list at build
// time, so only real, valid five-letter words appear on the page.
const THEMES = [
  { id: "nature", title: "Autumn nature words", words: "maple acorn gourd frost chill leafy misty foggy amber rusty hazel straw mulch brown bleak dusky crisp soggy geese flock goose trees woods raked rakes bales crops" },
  { id: "food", title: "Thanksgiving food words", words: "feast gravy roast bread toast sauce apple cider pecan wheat grain sugar honey nutty spicy spice berry peach clove torte tarts baked dates" },
  { id: "together", title: "Gathering and giving thanks", words: "thank grace share table guest carve carol early" },
  { id: "cozy", title: "Cozy sweater-weather words", words: "cocoa scarf plaid stove smoke flame ember cloak boots yarns" },
];

export default function FallWords() {
  const five = getWords(5);
  const answers = five.answers as string[];
  const validSet = new Set(five.valid as string[]);
  const U = (w: string) => w.toUpperCase();
  const themes = THEMES.map((t) => {
    const words = [...new Set(t.words.split(" "))].filter((w) => validSet.has(w)).sort();
    return { ...t, words, common: words.filter((w) => five.answerSet.has(w)) };
  });
  const all = [...new Set(themes.flatMap((t) => t.words))];
  const allCommon = all.filter((w) => five.answerSet.has(w));

  // Which themed word makes the best first guess?
  const ranked = all
    .map((w) => ({ word: w, ...(entropy(w, answers) as { bits: number; buckets: number }) }))
    .sort((a, b) => b.bits - a.bits);
  const bestFall = ranked[0];
  const topOpener = (getOpeners() as { word: string; bits: number }[])[0];
  const left = (bits: number) => Math.round(answers.length / Math.pow(2, bits));

  const faqs: QA[] = [
    {
      q: "What are good fall 5-letter words?",
      text: `Popular fall words include ${["maple", "acorn", "gourd", "frost", "cider"].filter((w) => validSet.has(w)).map(U).join(", ")}.`,
      a: (
        <p>
          Popular picks include {["maple", "acorn", "gourd", "frost", "cider"].filter((w) => validSet.has(w)).map(U).join(", ")}. All of them are valid Wordle guesses, and most are
          everyday words that could be answers too.
        </p>
      ),
    },
    {
      q: "What's the best fall-themed Wordle starting word?",
      text: `Of the fall words we tested, ${U(bestFall.word)} is the strongest opener, leaving about ${left(bestFall.bits)} possible answers on average.`,
      a: (
        <p>
          Of the {all.length} fall words we tested, <strong>{U(bestFall.word)}</strong> is the strongest opener. It leaves about {left(bestFall.bits)} possible answers on average,
          compared with about {left(topOpener.bits)} for our overall favorite, {U(topOpener.word)}.
        </p>
      ),
    },
    {
      q: "Does Wordle use holiday words around Thanksgiving?",
      text: "Wordle doesn't announce themes, so there's no guarantee. A seasonal word list is just a fun way to pick an opener and practice.",
      a: <p>Wordle doesn&apos;t announce themes, so there&apos;s no guarantee of a seasonal answer. A list like this is just a fun way to pick a festive opener and practice your vocabulary.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/guides/best-wordle-starting-words/", "/blog/audio-vs-raise-best-wordle-opener/", "/wordle-word-list/", "/blog/how-to-play-wordle/"]}
      lead="Leaves are turning and Thanksgiving is on its way (it falls on Thursday, November 26 in 2026). Here are cozy five-letter words for the season, and the fall word that makes the smartest Wordle opener."
    >
      <div className="answer-box">
        <strong>Quick pick:</strong> want a seasonal first guess? <strong>{U(bestFall.word)}</strong> is the best fall-themed Wordle opener we tested, followed by{" "}
        {ranked.slice(1, 3).map((r) => U(r.word)).join(" and ")}.
      </div>

      <Stats
        items={[
          { icon: "Leaf", value: String(all.length), label: "fall and Thanksgiving words" },
          { icon: "List", value: String(allCommon.length), label: "could be Wordle answers" },
          { icon: "Trophy", value: U(bestFall.word), label: "best fall-themed opener" },
        ]}
      />

      {themes.map((t, i) => (
        <section key={t.id}>
          <h2 id={t.id}>{t.title}</h2>
          {i === 1 && (
            <HeroImage name="blog-fall-feast" alt="Green letter tiles spelling FEAST and GRAVY, two Thanksgiving five-letter words" caption="Two Thanksgiving favorites that are also valid Wordle words." />
          )}
          <p className="small muted">Highlighted words are common enough to be Wordle answers. The rest are valid guesses.</p>
          <WordGrid words={t.words} common={five.answerSet} />
        </section>
      ))}
      <p>
        <CopyButton text={all.map(U).join(", ")} label="Copy all fall words" what="Word list" />
      </p>

      <h2 id="best-opener">The best fall-themed starting words</h2>
      <p>
        A themed opener is fun, but is it any good? We tested every word on this page as a first guess against all {answers.length.toLocaleString()} likely answers. Here are the top
        five:
      </p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Fall-themed words ranked as Wordle starting words</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Word</th>
              <th scope="col">Color patterns</th>
              <th scope="col">Words left (avg.)</th>
            </tr>
          </thead>
          <tbody>
            {ranked.slice(0, 5).map((r, i) => (
              <tr key={r.word}>
                <td>{i + 1}</td>
                <td>
                  <strong>{U(r.word)}</strong>
                </td>
                <td>{r.buckets}</td>
                <td>~{left(r.bits)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {U(bestFall.word)} isn&apos;t quite as strong as our all-season favorite, {U(topOpener.word)}, which leaves about {left(topOpener.bits)} words. But it&apos;s close enough to be
        a great choice for a festive game. Want the full ranking? See our <Link href="/guides/best-wordle-starting-words/">best Wordle starting words</Link>.
      </p>

      <h2 id="fun">Fun ways to use these words</h2>
      <IconList
        icon="Sparkles"
        tone="amber"
        items={[
          <><strong>Start every November game with a fall word.</strong> Track how many guesses it takes compared with your usual opener.</>,
          <><strong>Make it a family challenge</strong> at the Thanksgiving table: everyone opens with a different word from this list.</>,
          <><strong>Practice with themed games.</strong> Try these words in the <Link href="/wordle-unlimited-solver/">Wordle Unlimited solver</Link> and see how quickly each one narrows things down.</>,
        ]}
      />
      <p>
        And when the real puzzle gets tough, the <Link href="/">Wordle Helper</Link> and <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> are always here to help. Happy
        Thanksgiving!
      </p>
    </BlogLayout>
  );
}
