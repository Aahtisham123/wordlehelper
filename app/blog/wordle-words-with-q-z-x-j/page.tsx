import Link from "next/link";
import { HeroImage, IconList, Stats, WordGrid, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { CopyButton } from "@/components/CopyButton";
import { getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/wordle-words-with-q-z-x-j/";
export const metadata = metadataFor(path);

const RARE = ["q", "z", "x", "j"];
const POSITION = ["first", "second", "third", "fourth", "fifth"];

export default function RareLetters() {
  const five = getWords(5);
  const answers = five.answers as string[];
  const valid = five.valid as string[];
  const U = (w: string) => w.toUpperCase();
  const pct = (n: number) => ((100 * n) / answers.length).toFixed(1);

  const letters = RARE.map((c) => {
    const list = answers.filter((w) => w.includes(c));
    const pos = [0, 0, 0, 0, 0];
    for (const w of list) for (let i = 0; i < 5; i++) if (w[i] === c) pos[i]++;
    const top = pos.indexOf(Math.max(...pos));
    return { c, L: U(c), list, share: pct(list.length), topPos: POSITION[top], topPosPct: Math.round((100 * pos[top]) / list.length) };
  });
  const byLetter = Object.fromEntries(letters.map((l) => [l.c, l]));
  const anyRare = answers.filter((w) => RARE.some((c) => w.includes(c)));
  const eShare = Math.round((100 * answers.filter((w) => w.includes("e")).length) / answers.length);
  const qNoU = answers.filter((w) => /q(?!u)/.test(w));
  const doubleRare = answers.filter((w) => [...w].filter((c) => RARE.includes(c)).length >= 2);
  // Valid guesses that test two different rare letters at once.
  const testers = valid.filter((w) => new Set([...w].filter((c) => RARE.includes(c))).size >= 2);

  const faqs: QA[] = [
    {
      q: "What is the rarest letter in Wordle?",
      text: `Q and J are the rarest in our list, each appearing in about ${byLetter.q.share}% and ${byLetter.j.share}% of likely answers.`,
      a: (
        <p>
          In our list of likely answers, Q ({byLetter.q.share}%) and J ({byLetter.j.share}%) are the rarest, closely followed by Z ({byLetter.z.share}%) and X ({byLetter.x.share}%).
          For comparison, E appears in {eShare}% of answers.
        </p>
      ),
    },
    {
      q: "Is Q always followed by U in Wordle?",
      text: qNoU.length ? `Almost always. Only ${qNoU.length} likely answers have a Q without a U after it.` : "In our list of likely answers, yes: every Q is followed by a U.",
      a: qNoU.length ? (
        <p>Almost always. Only {qNoU.length} likely answers break the rule: {qNoU.map(U).join(", ")}.</p>
      ) : (
        <p>In our list of likely answers, yes: every single Q is followed by a U. So if you find a Q, you can count on a U as well.</p>
      ),
    },
    {
      q: "Should I use rare letters in my first guess?",
      text: "No. Rare letters waste a tile early on. Test them only after common letters like E, A, R, S and T are ruled out.",
      a: <p>No. Rare letters waste a tile early on, because they so rarely light up. Save them until common letters like E, A, R, S and T are ruled out.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/blog/5-letter-words-no-vowels/", "/blog/5-letter-words-with-double-letters/", "/5-letter-word-finder/", "/guides/best-wordle-starting-words/"]}
      lead="Q, Z, X and J are the Scrabble heavyweights, but in Wordle they're mostly a trap for your guesses. Here's how often they really show up, where they hide, and every common word that uses them."
    >
      <div className="answer-box">
        <strong>Quick answer:</strong> only <strong>{anyRare.length}</strong> of {answers.length.toLocaleString()} likely Wordle answers ({pct(anyRare.length)}%) contain Q, Z, X or
        J. Each letter appears in fewer than 2% of answers, so don&apos;t test them early.
      </div>

      <Stats items={letters.map((l) => ({ icon: "Gem", value: `${l.share}%`, label: `of likely answers contain ${l.L}` }))} />

      <h2 id="how-rare">How rare are Q, Z, X and J?</h2>
      <p>
        Very rare. Each one shows up in fewer than two out of every hundred likely answers. Compare that with E, which appears in {eShare}% of answers. Put another way, a guess with
        an E is about {Math.round(eShare / Number(byLetter.q.share))} times more likely to light up a tile than a guess with a Q.
      </p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">How often Q, Z, X and J appear in five-letter Wordle answers</caption>
          <thead>
            <tr>
              <th scope="col">Letter</th>
              <th scope="col">Answers</th>
              <th scope="col">Share</th>
              <th scope="col">Most common spot</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((l) => (
              <tr key={l.c}>
                <td>
                  <strong>{l.L}</strong>
                </td>
                <td>{l.list.length}</td>
                <td>{l.share}%</td>
                <td>
                  {l.topPos} letter ({l.topPosPct}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="q">Words with Q</h2>
      <p>
        Q has a famous habit: it almost never travels alone.{" "}
        {qNoU.length ? `Only ${qNoU.length} likely answers have a Q without a U.` : "In our list of likely answers, every Q is followed by a U."} That&apos;s a free clue. Find a
        Q, and you&apos;ve found a U too. Q also likes the {byLetter.q.topPos} spot, where it appears in {byLetter.q.topPosPct}% of these words.
      </p>
      <HeroImage name="blog-rare-letters-q" alt="Tiles showing a Q in the first spot, then QU, then the full word QUAKE, showing that Q is followed by U" caption="Find a Q and the next letter is almost certainly U." />
      <WordGrid words={byLetter.q.list} />

      <h2 id="z">Words with Z</h2>
      <p>
        Z often comes in pairs or near the end of a word, as in JAZZY, BLAZE and BLITZ. Its most common spot is the {byLetter.z.topPos} letter ({byLetter.z.topPosPct}%).
      </p>
      <WordGrid words={byLetter.z.list} />

      <h2 id="x">Words with X</h2>
      <p>
        X spreads out more than the others. It turns up second, third or last about equally often, as in AXIOM, BOXER and BORAX. Its most common spot is the{" "}
        {byLetter.x.topPos} letter, but only just ({byLetter.x.topPosPct}%).
      </p>
      <WordGrid words={byLetter.x.list} />

      <h2 id="j">Words with J</h2>
      <p>
        J is the opposite of X. It usually starts a word, as in JAUNT, JELLY and JOKER, and appears as the {byLetter.j.topPos} letter in {byLetter.j.topPosPct}% of these words.
      </p>
      <WordGrid words={byLetter.j.list} />
      <p>
        <CopyButton text={anyRare.map(U).join(", ")} label="Copy all Q, Z, X and J words" what="Word list" />
      </p>

      {doubleRare.length > 0 && (
        <>
          <h2 id="double">Words with two rare letters</h2>
          <p>
            A handful of answers use rare letters twice: {doubleRare.map(U).join(", ")}. Notice the pattern?{" "}
            {doubleRare.every((w) => w.includes("zz")) ? "Every one of them has a double Z." : "Most of them double up on Z."} If you&apos;ve found one Z and nothing fits, try
            a second.
          </p>
        </>
      )}

      <h2 id="strategy">When should you test rare letters?</h2>
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[
          <><strong>Not in your first two guesses.</strong> Common letters like E, A, R, S and T tell you far more. Our <Link href="/guides/best-wordle-starting-words/">best starting words</Link> never use rare letters.</>,
          <><strong>Once the common letters run out.</strong> If most of the alphabet is gray and the answer still won&apos;t come, rare letters are your next suspects.</>,
          <><strong>Use the clues they leave.</strong> A Q means a U. A J usually starts the word. A Z often sits near the end.</>,
          ...(testers.length
            ? [<><strong>Test two at once.</strong> {testers.slice(0, 3).map(U).join(", ")} {testers.length === 1 ? "checks" : "check"} two rare letters in a single word.</>]
            : []),
        ]}
      />
      <p>
        Want to check which rare-letter words still fit your board? Enter your guesses into the <Link href="/">Wordle Helper</Link>, or search by letter with our{" "}
        <Link href="/5-letter-word-finder/">5 letter word finder</Link>.
      </p>
    </BlogLayout>
  );
}
