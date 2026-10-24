import Link from "next/link";
import { IconList, Steps } from "@/components/Content";
import { GuideLayout } from "@/components/GuideLayout";
import { getBenchmark, getOpeners, getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/guides/how-wordle-helper-works/";
export const metadata = metadataFor(path);

export default function HowItWorks() {
  const five = getWords(5);
  const openers = getOpeners();
  const bench = getBenchmark();
  return (
    <GuideLayout
      path={path}
      readingTime={6}
      related={["/", "/wordle-guesser/", "/wordle-word-list/", "/guides/best-wordle-starting-words/"]}
      lead="A plain-English tour of what happens after you enter your guesses: where the words come from, how your colors are read, and how answers and guesses are ranked."
    >
      <h2 id="word-lists">1. The word lists</h2>
      <p>
        Everything starts with two lists of five-letter words, built from <a href="http://wordlist.aspell.net/" rel="noopener">SCOWL</a>. SCOWL is a long-running, open-source
        English word list that sorts words by how common they are, which makes it a great fit for Wordle.
      </p>
      <IconList
        icon="List"
        items={[
          <><strong>Likely answers ({five.answers.length.toLocaleString()} words):</strong> common words, minus plurals, regular past tenses and offensive words, since Wordle rarely or never uses those.</>,
          <><strong>Valid guesses ({five.valid.length.toLocaleString()} words):</strong> the common words plus rarer ones you&apos;re allowed to play.</>,
        ]}
      />
      <p>
        The New York Times doesn&apos;t publish its answer list and edits it from time to time, so no outside list is a perfect match. Ours aims to include almost every word Wordle
        is likely to use. Browse it on the <Link href="/wordle-word-list/">Wordle word list</Link> page.
      </p>

      <h2 id="matching">2. Reading your colors</h2>
      <p>
        Each time you change a tile, the helper goes through the list and asks one question per word: <em>&ldquo;If this were the answer, would my guesses show exactly these
        colors?&rdquo;</em> To answer it, the helper scores your guess against that word using Wordle&apos;s own rules:
      </p>
      <Steps
        items={["Letters in the right spot turn green first.", "Then, from left to right, a letter turns yellow if the answer still has an unused copy of it.", "Everything else turns gray."]}
      />
      <p>
        If the colors match what you entered for every guess, the word stays. This &ldquo;play the game in reverse&rdquo; approach handles double letters perfectly. Guess LLAMA
        when the answer is HELLO and you get yellow, yellow, gray, gray, gray. The answer has two Ls, just not in the first two spots. A simpler rule like &ldquo;gray means the letter
        isn&apos;t there&rdquo; would wrongly throw HELLO away.
      </p>

      <h2 id="ranking">3. Ranking the possible answers</h2>
      <p>
        The words that survive are sorted by a letter score. The helper counts how often each letter appears among the remaining words, and how often it appears in each spot.
        Words built from typical letters in typical places rise to the top. In practice, that puts the most likely answers first.
      </p>

      <h2 id="best-guess">4. Suggesting the best next guess</h2>
      <p>
        For suggestions, the helper borrows an idea from information theory. For each candidate guess, it works out the colors it would show against every remaining word and
        groups the words by those colors. The more evenly the words spread out, the more the guess will tell you. This is measured in bits, and each bit roughly halves what&apos;s
        left.
      </p>
      <p>
        To stay fast on phones, the helper first shortlists a few hundred promising guesses, then scores each one exactly. Words that could be the answer get a small bonus,
        because they might win on the spot. Before you guess anything, the top openers by this measure are {openers.slice(0, 3).map((o: { word: string }) => o.word.toUpperCase()).join(", ")}.
      </p>

      <h2 id="testing">5. How we test it</h2>
      <p>
        Every time we update the word lists, we let the solver play all {bench.games.toLocaleString()} likely answers on its own. In the latest run it averaged{" "}
        <strong>{bench.average} guesses</strong>, finished {bench.solvedWithinFour}% of games in four or fewer, and solved {bench.solvedWithinSix}% within six. We publish these numbers
        so you can judge the tool for yourself, not just take our word for it.
      </p>

      <h2 id="privacy">6. Your privacy</h2>
      <p>
        All of this runs inside your browser. Your guesses are never sent to us. The board is saved only in your own browser storage, so it&apos;s still there if you reload the
        page. Read more in our <Link href="/privacy/">privacy policy</Link>.
      </p>
    </GuideLayout>
  );
}
