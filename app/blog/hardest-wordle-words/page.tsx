import Link from "next/link";
import { HeroImage, IconList, Stats, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { getBenchmark, getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/hardest-wordle-words/";
export const metadata = metadataFor(path);

type Game = { word: string; turns: number; path: string[] };

/** Answers that differ from `word` in exactly one letter: the "look-alikes" behind a word trap. */
function lookAlikes(word: string, answers: string[]) {
  return answers.filter((w) => w !== word && Array.from(w).filter((c, i) => c !== word[i]).length === 1);
}

export default function HardestWords() {
  const five = getWords(5);
  const answers = five.answers as string[];
  const bench = getBenchmark();
  const hardest = bench.hardest as Game[];
  const U = (w: string) => w.toUpperCase();
  const dist = bench.distribution as Record<string, number>;
  const twoOrFewer = (dist["1"] ?? 0) + (dist["2"] ?? 0);
  const sevens = hardest.filter((g) => g.turns >= 7);
  const erWords = hardest.filter((g) => g.word.endsWith("er"));
  const rows = hardest.map((g) => ({ ...g, alikes: lookAlikes(g.word, answers) }));
  const biggest = [...rows].sort((a, b) => b.alikes.length - a.alikes.length)[0];
  const avgAlikes = (answers.reduce((n, w) => n + lookAlikes(w, answers).length, 0) / answers.length).toFixed(1);
  const hardAvgAlikes = (rows.reduce((n, r) => n + r.alikes.length, 0) / rows.length).toFixed(1);

  const faqs: QA[] = [
    {
      q: "What is the hardest Wordle word?",
      text: `In our test, ${sevens.map((g) => U(g.word)).join(" and ")} were the hardest, each taking our solver 7 guesses.`,
      a: (
        <p>
          In our test, <strong>{sevens.map((g) => U(g.word)).join(" and ")}</strong> were the hardest. Each took our solver 7 guesses, one more than Wordle allows. Both belong to a
          big family of look-alike words ending in -ER.
        </p>
      ),
    },
    {
      q: "Why are some Wordle words so hard?",
      text: "Most hard words have many look-alikes that differ by one letter, so each guess can only rule out one or two options.",
      a: <p>Most hard words have lots of look-alikes that differ by just one letter. Each guess can then only rule out one or two options, so you run out of turns.</p>,
    },
    {
      q: "How can I avoid losing to a word trap?",
      text: "When several words share four letters, play a filler word that tests many of the missing letters at once.",
      a: (
        <p>
          When several words share four letters, play a <Link href="/guides/wordle-filler-words/">filler word</Link> that tests many of the missing letters at once, even if it
          can&apos;t be the answer.
        </p>
      ),
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/guides/wordle-filler-words/", "/guides/wordle-tips-strategy/", "/wordle-guesser/", "/blog/what-time-does-wordle-reset/"]}
      lead={`We let our solver play all ${bench.games.toLocaleString()} likely Wordle answers by itself. Most fell in three or four guesses, but ${hardest.length} words fought back. Here they are, and here's what makes them so tough.`}
    >
      <Stats
        items={[
          { icon: "Gauge", value: String(bench.average), label: "average guesses per game" },
          { icon: "Trophy", value: `${bench.solvedWithinFour}%`, label: "solved in 4 or fewer" },
          { icon: "Flame", value: String(hardest.length), label: "words needed 6+ guesses" },
          { icon: "TriangleAlert", value: String(sevens.length), label: "words needed 7" },
        ]}
      />

      <h2 id="how-we-tested">How we found the hardest words</h2>
      <p>
        Asking people which Wordle words feel hard gives you opinions. We wanted numbers. So we set up a simple test: our solver played every one of the{" "}
        {bench.games.toLocaleString()} likely answers in our word list, one game each. It always opened with {U(bench.opener)}, then always played its own top suggestion. No
        luck, no hunches, just the same strategy every time.
      </p>
      <p>
        That gives every word a fair score: the number of guesses the solver needed. Most words were easy. In fact, {twoOrFewer} were solved in two guesses or fewer. A small group,
        though, needed six or even seven tries.
      </p>

      <h2 id="list">The {hardest.length} hardest Wordle words</h2>
      <p>Here&apos;s every word that needed six or more guesses, with the exact guesses the solver played and how many look-alike answers each word has.</p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Hardest Wordle words by number of guesses</caption>
          <thead>
            <tr>
              <th scope="col">Word</th>
              <th scope="col">Guesses</th>
              <th scope="col">Solver&apos;s path</th>
              <th scope="col">Look-alikes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.word}>
                <td>
                  <strong>{U(r.word)}</strong>
                </td>
                <td>{r.turns}</td>
                <td className="path">{r.path.map(U).join(" → ")}</td>
                <td>{r.alikes.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">&ldquo;Look-alikes&rdquo; are other likely answers that differ by exactly one letter.</p>

      <h2 id="why">Why these words are so hard</h2>
      <p>Look down that list and a pattern jumps out. These words aren&apos;t rare or strange. Most are everyday words. The problem is the company they keep.</p>
      <HeroImage name="blog-hardest-trap" alt="Three rows of tiles, GOFER, JOKER and POKER, where only the first letter changes, showing a Wordle word trap" caption="A classic word trap: the last four letters are found, but the first keeps changing." />
      <h3>They live in big families</h3>
      <p>
        The average likely answer has {avgAlikes} look-alikes. The words on our list average {hardAvgAlikes}. Take {U(biggest.word)}: it has {biggest.alikes.length} look-alikes,
        including {biggest.alikes.slice(0, 5).map(U).join(", ")}. When that many words share four letters, each guess can only knock out one or two of them.
      </p>
      <h3>The -ER ending is a minefield</h3>
      <p>
        {erWords.length} of the {hardest.length} hardest words end in -ER: {erWords.map((g) => U(g.word)).join(", ")}. Words like these share their last three letters, often
        their vowel too, so the first two letters are all that&apos;s left to find. Look at the solver&apos;s path for {U(sevens[0]?.word ?? "cover")}: after five guesses it had
        the -ER pinned down, but it still had to try one first letter after another.
      </p>
      <h3>Other well-known traps</h3>
      <IconList
        icon="Puzzle"
        tone="amber"
        items={hardest
          .filter((g) => !g.word.endsWith("er"))
          .map((g) => (
            <span key={g.word}>
              <strong>{U(g.word)}</strong> took {g.turns} guesses. Its look-alikes include {lookAlikes(g.word, answers).slice(0, 4).map(U).join(", ") || "few common words, but its letters are unusual"}.
            </span>
          ))}
      />

      <h2 id="beat-them">How to beat the hardest Wordle words</h2>
      <p>The good news: you can play these words better than a solver that sticks to one fixed strategy. Here&apos;s what works:</p>
      <IconList
        items={[
          <><strong>Spot the trap early.</strong> If you have four letters and can think of three or more words that fit, you&apos;re in a trap. Stop guessing them one by one.</>,
          <><strong>Use a filler word.</strong> Pick a word that tests as many of the possible missing letters as you can, even if it can&apos;t be the answer. Our <Link href="/guides/wordle-filler-words/">filler words guide</Link> has tested examples.</>,
          <><strong>Count your guesses.</strong> With three or more guesses left, a filler word is usually worth it. On your last guess, just pick the most common word.</>,
          <><strong>Let the guesser help.</strong> Enter your board into the <Link href="/wordle-guesser/">Wordle guesser</Link>. If its top pick is marked &ldquo;helper word&rdquo;, that&apos;s a filler it thinks will break the trap.</>,
        ]}
      />

      <h2 id="bottom-line">The bottom line</h2>
      <p>
        The hardest Wordle words aren&apos;t long, rare or tricky to spell. They&apos;re ordinary words with too many neighbors. Recognize the pattern, use a filler word, and even
        COVER and POKER become winnable. Want to see how many words are left in your own game? Put your guesses into the <Link href="/">Wordle Helper</Link>.
      </p>
      <p className="small muted">
        Method: our solver played each of {bench.games.toLocaleString()} likely answers once, opening with {U(bench.opener)} and then taking its top-ranked suggestion. Results depend
        on our word list, which is not the official NYT list.
      </p>
    </BlogLayout>
  );
}
