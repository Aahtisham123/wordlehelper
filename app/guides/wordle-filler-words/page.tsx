import Link from "next/link";
import { IconList, type QA } from "@/components/Content";
import { GuideLayout } from "@/components/GuideLayout";
import { getWords } from "@/lib/data.mjs";
import { bestGuesses, matchWords } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/guides/wordle-filler-words/";
export const metadata = metadataFor(path);
type G = { word: string; bits: number; buckets: number };

export default function Filler() {
  const five = getWords(5);
  const traps = ["?atch", "?ight", "?ound", "?aste", "?ill?"]
    .map((p) => {
      const cands = matchWords(five.answers, { pattern: p }) as string[];
      if (cands.length < 4) return null;
      // Among equally good fillers, prefer everyday words people recognise.
      const best = (bestGuesses(cands, five.valid, { limit: 200, maxPool: five.valid.length }) as G[])
        .sort((a, b) => b.bits - a.bits || Number(five.answerSet.has(b.word)) - Number(five.answerSet.has(a.word)))
        .slice(0, 3);
      return { p, cands, best };
    })
    .filter((t): t is { p: string; cands: string[]; best: G[] } => t !== null);
  const U = (w: string) => w.toUpperCase();
  const atch = traps[0];

  const faqs: QA[] = [
    {
      q: "What are good filler words for Wordle?",
      text: "Good filler words use five different letters you haven't tested, especially the letters that separate your remaining options.",
      a: (
        <p>
          A good filler word uses five different letters you haven&apos;t tried yet, especially the letters that tell your remaining options apart. There&apos;s no single best list:
          the right filler depends on what&apos;s left. That&apos;s why the <Link href="/wordle-guesser/">Wordle guesser</Link> picks one for your exact board.
        </p>
      ),
    },
    {
      q: "Can I use filler words in hard mode?",
      text: "No. Hard mode requires every guess to use the letters you have found, so most filler words are not allowed.",
      a: <p>No. Hard mode makes every guess reuse the letters you&apos;ve found, so most filler words aren&apos;t allowed. That&apos;s what makes word traps so dangerous in hard mode.</p>,
    },
    {
      q: "Isn't a filler word a wasted guess?",
      text: "Not when several words fit. One filler word can guarantee a win on the next turn, while guessing one option at a time might use every remaining turn.",
      a: <p>Not when several words fit. One filler can guarantee a win on the next turn, while guessing options one at a time might use up every turn you have left.</p>,
    },
  ];

  return (
    <GuideLayout
      path={path}
      readingTime={5}
      faqs={faqs}
      related={["/wordle-guesser/", "/guides/wordle-tips-strategy/", "/guides/best-wordle-starting-words/", "/"]}
      lead="A filler word is a guess you play knowing it isn't the answer, because it rules out more words than any guess that could be. Here's when to use one."
    >
      <h2 id="what">What is a Wordle filler word?</h2>
      <p>
        Filler words are your way out of <strong>word traps</strong>. A word trap is when you know four letters but several words still fit. Say you have _ATCH with two guesses
        used. {atch ? atch.cands.map(U).join(", ") : "BATCH, CATCH, HATCH, LATCH, MATCH, PATCH and WATCH"} could all be the answer. Guess them one by one and you could easily run out
        of turns.
      </p>
      <p>
        Instead, play one word packed with as many of those first letters as you can, even though it can&apos;t win. Whichever tile lights up tells you the answer, and you win on
        the very next turn.
      </p>

      <h2 id="when">When should you use one?</h2>
      <IconList
        icon="CircleCheckBig"
        items={[
          "Three or more words fit, and they differ in the same spot.",
          "You have at least two guesses left to spare.",
          "You're playing normal mode, not hard mode.",
        ]}
      />
      <IconList icon="X" tone="red" items={["Only one or two words are left. Just guess one of them.", "It's your last guess. Go for the most likely word."]} />

      <h2 id="examples">Best filler words for common word traps</h2>
      <p>We ran each of these patterns through our solver against all {five.valid.length.toLocaleString()} valid guesses. Here are the best fillers it found:</p>
      {traps.map((t) => (
        <section key={t.p}>
          <h3>
            {U(t.p.replace(/\?/g, "_"))}: {t.cands.length} possible answers
          </h3>
          <p>{t.cands.map(U).join(", ")}</p>
          <p>
            Best filler words:{" "}
            {t.best.map((b, i) => (
              <span key={b.word}>
                {i > 0 && ", "}
                <strong>{U(b.word)}</strong> ({b.buckets} groups)
              </span>
            ))}
            .{" "}
            {t.best[0].buckets === t.cands.length
              ? "The top pick leaves exactly one possible answer, whatever colors come back."
              : `The top pick splits the ${t.cands.length} words into ${t.best[0].buckets} groups.`}
          </p>
        </section>
      ))}
      <p className="small muted">The answer lists above come from our dictionary of likely answers. The real game may differ slightly, but the same fillers still work.</p>

      <h2 id="early">Filler words early in the game</h2>
      <p>
        The same idea works on your second guess. If your opener comes back all gray, don&apos;t try to guess the answer yet. Play a second word with five fresh common letters.
        Our <Link href="/guides/best-wordle-starting-words/">best second words</Link> table has ready-made picks. Together, two guesses test ten letters and usually leave just a few
        words.
      </p>
      <p>
        Not sure it&apos;s time for a filler? Put your board into the <Link href="/">Wordle Helper</Link>. If the top suggestion is marked &ldquo;helper word&rdquo;, that&apos;s a filler
        word, and it&apos;s the solver&apos;s best move.
      </p>
    </GuideLayout>
  );
}
