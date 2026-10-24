import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, Steps, type QA } from "@/components/Content";
import { GridSolver } from "@/components/tools/GridSolver";
import { getBenchmark, getOpeners, getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/wordle-guesser/");
export const metadata = metadataFor(page);

export default function Guesser() {
  const five = getWords(5);
  const openers = getOpeners();
  const bench = getBenchmark();
  const faqs: QA[] = [
    {
      q: "How does the Wordle guesser pick the best next guess?",
      text: "For each possible guess, it works out which colors you would see for every word that could still be the answer, then measures how evenly those colors split the words. The most even split wins.",
      a: (
        <p>
          For each possible guess, it works out which colors you&apos;d see for every word that could still be the answer. Then it measures how evenly those colors split the words
          into groups. The guess with the most even split teaches you the most, so it goes to the top.
        </p>
      ),
    },
    {
      q: "Why does it sometimes suggest a word that can't be the answer?",
      text: "A word that can't win can still rule out more options. When several words differ by one letter, testing many of those letters at once can guarantee a win on the next turn.",
      a: (
        <p>
          Because a word that can&apos;t win can still teach you more. Say six words are left and they differ only in the first letter. Guessing them one by one might take six turns.
          One helper word that tests five of those letters at once tells you the answer for sure. We mark these as &ldquo;helper word&rdquo; so you can choose.
        </p>
      ),
    },
    {
      q: "What does 'bits' mean?",
      text: "Bits measure information. Each bit roughly halves the number of words left.",
      a: <p>Bits measure information. Each bit roughly halves the words left: a 3-bit guess leaves about one eighth, a 5-bit guess about one thirty-second.</p>,
    },
    {
      q: "Can I use the Wordle guesser in hard mode?",
      text: "Yes. Choose suggestions marked 'could be the answer', or pick from the possible answers list. Those always follow hard-mode rules.",
      a: <p>Yes. Choose a suggestion marked &ldquo;could be the answer&rdquo;, or pick from the possible answers list. Those always follow hard-mode rules.</p>,
    },
  ];
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        showImage={false}
        lead="Not sure what to play next? Add your guesses and colors, and the Wordle guesser ranks the 10 best next words by how many possible answers each one rules out."
      />
      <section className="card tool-card" aria-label="Wordle next guess calculator">
        <GridSolver mode="guesser" />
      </section>
      <section className="prose">
        <h2>Best next guesses, not just possible answers</h2>
        <p>
          Most word finders stop at listing the words that fit your clues. Our Wordle guesser goes one step further. It asks which guess will leave you with the <em>fewest</em>{" "}
          words afterwards, testing up to 600 strong candidates against every remaining answer. It all happens in your browser in a split second.
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <p>Every suggestion comes with three numbers:</p>
        <IconList
          icon="Gauge"
          items={[
            <><strong>Bits</strong> show how much the guess should reveal. Higher is better, and each bit halves what&apos;s left.</>,
            <><strong>Groups</strong> count the different color patterns it can produce. More groups spread the answers thinner.</>,
            <><strong>Left after</strong> estimates how many words you&apos;ll probably have after playing it.</>,
          ]}
        />
        <h2>How to use the next guess calculator</h2>
        <Steps
          items={[
            <><strong>Add the word you just played</strong> and tap the tiles to match your colors.</>,
            <><strong>Look at the top three suggestions.</strong> If one says &ldquo;could be the answer&rdquo; and scores well, it&apos;s usually the best pick.</>,
            <><strong>Tap a suggestion</strong> to drop it into the box, play it in your game, then add the new colors.</>,
          ]}
        />
        <h2>When to follow the guesser and when to go for the win</h2>
        <p>
          Early in the game, follow the information score. It wins in fewer turns over time. When just two or three words remain, it&apos;s usually smarter to guess one of them,
          because a chance to win right now beats a little extra information. The guesser already gives a small bonus to words that could be the answer, so you&apos;ll see this
          happen on its own.
        </p>
        <p>
          Before you add anything, the guesser shows the best opening words. Our top openers are {openers.slice(0, 5).map((o: { word: string }) => o.word.toUpperCase()).join(", ")}.
          When we let this exact logic play all {bench.games.toLocaleString()} likely answers, it averaged <strong>{bench.average} guesses</strong>. Read more in our guide to the{" "}
          <Link href="/guides/best-wordle-starting-words/">best Wordle starting words</Link>.
        </p>
        <p>
          The guesser uses the same engine as the <Link href="/">Wordle Helper</Link>, with {five.answers.length.toLocaleString()} likely answers and{" "}
          {five.valid.length.toLocaleString()} valid guesses.
        </p>
      </section>
      <HelperCta title="Prefer three ways to solve?" text={<>The <Link href="/">Wordle Helper</Link> adds Letter Clues and a step-by-step Guided Solve.</>} />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/guides/best-wordle-starting-words/", "/guides/wordle-filler-words/", "/5-letter-word-finder/"]} />
      <AuthorBox />
    </>
  );
}
