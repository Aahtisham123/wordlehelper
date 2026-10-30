import Link from "next/link";
import { Alert } from "@/components/Alert";
import { HeroImage, IconList, Stats, Steps, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { getBenchmark, getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/protect-your-wordle-streak/";
export const metadata = metadataFor(path);

type Family = { pattern: string; words: string[] };

/** Groups of answers that share four letters in the same spots: the word traps. */
function trapFamilies(answers: string[]): Family[] {
  const groups: Record<string, string[]> = {};
  for (const w of answers) for (let i = 0; i < 5; i++) (groups[w.slice(0, i) + "_" + w.slice(i + 1)] ??= []).push(w);
  return Object.entries(groups)
    .map(([pattern, words]) => ({ pattern: pattern.toUpperCase(), words }))
    .sort((a, b) => b.words.length - a.words.length || (a.pattern < b.pattern ? -1 : 1));
}

export default function Streak() {
  const answers = getWords(5).answers as string[];
  const bench = getBenchmark();
  const U = (w: string) => w.toUpperCase();
  const families = trapFamilies(answers);
  const big = families.filter((f) => f.words.length >= 6);
  const inTrap = new Set(families.filter((f) => f.words.length >= 5).flatMap((f) => f.words));
  const top = big[0];
  const failed = (bench.hardest as { word: string; turns: number }[]).filter((g) => g.turns > 6);

  const faqs: QA[] = [
    {
      q: "What counts as a Wordle streak?",
      text: "Your streak is the number of puzzles you've solved in a row, one per day. Missing a day or failing a puzzle resets it to zero.",
      a: <p>Your streak is the number of daily puzzles you&apos;ve solved in a row. Missing a day or failing to solve a puzzle sends it back to zero.</p>,
    },
    {
      q: "What is a Wordle word trap?",
      text: `A word trap is a group of answers that share four letters in the same spots, like ${top.pattern}. Guessing them one at a time can use up all your turns.`,
      a: (
        <p>
          A group of answers that share four letters in the same spots, like {top.pattern} ({top.words.slice(0, 4).map(U).join(", ")} and more). Guessing them one at a time can use up
          all your turns.
        </p>
      ),
    },
    {
      q: "Should I use hard mode if I care about my streak?",
      text: "Probably not. Hard mode stops you from playing filler words, which are the best way out of word traps.",
      a: <p>Probably not. Hard mode stops you from playing filler words, and those are the best way out of a word trap.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/blog/hardest-wordle-words/", "/guides/wordle-filler-words/", "/wordle-hint-today/", "/wordle-guesser/"]}
      lead="Losing a 100-day Wordle streak stings. The good news: the biggest danger is predictable. We mapped every word trap in our answer list and turned it into simple habits that keep your streak safe."
    >
      <div className="answer-box">
        <strong>The short version:</strong> streaks rarely die on strange words. They die in <strong>word traps</strong>, groups like {top.pattern} where many answers share four
        letters. Learn to spot them, and play a filler word when more words fit than you have guesses left.
      </div>

      <Stats
        items={[
          { icon: "TriangleAlert", value: String(big.length), label: "trap families of 6+ words" },
          { icon: "Layers", value: String(inTrap.size), label: "likely answers inside a trap of 5+" },
          { icon: "Flame", value: `${top.pattern} (${top.words.length})`, label: "the biggest trap" },
        ]}
      />

      <h2 id="what-breaks">What breaks a Wordle streak?</h2>
      <p>Only two things can end a streak:</p>
      <IconList
        icon="X"
        tone="red"
        items={[
          <><strong>Missing a day.</strong> Life gets busy, and suddenly it&apos;s past midnight. That one is about habits.</>,
          <><strong>Failing a puzzle.</strong> Six guesses go by without the answer. That one is about strategy, and it&apos;s where word traps come in.</>,
        ]}
      />

      <h2 id="traps">The real streak killer: word traps</h2>
      <p>
        Picture this. After three guesses you have _IGHT, with every letter except the first. Sounds great, right? Then you realize it could be FIGHT, LIGHT, MIGHT, NIGHT,
        RIGHT, SIGHT, TIGHT and more. You have three guesses left, and that&apos;s not enough to try them one by one.
      </p>
      <HeroImage
        name="blog-streak-trap"
        alt="Tiles showing the _IGHT pattern, a wrong guess FIGHT, then NIGHT solved, illustrating a Wordle word trap"
        caption="Four letters found, one missing, and far too many words that fit."
      />
      <p>
        That&apos;s a word trap, and they&apos;re everywhere. In our list of {answers.length.toLocaleString()} likely answers, {inTrap.size} belong to a family of five or more look-alikes.
        Even our solver isn&apos;t immune: in our full test it failed to finish within six guesses only {failed.length} {failed.length === 1 ? "time" : "times"}
        {failed.length ? `, on ${failed.map((g) => U(g.word)).join(" and ")}` : ""}
        {failed.length > 1 ? ", and each time a word trap was to blame" : failed.length === 1 ? ", and a word trap was to blame" : ""}.
      </p>

      <h2 id="biggest-traps">The biggest word traps in Wordle</h2>
      <p>These are the largest families in our answer list. If your board starts to look like one of them, slow down:</p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Largest Wordle word-trap families</caption>
          <thead>
            <tr>
              <th scope="col">Pattern</th>
              <th scope="col">Words</th>
              <th scope="col">Answers that fit</th>
            </tr>
          </thead>
          <tbody>
            {big.slice(0, 12).map((f) => (
              <tr key={f.pattern}>
                <td>
                  <strong>{f.pattern}</strong>
                </td>
                <td>{f.words.length}</td>
                <td>{f.words.map(U).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">From our list of likely answers. The official game&apos;s list differs slightly, but the same families show up.</p>

      <h2 id="escape">How to escape a word trap</h2>
      <p>Here&apos;s a simple rule worth remembering:</p>
      <Alert type="tip" title="The streak-saver rule">
        If more words still fit than you have guesses left, don&apos;t guess one of them. Play a filler word instead.
      </Alert>
      <Steps
        items={[
          <><strong>Count the options.</strong> List every word that fits, or let the <Link href="/">Wordle Helper</Link> count them for you.</>,
          <><strong>Compare with your guesses left.</strong> Five words and three guesses? That&apos;s a trap.</>,
          <><strong>Play a filler word.</strong> Pick a word that tests as many of the missing letters as possible, even if it can&apos;t be the answer. For _IGHT, a word that tests several possible first letters, like F, L, M, N and S, covers many options at once.</>,
          <><strong>Finish it.</strong> The colors tell you which letter is right, and the next guess wins.</>,
        ]}
      />
      <p>
        Our <Link href="/guides/wordle-filler-words/">filler words guide</Link> has tested fillers for the most common traps, and the <Link href="/wordle-guesser/">Wordle guesser</Link>{" "}
        finds the best one for your exact board.
      </p>

      <h2 id="habits">8 habits that protect your streak</h2>
      <IconList
        icon="ShieldCheck"
        items={[
          <><strong>Play at the same time every day.</strong> Tie it to something you already do, like morning coffee, so you never miss a day.</>,
          <><strong>Know when the puzzle resets.</strong> It&apos;s midnight in your time zone. See <Link href="/blog/what-time-does-wordle-reset/">what time Wordle resets</Link>.</>,
          <><strong>Start with a strong opener.</strong> Good first words leave fewer options. See our <Link href="/blog/audio-vs-raise-best-wordle-opener/">AUDIO vs RAISE test</Link>.</>,
          <><strong>Watch for traps early.</strong> If three guesses in you have four letters and several words fit, switch to a filler word.</>,
          <><strong>Don&apos;t forget double letters.</strong> About a third of answers repeat a letter. See our <Link href="/blog/5-letter-words-with-double-letters/">double letters list</Link>.</>,
          <><strong>Skip hard mode</strong> if the streak matters more than the challenge. It blocks filler words.</>,
          <><strong>Take a hint before you lose.</strong> A gentle clue from <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> beats a broken streak.</>,
          <><strong>Slow down on your last guess.</strong> Re-read every color before you press Enter.</>,
        ]}
      />

      <h2 id="lost-it">Already lost your streak?</h2>
      <p>
        It happens to everyone, and a fresh start has an upside: you can try new habits without pressure. Pick a new opener, practice spotting traps with the{" "}
        <Link href="/wordle-unlimited-solver/">Wordle Unlimited solver</Link>, and your next streak may well beat the last one.
      </p>
    </BlogLayout>
  );
}
