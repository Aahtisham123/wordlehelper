import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, Stats, Steps, type QA } from "@/components/Content";
import { JsonLd } from "@/components/JsonLd";
import { GridSolver } from "@/components/tools/GridSolver";
import { getBenchmark, getOpeners, getWords } from "@/lib/data.mjs";
import { filterCandidates, letterStats, matchWords } from "@/lib/engine.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/5-letter-wordle-solver/");
export const metadata = metadataFor(page);

const ABC = "abcdefghijklmnopqrstuvwxyz".split("");
const COLOR = { g: "green", y: "yellow", x: "gray" } as const;
const marks = (p: string) => Array.from(p, (c) => ({ x: 0, y: 1, g: 2 })[c as "x" | "y" | "g"]);

// The worked example shown on the page (answer: NAIVE).
const EXAMPLE = [
  { word: "slate", pattern: "xxyxg" },
  { word: "prone", pattern: "xxxyg" },
  { word: "naive", pattern: "ggggg" },
];

export default function FiveLetterSolver() {
  const five = getWords(5);
  const bench = getBenchmark();
  const openers = getOpeners() as { word: string }[];
  const U = (w: string) => w.toUpperCase();
  const answers = five.answers as string[];

  // Real counts for the worked example.
  const afterOne = filterCandidates(answers, [{ word: "slate", marks: marks("xxyxg") }]) as string[];
  const afterTwo = filterCandidates(answers, EXAMPLE.slice(0, 2).map((r) => ({ word: r.word, marks: marks(r.pattern) }))) as string[];

  // Facts about five-letter answers.
  const repeated = answers.filter((w) => new Set(w).size < 5).length;
  const repeatedPct = Math.round((100 * repeated) / answers.length);
  const atch = matchWords(answers, { pattern: "?atch" }) as string[];
  const stats = letterStats(answers);
  const byPosition = [0, 1, 2, 3, 4].map((p) =>
    ABC.map((c, i) => ({ c, n: stats.positional[p][i] }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3),
  );
  const endsE = answers.filter((w) => w[4] === "e").length;

  const faqs: QA[] = [
    {
      q: "What is a 5 letter Wordle solver?",
      text: "It's a tool that takes the five-letter words you've guessed and the colors you got, then lists every five-letter word that could still be the answer.",
      a: <p>It&apos;s a tool that takes the five-letter words you&apos;ve guessed and the colors Wordle gave you, then lists every five-letter word that could still be the answer, most likely first.</p>,
    },
    {
      q: "How many 5 letter words can be Wordle answers?",
      text: `Our list has ${answers.length} common five-letter words that make realistic answers, and ${five.valid.length} words that Wordle accepts as guesses.`,
      a: (
        <p>
          Our list has {answers.length.toLocaleString()} common five-letter words that make realistic answers, out of {five.valid.length.toLocaleString()} words Wordle accepts as
          guesses. Browse them all in the <Link href="/wordle-word-list/">Wordle word list</Link>.
        </p>
      ),
    },
    {
      q: "Does the solver work with repeated letters?",
      text: "Yes. It scores words with Wordle's own rules, so double letters are handled correctly.",
      a: <p>Yes. It scores words with Wordle&apos;s own rules, so a gray tile on a second copy of a letter is read correctly. That matters, because {repeatedPct}% of likely answers repeat a letter.</p>,
    },
    {
      q: "What's the difference between this page and the Wordle Helper homepage?",
      text: "Both use the same five-letter engine. The homepage adds two more ways to solve: Letter Clues and Guided Solve.",
      a: (
        <p>
          Both use the same five-letter engine and share your board. The <Link href="/">Wordle Helper</Link> homepage adds two more ways to solve, Letter Clues and Guided Solve,
          while this page focuses on the classic guess-and-colors method.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        showImage={false}
        lead="Solve any five-letter Wordle in seconds. Add each guess, tap the tiles to match your colors, and see every 5-letter word that still fits, plus the smartest next guess."
      />

      <section className="card tool-card" aria-label="5 letter Wordle solver">
        <GridSolver length={5} />
      </section>

      <Stats
        items={[
          { icon: "List", value: answers.length.toLocaleString(), label: "likely 5-letter answers" },
          { icon: "BookA", value: five.valid.length.toLocaleString(), label: "valid 5-letter guesses" },
          { icon: "Gauge", value: String(bench.average), label: "average guesses to solve" },
          { icon: "Trophy", value: U(openers[0].word), label: "best tested opener" },
        ]}
      />

      <section className="prose">
        <h2 id="what-is-it">What is a 5 letter Wordle solver?</h2>
        <p>
          The daily Wordle gives you six tries to find one five-letter word. After each guess, every tile turns green, yellow or gray. A 5 letter Wordle solver reads those colors
          for you and works out which words are still possible. Think of it as a very fast, very patient friend who knows {five.valid.length.toLocaleString()} five-letter words by
          heart.
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} caption="Each guess narrows the list until only one five-letter word fits." />
        <p>
          Our solver doesn&apos;t just match letters. For every word in its list, it asks: <em>&ldquo;If this were the answer, would my guesses have shown exactly these colors?&rdquo;</em>{" "}
          Only words that pass that test stay on the list. Then it sorts them so the most likely answers appear first, and suggests a next guess that rules out as many words as
          possible.
        </p>

        <h2 id="how-to-use">How to use the 5 letter Wordle solver</h2>
        <Steps
          items={[
            <><strong>Play your first guess in Wordle.</strong> Not sure what to start with? {openers.slice(0, 3).map((o) => U(o.word)).join(", ")} are our best-tested openers.</>,
            <><strong>Type the same word into the box above</strong> and press <em>Add guess</em>.</>,
            <><strong>Tap each tile to copy your colors.</strong> One tap for yellow, two for green, three to go back to gray.</>,
            <><strong>Pick your next word</strong> from the ranked list or the suggested guesses, play it, and repeat.</>,
          ]}
        />

        <h2 id="example">An example, step by step</h2>
        <p>Here&apos;s an example game where the answer is NAIVE. The word counts come straight from the solver:</p>
        <div className="board" data-length={5} aria-label="Example board: SLATE, PRONE, NAIVE">
          {EXAMPLE.map((r) => (
            <div className="board-row" key={r.word}>
              {Array.from(r.word).map((ch, i) => (
                <span key={i} className={`tile ${COLOR[r.pattern[i] as "g" | "y" | "x"]}`} style={{ cursor: "default" }}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
        <IconList
          icon="ArrowRight"
          items={[
            <><strong>After SLATE:</strong> the A is yellow and the E is green. That leaves <strong>{afterOne.length}</strong> possible words out of {answers.length.toLocaleString()}.</>,
            <><strong>After PRONE:</strong> the N is yellow and the E is green again. Only <strong>{afterTwo.length}</strong> {afterTwo.length === 1 ? "word fits" : "words fit"}: {afterTwo.map(U).join(", ")}.</>,
            <><strong>Third guess:</strong> NAIVE, one of those four. Solved in three.</>,
          ]}
        />
        <p>That&apos;s typical. Two well-chosen guesses usually cut thousands of five-letter words down to a handful.</p>

        <h2 id="tricky">What makes 5-letter Wordle tricky</h2>
        <IconList
          icon="TriangleAlert"
          tone="amber"
          items={[
            <><strong>Repeated letters.</strong> {repeated.toLocaleString()} of our {answers.length.toLocaleString()} likely answers ({repeatedPct}%) use a letter twice, like SPOON or SKILL. People often forget to try them.</>,
            <><strong>Word traps.</strong> Some endings fit lots of words. _ATCH alone fits {atch.length}: {atch.map(U).join(", ")}. Guessing one at a time can cost you the game, so the solver may suggest a <Link href="/guides/wordle-filler-words/">filler word</Link> instead.</>,
            <><strong>Common endings.</strong> {endsE.toLocaleString()} likely answers end in E. Endings like -ER, -LY and -CH show up often too.</>,
          ]}
        />

        <h2 id="letters">The most common letters in each position</h2>
        <p>These are the letters that show up most often in each spot across our likely five-letter answers. The solver uses patterns like these to rank words:</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Most common letters</th>
              </tr>
            </thead>
            <tbody>
              {byPosition.map((list, p) => (
                <tr key={p}>
                  <td>{p + 1}</td>
                  <td>{list.map((x) => `${U(x.c)} (${Math.round((100 * x.n) / answers.length)}%)`).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="which-tool">Which five-letter tool should you use?</h2>
        <IconList
          icon="Grid3x3"
          items={[
            <><strong>This 5 letter Wordle solver:</strong> best when you want to copy your board exactly.</>,
            <><strong><Link href="/wordle-guesser/">Wordle Guesser</Link>:</strong> shows the top 10 next guesses with the numbers behind each one.</>,
            <><strong><Link href="/5-letter-word-finder/">5 Letter Word Finder</Link>:</strong> quick searches by known, starting or ending letters.</>,
            <><strong><Link href="/">Wordle Helper</Link>:</strong> all three solving methods in one place, including a guided mode that picks every guess for you.</>,
          ]}
        />
        <p>
          Playing a different length? Try the <Link href="/4-letter-wordle-solver/">4</Link>, <Link href="/6-letter-wordle-solver/">6</Link> or{" "}
          <Link href="/7-letter-wordle-solver/">7 letter Wordle solver</Link>.
        </p>
      </section>

      <HelperCta title="Want more ways to solve?" text={<>The <Link href="/">Wordle Helper</Link> adds Letter Clues and a step-by-step Guided Solve.</>} />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/wordle-guesser/", "/5-letter-word-finder/", "/guides/best-wordle-starting-words/"]} />
      <AuthorBox />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: page.heading,
          url: SITE.url + page.path,
          applicationCategory: "GameApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: page.description,
          image: `${SITE.url}/og/${page.og}.jpg`,
          publisher: { "@id": `${SITE.url}/#organization` },
          dateModified: page.updated,
        }}
      />
    </>
  );
}
