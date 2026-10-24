import Link from "next/link";
import { IconList, Steps, type QA } from "@/components/Content";
import { GuideLayout } from "@/components/GuideLayout";
import { metadataFor } from "@/lib/seo";

const path = "/guides/how-to-cheat-at-wordle/";
export const metadata = metadataFor(path);

export default function Cheating() {
  const faqs: QA[] = [
    {
      q: "Can you get banned for using a Wordle solver?",
      text: "No. A solver runs on its own website and never touches the game. Your stats only record the guesses you type.",
      a: <p>No. A solver runs on its own website and never touches the game itself. Your stats only record the guesses you type in.</p>,
    },
    {
      q: "Is looking at today's Wordle hint cheating?",
      text: "Most players don't think so, especially for gentle hints like the number of vowels.",
      a: (
        <p>
          Most players don&apos;t think so, especially for gentle hints like the number of vowels. Our <Link href="/wordle-hint-today/">daily hint page</Link> reveals clues one at
          a time so you can take as little help as you need.
        </p>
      ),
    },
    {
      q: "What is the best Wordle hack?",
      text: "The most useful legitimate hack is strategy: a strong starting word, using every clue and avoiding word traps.",
      a: (
        <p>
          Honestly? Strategy. A strong <Link href="/guides/best-wordle-starting-words/">starting word</Link>, using every clue and dodging word traps will lift your average more
          than any shortcut.
        </p>
      ),
    },
  ];
  return (
    <GuideLayout
      path={path}
      readingTime={5}
      faqs={faqs}
      related={["/wordle-hint-today/", "/guides/wordle-tips-strategy/", "/", "/wordle-guesser/"]}
      lead="People search for Wordle cheats and hacks every day. Here's an honest look at what they are, whether using them is cheating, and how to get help without spoiling the fun."
    >
      <h2 id="types">What people mean by &ldquo;Wordle cheats&rdquo;</h2>
      <p>Most so-called Wordle hacks fall into three groups:</p>
      <IconList
        icon="Eye"
        tone="red"
        items={[<><strong>Looking up the answer.</strong> Answer sites and social posts give the word away. It works, but it isn&apos;t really playing.</>]}
      />
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[<><strong>Hints.</strong> Clues like the first letter or the number of vowels, like our <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> page.</>]}
      />
      <IconList
        icon="WandSparkles"
        items={[<><strong>Solvers and helpers.</strong> Tools like our <Link href="/">Wordle Helper</Link> that take <em>your</em> guesses and colors and list what still fits. You still play every guess yourself.</>]}
      />

      <h2 id="is-it-cheating">So, is using a Wordle helper cheating?</h2>
      <p>
        Wordle is a free puzzle with no prizes, no leaderboards and no rules about outside help. In that sense there&apos;s nobody to cheat, apart from yourself and anyone you
        compare scores with. Here&apos;s a fair rule of thumb:
      </p>
      <IconList
        items={[
          <><strong>Playing just for you?</strong> Use whatever makes it fun. A helper that saves a long streak on a tough day, or teaches you a new word, is doing its job.</>,
          <><strong>Competing with friends or family?</strong> Agree on the rules, or simply say when you had help. Posting a two-guess win you looked up isn&apos;t fair on people playing straight.</>,
          <><strong>Want to get better?</strong> Use the helper after you finish, not during. Seeing how many words each guess left is the fastest way to learn.</>,
        ]}
      />

      <h2 id="fair-use">How to use a helper without spoiling the puzzle</h2>
      <Steps
        items={[
          "Play your first two or three guesses on your own.",
          "Stuck? Try a gentle hint first, like the number of vowels.",
          <>Still stuck? Enter your board into the <Link href="/">Wordle Helper</Link> and look only at how many words are left. That alone often sparks an idea.</>,
          "Need more? Browse the possible answers and choose one yourself.",
          <>After the game, check which guess the <Link href="/wordle-guesser/">Wordle guesser</Link> would have played.</>,
        ]}
      />

      <h2 id="real-hack">The only &ldquo;hack&rdquo; you really need</h2>
      <p>
        The real way to win more isn&apos;t a trick. It&apos;s strategy. A strong opener, using every clue and spotting word traps early will do more for your average than any
        shortcut. Our <Link href="/guides/wordle-tips-strategy/">Wordle tips and strategy guide</Link> walks through the habits that make the biggest difference.
      </p>
    </GuideLayout>
  );
}
