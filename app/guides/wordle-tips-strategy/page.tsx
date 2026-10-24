import Link from "next/link";
import { Alert } from "@/components/Alert";
import { IconList, type QA } from "@/components/Content";
import { GuideLayout } from "@/components/GuideLayout";
import { getBenchmark } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/guides/wordle-tips-strategy/";
export const metadata = metadataFor(path);

export default function Tips() {
  const bench = getBenchmark();
  const faqs: QA[] = [
    {
      q: "Is there a way to win Wordle every time?",
      text: `No strategy wins every single game, but good habits get close. Our solver, using the ideas in this guide, solved ${bench.solvedWithinSix}% of puzzles within six guesses.`,
      a: (
        <p>
          No strategy wins every single game, but good habits get very close. Our own solver, using the ideas in this guide, solved {bench.solvedWithinSix}% of puzzles within six
          guesses. For people, the biggest wins come from a strong opener, using every clue and avoiding word traps.
        </p>
      ),
    },
    {
      q: "Should I play Wordle in hard mode?",
      text: "Hard mode forces you to reuse letters you've found, which makes word traps riskier. Normal mode lets you use filler words, which wins more games.",
      a: <p>Hard mode makes you reuse every letter you&apos;ve found, which makes word traps like _ATCH much riskier. It&apos;s a fun challenge, but normal mode lets you use filler words, which wins more games.</p>,
    },
    {
      q: "How many guesses does a good Wordle player need?",
      text: `Most strong players average between 3.5 and 4 guesses. Our solver averages ${bench.average}.`,
      a: <p>Most strong players land somewhere around 3.5 to 4 guesses. For comparison, our solver averages {bench.average} across every likely answer.</p>,
    },
  ];
  return (
    <GuideLayout
      path={path}
      readingTime={7}
      faqs={faqs}
      related={["/guides/best-wordle-starting-words/", "/guides/wordle-filler-words/", "/wordle-guesser/", "/"]}
      lead="Twelve simple habits that help you win more games in fewer guesses, plus a peek at how a Wordle solver algorithm thinks about each one."
    >
      <h2 id="before">Before you guess</h2>
      <h3>1. Pick one strong opener and stick with it</h3>
      <p>
        Using the same good word every day means you slowly learn what its patterns mean. Choose one from our list of <Link href="/guides/best-wordle-starting-words/">best Wordle
        starting words</Link>: five different, common letters in the spots where they usually go.
      </p>
      <h3>2. Know which letters are common</h3>
      <p>E, A, R, O, T, L, I and S cover most answers. Save rare letters like J, Q, X and Z until the common ones are ruled out.</p>

      <h2 id="clues">Reading your clues</h2>
      <h3>3. Use every clue, including where yellows aren&apos;t</h3>
      <p>
        A yellow letter tells you two things. First, the letter is in the word. Second, it&apos;s not in that spot. Plenty of players forget the second part, so always move a
        yellow letter somewhere new.
      </p>
      <h3>4. Gray means &ldquo;no more copies&rdquo;</h3>
      <p>
        Guess a word with two Es and you might see one yellow and one gray. That gray doesn&apos;t mean there&apos;s no E. It means there&apos;s exactly one. Our{" "}
        <Link href="/">Wordle Helper</Link> handles this for you automatically.
      </p>
      <h3>5. Remember double letters</h3>
      <p>Answers like SPOON, SKILL and EERIE catch people out because we tend to guess five different letters. When your options run thin, think about doubles.</p>
      <h3>6. Think in word shapes</h3>
      <p>
        Endings like -ER, -LY, -CH and -ED, and starts like ST-, SH- and TR- are everywhere. A green E in spot four often means &ldquo;-ER&rdquo;. A Y in spot five often means
        &ldquo;-LY&rdquo; or &ldquo;-TY&rdquo;.
      </p>

      <h2 id="next-guess">Choosing your next guess</h2>
      <h3>7. Explore early, commit late</h3>
      <p>On guesses two and three, a word that tests new letters is often worth more than a word that might be right. Once you&apos;re down to two or three options, just go for it.</p>
      <h3>8. Spot word traps early</h3>
      <p>
        Patterns like _ATCH, _IGHT, _OUND and _ASTE have many answers that differ by one letter. Guessing them one at a time can burn all six turns. Instead, play a{" "}
        <Link href="/guides/wordle-filler-words/">filler word</Link> that tests several first letters at once.
      </p>
      <Alert type="tip" title="Real example">
        In our tests, the single hardest word for our solver was {bench.worst.word.toUpperCase()}. It sits in a big family of look-alike words, which is exactly the kind of trap this tip
        is about.
      </Alert>
      <h3>9. Count what&apos;s left</h3>
      <p>
        Before each guess, try listing the words that still fit. If you can only think of one, check again; there&apos;s usually another. The <Link href="/">Wordle Helper</Link>{" "}
        shows the exact count.
      </p>
      <h3>10. Don&apos;t reuse gray letters</h3>
      <p>Every gray letter in a guess is a wasted tile. Outside hard mode, pick words that avoid letters you&apos;ve already ruled out.</p>

      <h2 id="algorithm">Think like a Wordle solver</h2>
      <h3>11. Go for the most information</h3>
      <p>
        Computer solvers score each guess by how evenly it splits the remaining answers across color patterns. A guess that could show 50 different patterns beats one that can
        only show 10, even if neither is likely to win. You can watch this happen in the <Link href="/wordle-guesser/">Wordle guesser</Link>.
      </p>
      <h3>12. Learn from every game</h3>
      <p>
        After you finish, add your guesses to the <Link href="/">Wordle Helper</Link>. It shows how many words were left after each turn and which guess would have narrowed
        things down faster. It&apos;s the quickest way to improve.
      </p>

      <h2 id="summary">Quick recap</h2>
      <IconList
        icon="ListChecks"
        items={[
          "Use one strong opener every day.",
          "Move yellow letters; never reuse gray ones.",
          "Remember that double letters happen.",
          "Break word traps with a filler word.",
          "Review your games to learn faster.",
        ]}
      />
    </GuideLayout>
  );
}
