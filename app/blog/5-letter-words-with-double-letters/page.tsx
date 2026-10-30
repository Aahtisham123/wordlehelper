import Link from "next/link";
import { HeroImage, IconList, Stats, WordGrid, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { CopyButton } from "@/components/CopyButton";
import { getWords } from "@/lib/data.mjs";
import { rankByFrequency } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/5-letter-words-with-double-letters/";
export const metadata = metadataFor(path);

const counts = (w: string) => {
  const c: Record<string, number> = {};
  for (const ch of w) c[ch] = (c[ch] || 0) + 1;
  return c;
};

export default function DoubleLetters() {
  const answers = getWords(5).answers as string[];
  const U = (w: string) => w.toUpperCase();
  const pct = (n: number) => Math.round((100 * n) / answers.length);

  const repeats = answers.filter((w) => new Set(w).size < 5);
  const sideBySide = repeats.filter((w) => /(.)\1/.test(w));
  const apart = repeats.filter((w) => !/(.)\1/.test(w));
  const triples = answers.filter((w) => Object.values(counts(w)).some((n) => n >= 3));
  const twoPairs = answers.filter((w) => Object.values(counts(w)).filter((n) => n >= 2).length >= 2);

  // Which side-by-side pairs are most common (LL, EE, OO…).
  const pairs: Record<string, string[]> = {};
  for (const w of sideBySide) {
    const ch = /(.)\1/.exec(w)![1];
    (pairs[ch] ??= []).push(w);
  }
  const topPairs = Object.entries(pairs)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .map(([ch, list]) => ({ pair: U(ch + ch), count: list.length, examples: (rankByFrequency(list) as { word: string }[]).slice(0, 5).map((x) => U(x.word)) }));

  // Which letters repeat most often, anywhere in the word.
  const repeated: Record<string, string[]> = {};
  for (const w of repeats) for (const [ch, n] of Object.entries(counts(w))) if (n >= 2) (repeated[ch] ??= []).push(w);
  const topRepeated = Object.entries(repeated)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
    .map(([ch, list]) => ({ letter: U(ch), count: list.length, examples: list.filter((w) => !/(.)\1/.test(w)).slice(0, 4).map(U) }));
  const sideBySideRanked = (rankByFrequency(sideBySide) as { word: string }[]).map((x) => x.word).sort();

  const faqs: QA[] = [
    {
      q: "Can Wordle answers have double letters?",
      text: `Yes. In our list of ${answers.length} likely answers, ${repeats.length} (${pct(repeats.length)}%) repeat at least one letter.`,
      a: (
        <p>
          Yes, and often. In our list of {answers.length.toLocaleString()} likely answers, {repeats.length.toLocaleString()} ({pct(repeats.length)}%) repeat at least one letter.
        </p>
      ),
    },
    {
      q: "How does Wordle show double letters?",
      text: "Each copy of a letter gets its own color. If you guess a letter twice but the answer has it once, one copy is colored and the other is gray.",
      a: <p>Each copy of a letter gets its own color. If you guess a letter twice but the answer only has it once, one copy turns green or yellow and the other turns gray.</p>,
    },
    {
      q: "What is the most common double letter in Wordle?",
      text: `Among side-by-side pairs, ${topPairs[0].pair} is the most common. Counting repeats anywhere in the word, ${topRepeated[0].letter} repeats most often.`,
      a: (
        <p>
          Among side-by-side pairs, <strong>{topPairs[0].pair}</strong> is the most common, as in {topPairs[0].examples.slice(0, 3).join(", ")}. Counting repeats anywhere in the
          word, <strong>{topRepeated[0].letter}</strong> repeats most often.
        </p>
      ),
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/blog/hardest-wordle-words/", "/blog/5-letter-words-no-vowels/", "/5-letter-word-finder/", "/guides/wordle-tips-strategy/"]}
      lead="Most players guess five different letters, so double letters catch them off guard. Yet they're everywhere in Wordle. Here's how common they are, which ones show up most, and how to spot them."
    >
      <div className="answer-box">
        <strong>Quick answer:</strong> about <strong>one in three</strong> likely Wordle answers repeats a letter. The most common side-by-side pairs are{" "}
        {topPairs.slice(0, 4).map((p) => p.pair).join(", ")}, as in words like {topPairs.slice(0, 3).map((p) => p.examples[0]).join(", ")}.
      </div>

      <Stats
        items={[
          { icon: "Layers", value: `${pct(repeats.length)}%`, label: "of likely answers repeat a letter" },
          { icon: "List", value: sideBySide.length.toLocaleString(), label: "have the pair side by side" },
          { icon: "Shuffle", value: apart.length.toLocaleString(), label: "repeat a letter further apart" },
          { icon: "Flame", value: String(triples.length), label: "use one letter three times" },
        ]}
      />

      <h2 id="how-common">How common are double letters in Wordle?</h2>
      <p>
        More common than most people think. Out of {answers.length.toLocaleString()} likely answers in our word list, {repeats.length.toLocaleString()} use at least one letter twice.
        That&apos;s {pct(repeats.length)}%, or roughly every third puzzle.
      </p>
      <p>Repeats come in two flavors:</p>
      <IconList
        icon="Layers"
        items={[
          <><strong>Side by side ({sideBySide.length}):</strong> the letters sit next to each other, like SPOON, BELLY or STAFF.</>,
          <><strong>Spread apart ({apart.length}):</strong> the letters are separated, like the two Es in THEME or the As and Rs in RADAR.</>,
        ]}
      />
      <p>
        A few words even have two different pairs ({twoPairs.length} in our list, like {twoPairs.slice(0, 4).map(U).join(", ")}), and {triples.length} use a single letter three times.
      </p>

      <h2 id="top-pairs">The most common double letters</h2>
      <p>These side-by-side pairs show up most often in likely Wordle answers:</p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Most common side-by-side double letters in five-letter Wordle answers</caption>
          <thead>
            <tr>
              <th scope="col">Pair</th>
              <th scope="col">Words</th>
              <th scope="col">Examples</th>
            </tr>
          </thead>
          <tbody>
            {topPairs.map((p) => (
              <tr key={p.pair}>
                <td>
                  <strong>{p.pair}</strong>
                </td>
                <td>{p.count}</td>
                <td>{p.examples.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Notice that vowels like O and E lead the way. Doubled consonants such as LL, SS and FF often sit at the end of a word: think SKILL, GLASS and STAFF.</p>

      <h2 id="repeat-most">Letters that repeat the most</h2>
      <p>Counting every repeat, side by side or not, these letters show up twice most often:</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Letter</th>
              <th scope="col">Words that repeat it</th>
              <th scope="col">Examples with the letters apart</th>
            </tr>
          </thead>
          <tbody>
            {topRepeated.map((r) => (
              <tr key={r.letter}>
                <td>
                  <strong>{r.letter}</strong>
                </td>
                <td>{r.count}</td>
                <td>{r.examples.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="colors">How Wordle colors double letters</h2>
      <p>
        This is where many players get confused. Each copy of a letter gets its own color, and Wordle never colors more copies than the answer actually has. Here&apos;s an example
        where the answer is ABIDE and you guess SPEED:
      </p>
      <HeroImage
        name="blog-double-letters-rule"
        alt="SPEED guessed against the answer ABIDE: the first E is yellow, the second E is gray and the D is yellow"
        caption="Guessing SPEED against ABIDE: one E turns yellow, the other turns gray."
      />
      <IconList
        icon="Info"
        tone="blue"
        items={[
          <>The answer ABIDE has <strong>one E</strong>, so only one of SPEED&apos;s two Es can be colored.</>,
          <>Neither E is in the right spot, so the first one turns <strong>yellow</strong> and the second turns <strong>gray</strong>.</>,
          <>That gray E doesn&apos;t mean &ldquo;no E&rdquo;. It means <strong>no second E</strong>.</>,
        ]}
      />
      <p>
        Our <Link href="/">Wordle Helper</Link> reads these colors exactly the way Wordle does, so you can enter tricky guesses like SPEED without worrying about the rules.
      </p>

      <h2 id="triples">Words that use a letter three times</h2>
      <p>The rarest repeats of all. These likely answers use a single letter three times:</p>
      <WordGrid words={triples} />

      <h2 id="spot-them">How to spot a double letter</h2>
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[
          <><strong>Few letters left?</strong> If you&apos;ve found three or four letters and nothing fits, try repeating one of them.</>,
          <><strong>Check common endings.</strong> -LL, -SS, -FF and -EE finish lots of words.</>,
          <><strong>Think of E and O first.</strong> They repeat more than any other letters.</>,
          <><strong>Read gray copies carefully.</strong> A gray second copy tells you exactly how many of that letter the answer has.</>,
        ]}
      />

      <h2 id="full-list">All likely answers with side-by-side double letters</h2>
      <p>
        Here are all {sideBySide.length} likely answers with a doubled pair, A to Z. You can also search by letters with our <Link href="/5-letter-word-finder/">5 letter word finder</Link>.
      </p>
      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Show all {sideBySide.length} words</summary>
        <p style={{ marginTop: 12 }}>
          <CopyButton text={sideBySideRanked.map(U).join(", ")} label="Copy all" what="Word list" />
        </p>
        <WordGrid words={sideBySideRanked} />
      </details>
    </BlogLayout>
  );
}
