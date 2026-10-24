import Link from "next/link";
import { IconList, Stats, type QA } from "@/components/Content";
import { GuideLayout } from "@/components/GuideLayout";
import { getBenchmark, getOpeners, getSecondWords, getWords } from "@/lib/data.mjs";
import { letterStats } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/guides/best-wordle-starting-words/";
export const metadata = metadataFor(path);
const ABC = "abcdefghijklmnopqrstuvwxyz".split("");
type Opener = { word: string; bits: number; buckets: number; isAnswer: boolean };

export default function StartingWords() {
  const five = getWords(5);
  const openers = getOpeners() as Opener[];
  const second = getSecondWords() as Record<string, { word: string; bits: number; buckets: number }[]>;
  const bench = getBenchmark();
  const total = five.answers.length;
  const top = openers[0];
  const left = (bits: number) => Math.round(total / Math.pow(2, bits));
  const stats = letterStats(five.answers);
  const freq = ABC.map((c, i) => ({ c, pct: (100 * stats.overall[i]) / total })).sort((a, b) => b.pct - a.pct);
  const positions = [0, 1, 2, 3, 4].map((p) =>
    ABC.map((c, i) => ({ c, n: stats.positional[p][i] }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3),
  );
  const pairBest = second[top.word][0];
  const U = (w: string) => w.toUpperCase();

  const faqs: QA[] = [
    {
      q: "What is the best Wordle starting word?",
      text: `By our tests, ${U(top.word)}. It splits the possible answers into ${top.buckets} color patterns and leaves about ${left(top.bits)} words on average.`,
      a: (
        <p>
          By our tests, <strong>{U(top.word)}</strong>. It splits the possible answers into {top.buckets} different color patterns and leaves about {left(top.bits)} words on
          average. {openers.slice(1, 4).map((o) => U(o.word)).join(", ")} are almost as good, so pick whichever you find easiest to remember.
        </p>
      ),
    },
    {
      q: "What is the best second word in Wordle?",
      text: `If your opener ${U(top.word)} comes back mostly gray, ${U(pairBest.word)} is the strongest follow-up because it tests five new letters.`,
      a: (
        <p>
          If {U(top.word)} comes back mostly gray, {U(pairBest.word)} is the strongest follow-up because it tests five brand-new common letters. If your first guess found letters,
          use them instead. The <Link href="/wordle-guesser/">Wordle guesser</Link> works out the best second word for your exact board.
        </p>
      ),
    },
    {
      q: "What are the most common letters in Wordle?",
      text: `In likely answers the most common letters are ${freq.slice(0, 6).map((f) => U(f.c)).join(", ")}.`,
      a: (
        <p>
          In likely answers the most common letters are {freq.slice(0, 6).map((f) => U(f.c)).join(", ")}. E alone appears in about {Math.round(freq.find((f) => f.c === "e")!.pct)}%
          of answers.
        </p>
      ),
    },
    {
      q: "Should I use the same starting word every day?",
      text: "Using one strong opener every day helps you learn its patterns, which makes your second guess faster and better.",
      a: <p>We think so. Sticking with one strong opener teaches you what its color patterns usually mean, which makes your second guess quicker and smarter.</p>,
    },
  ];

  return (
    <GuideLayout
      path={path}
      readingTime={6}
      faqs={faqs}
      related={["/guides/wordle-tips-strategy/", "/guides/wordle-filler-words/", "/wordle-guesser/", "/"]}
      lead={`We tested all ${five.valid.length.toLocaleString()} valid guesses against ${total.toLocaleString()} likely answers to find the openers that reveal the most. Here's what we found, in plain English.`}
    >
      <Stats
        items={[
          { icon: "Trophy", value: U(top.word), label: "best opener in our tests" },
          { icon: "Layers", value: String(top.buckets), label: "color patterns it can make" },
          { icon: "Target", value: `~${left(top.bits)}`, label: "words left on average" },
        ]}
      />
      <h2 id="top-20">The top 20 Wordle starting words</h2>
      <p>
        For every possible first guess, we worked out the colors it would show against every likely answer. Then we measured how evenly those colors split the answers. The more
        groups, and the more even they are, the fewer words you&apos;re left with. This is measured in <strong>bits</strong>: each extra bit roughly halves the words left.
      </p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Top 20 Wordle starting words ranked by information</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Word</th>
              <th scope="col">Bits</th>
              <th scope="col">Patterns</th>
              <th scope="col">Words left</th>
              <th scope="col">Can win?</th>
            </tr>
          </thead>
          <tbody>
            {openers.slice(0, 20).map((o, i) => (
              <tr key={o.word}>
                <td>{i + 1}</td>
                <td>
                  <strong>{U(o.word)}</strong>
                </td>
                <td>{o.bits.toFixed(2)}</td>
                <td>{o.buckets}</td>
                <td>~{left(o.bits)}</td>
                <td>{o.isAnswer ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">
        Tested against our list of {total.toLocaleString()} likely answers. Other answer lists, including the official one, give slightly different orders, but the same family of
        words always comes out on top.
      </p>

      <h2 id="why">Why these starting words work</h2>
      <p>Look closely and the winners have three things in common:</p>
      <IconList
        items={[
          <><strong>Five different letters.</strong> A repeated letter wastes a tile that could test something new.</>,
          <><strong>Common letters.</strong> R, A, I, S, E, T and L appear in a big share of answers, so you&apos;ll usually light up at least one or two tiles.</>,
          <><strong>Letters in their usual spots.</strong> S loves the start of a word and E loves the end. A green tile tells you far more than a yellow one.</>,
        ]}
      />
      <p>
        You&apos;ll also notice how many top words are anagrams of each other: {openers.slice(0, 8).map((o) => U(o.word)).join(", ")}. Most of the value comes from the letters
        themselves. The order adds the final polish.
      </p>

      <h2 id="second-word">The best second word in Wordle</h2>
      <p>
        If you always use the same opener, it helps to have a backup second word for days when your first guess comes back mostly gray. These pairs test ten different letters
        between them:
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">First word</th>
              <th scope="col">Best second words</th>
              <th scope="col">Patterns together</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(second).map(([first, list]) => (
              <tr key={first}>
                <td>
                  <strong>{U(first)}</strong>
                </td>
                <td>{list.slice(0, 3).map((s) => U(s.word)).join(", ")}</td>
                <td>{list[0].buckets.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        A fixed second word is a safety net, not a rule. If your first guess found a green or two yellows, a second guess that uses that information almost always does better.
        That&apos;s exactly what our <Link href="/wordle-guesser/">Wordle guesser</Link> works out for you.
      </p>

      <h2 id="top-letters">Top letters in Wordle</h2>
      <p>Here&apos;s how often each of the ten most common letters appears in at least one spot across our likely answers:</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Letter</th>
              <th scope="col">Share of answers</th>
            </tr>
          </thead>
          <tbody>
            {freq.slice(0, 10).map((f) => (
              <tr key={f.c}>
                <td>
                  <strong>{U(f.c)}</strong>
                </td>
                <td>{f.pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Most common letters in each position</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Most common letters</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((list, p) => (
              <tr key={p}>
                <td>{p + 1}</td>
                <td>{list.map((x) => `${U(x.c)} (${Math.round((100 * x.n) / total)}%)`).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="proof">Does a good opener really matter?</h2>
      <p>
        Yes. When we let our solver play all {bench.games.toLocaleString()} likely answers starting with {U(bench.opener)}, it needed just <strong>{bench.average} guesses</strong> on
        average and solved {bench.solvedWithinSix}% of games within six. A strong first word sets up every guess that follows.
      </p>
      <p>
        Ready to try it? Type your opener into the <Link href="/">Wordle Helper</Link> with your colors and see how many words are left.
      </p>
    </GuideLayout>
  );
}
