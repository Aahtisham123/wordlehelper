import Link from "next/link";
import { HeroImage, IconList, Stats, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { getWords } from "@/lib/data.mjs";
import { rankByFrequency } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/common-wordle-word-starts-and-endings/";
export const metadata = metadataFor(path);

type Row = { key: string; count: number; examples: string[] };

function tally(answers: string[], keyOf: (w: string) => string, limit: number): Row[] {
  const groups: Record<string, string[]> = {};
  for (const w of answers) (groups[keyOf(w)] ??= []).push(w);
  return Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1))
    .slice(0, limit)
    .map(([key, list]) => ({ key: key.toUpperCase(), count: list.length, examples: (rankByFrequency(list) as { word: string }[]).slice(0, 4).map((x) => x.word.toUpperCase()) }));
}

function Table({ rows, label, caption, pct }: { rows: Row[]; label: string; caption: string; pct: (n: number) => string }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{label}</th>
            <th scope="col">Answers</th>
            <th scope="col">Share</th>
            <th scope="col">Examples</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td>
                <strong>{r.key}</strong>
              </td>
              <td>{r.count}</td>
              <td>{pct(r.count)}%</td>
              <td>{r.examples.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StartsAndEndings() {
  const answers = getWords(5).answers as string[];
  const pct = (n: number) => ((100 * n) / answers.length).toFixed(1);
  const first = tally(answers, (w) => w[0], 6);
  const last = tally(answers, (w) => w[4], 6);
  const starts2 = tally(answers, (w) => w.slice(0, 2) + "-", 10);
  const ends2 = tally(answers, (w) => "-" + w.slice(3), 10);
  const starts3 = tally(answers, (w) => w.slice(0, 3) + "-", 6);
  const ends3 = tally(answers, (w) => "-" + w.slice(2), 6);
  const endEY = answers.filter((w) => w[4] === "e" || w[4] === "y").length;
  const er = answers.filter((w) => w.endsWith("er")).length;
  const letterLink = (kind: string, c: string) => `/5-letter-words/${kind}-${c.toLowerCase()}/`;

  const faqs: QA[] = [
    {
      q: "What is the most common first letter in Wordle?",
      text: `${first[0].key} starts more likely Wordle answers than any other letter: ${first[0].count} of ${answers.length} (${pct(first[0].count)}%).`,
      a: (
        <p>
          {first[0].key}. It starts {first[0].count} of our {answers.length.toLocaleString()} likely answers ({pct(first[0].count)}%), well ahead of {first[1].key} ({first[1].count}) and{" "}
          {first[2].key} ({first[2].count}).
        </p>
      ),
    },
    {
      q: "What is the most common ending in Wordle?",
      text: `${ends2[0].key} is the most common two-letter ending, found in ${ends2[0].count} likely answers.`,
      a: <p>{ends2[0].key} is the most common two-letter ending by far, found in {ends2[0].count} likely answers. Among single letters, {last[0].key} ends the most words.</p>,
    },
    {
      q: "How can word starts and endings help me in Wordle?",
      text: "Once you know one or two letters, common patterns tell you where they probably go and which letters to try next.",
      a: <p>Once you know a letter or two, common patterns tell you where they probably go and which letters to try next. A Y, for example, is much more likely to be last than first.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/5-letter-word-finder/", "/5-letter-words/", "/blog/5-letter-words-with-double-letters/", "/guides/wordle-tips-strategy/"]}
      lead="Wordle answers aren't random strings of letters. They follow patterns, and the start and end of a word are where those patterns are strongest. We counted every beginning and ending in our answer list."
    >
      <div className="answer-box">
        <strong>Quick answer:</strong> the most common starts are {starts2.slice(0, 3).map((r) => r.key).join(", ")} and the most common ending is {ends2[0].key}, which finishes{" "}
        {er} likely answers. {first[0].key} is the most common first letter, and {last[0].key} and {last[1].key} end {pct(endEY)}% of all answers.
      </div>

      <Stats
        items={[
          { icon: "ArrowRight", value: `${first[0].key} ${pct(first[0].count)}%`, label: "most common first letter" },
          { icon: "Flame", value: `${ends2[0].key} ${ends2[0].count}`, label: "most common ending" },
          { icon: "Layers", value: `${pct(endEY)}%`, label: `of answers end in ${last[0].key} or ${last[1].key}` },
        ]}
      />

      <h2 id="first-last">The most common first and last letters</h2>
      <p>
        Start with the simplest pattern. Some letters love the front of a word, others the back. {first[0].key} is the clear favorite to start an answer, while{" "}
        {last[0].key} and {last[1].key} dominate the final spot.
      </p>
      <Table rows={first} label="First letter" caption="Most common first letters in Wordle answers" pct={pct} />
      <Table rows={last} label="Last letter" caption="Most common last letters in Wordle answers" pct={pct} />
      <p>
        Browse every answer for a letter in our lists of words <Link href={letterLink("starting-with", first[0].key)}>starting with {first[0].key}</Link> or{" "}
        <Link href={letterLink("ending-in", last[0].key)}>ending in {last[0].key}</Link>.
      </p>

      <h2 id="starts">The most common word starts</h2>
      <p>Two-letter openings like these show up again and again. Most are consonant blends, two consonants that sound smooth together:</p>
      <Table rows={starts2} label="Start" caption="Most common two-letter starts in Wordle answers" pct={pct} />

      <h2 id="endings">The most common word endings</h2>
      <p>
        Endings are even more predictable. {ends2[0].key} alone covers {pct(ends2[0].count)}% of answers, more than twice as many as the next ending. That&apos;s also why -ER
        words are behind so many of the <Link href="/blog/hardest-wordle-words/">hardest Wordle words</Link>.
      </p>
      <Table rows={ends2} label="Ending" caption="Most common two-letter endings in Wordle answers" pct={pct} />

      <h2 id="three-letter">Three-letter starts and endings</h2>
      <p>Zoom in to three letters and a few patterns stand out even more:</p>
      <IconList
        icon="ArrowRight"
        items={starts3.map((r) => (
          <span key={r.key}>
            <strong>{r.key}</strong> starts {r.count} answers, like {r.examples.slice(0, 3).join(", ")}.
          </span>
        ))}
      />
      <IconList
        icon="ArrowLeftRight"
        tone="blue"
        items={ends3.map((r) => (
          <span key={r.key}>
            <strong>{r.key}</strong> ends {r.count} answers, like {r.examples.slice(0, 3).join(", ")}.
          </span>
        ))}
      />

      <h2 id="use-it">How to use these patterns in your game</h2>
      <HeroImage
        name="blog-starts-endings-example"
        alt="Tiles showing S at the start and Y at the end with the middle unknown, then the solved word STORY"
        caption="An S at the start and a Y at the end narrow things down fast."
      />
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[
          <><strong>Put letters where they usually live.</strong> If you know there&apos;s an S, try it first. If there&apos;s a Y, try it last.</>,
          <><strong>Think in chunks.</strong> Found an E and an R? Test -ER at the end before anything else.</>,
          <><strong>Blends come in pairs.</strong> A yellow H after a C or S often means a CH- or SH- start.</>,
          <><strong>Use the finder for patterns.</strong> Our <Link href="/5-letter-word-finder/">5 letter word finder</Link> has &ldquo;starts with&rdquo; and &ldquo;ends with&rdquo; boxes made for this.</>,
        ]}
      />
      <p>
        Patterns are a great shortcut, but they&apos;re not rules. When you want to be sure, enter your board into the <Link href="/">Wordle Helper</Link> and see every word that
        still fits.
      </p>
    </BlogLayout>
  );
}
