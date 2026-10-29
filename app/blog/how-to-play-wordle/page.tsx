import Link from "next/link";
import { HeroImage, IconList, Steps, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { getOpeners, getWords } from "@/lib/data.mjs";
import { filterCandidates } from "@/lib/engine.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/how-to-play-wordle/";
export const metadata = metadataFor(path);

const COLOR = { g: "green", y: "yellow", x: "gray" } as const;
const marks = (p: string) => Array.from(p, (c) => ({ x: 0, y: 1, g: 2 })[c as "x" | "y" | "g"]);

// Example game shown in the article (answer: PLANT).
const GAME = [
  { word: "crane", pattern: "xxggx" },
  { word: "plant", pattern: "ggggg" },
];

export default function HowToPlay() {
  const five = getWords(5);
  const answers = five.answers as string[];
  const openers = getOpeners() as { word: string }[];
  const afterCrane = filterCandidates(answers, [{ word: "crane", marks: marks("xxggx") }]) as string[];
  const U = (w: string) => w.toUpperCase();

  const faqs: QA[] = [
    {
      q: "How many guesses do you get in Wordle?",
      text: "You get six guesses to find the five-letter word.",
      a: <p>You get six guesses to find the hidden five-letter word. If you don&apos;t get it by the sixth, the game shows you the answer.</p>,
    },
    {
      q: "What do the colors mean in Wordle?",
      text: "Green means the letter is in the right spot. Yellow means it's in the word but in a different spot. Gray means it's not in the word.",
      a: <p>Green means the right letter in the right spot. Yellow means the letter is in the word, but somewhere else. Gray means the letter isn&apos;t in the word at all.</p>,
    },
    {
      q: "Is there only one Wordle a day?",
      text: "Yes. There is one official puzzle per day, and it changes at midnight in your time zone.",
      a: (
        <p>
          Yes. There&apos;s one official puzzle per day, and it changes at midnight in your own time zone. Read more in{" "}
          <Link href="/blog/what-time-does-wordle-reset/">what time Wordle resets</Link>.
        </p>
      ),
    },
    {
      q: "Can you use the same letter twice in Wordle?",
      text: "Yes. Answers can have repeated letters, and you can guess words with repeated letters too.",
      a: <p>Yes. Answers can repeat a letter, like SPOON or SKILL, and you can guess words with repeated letters too.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/guides/best-wordle-starting-words/", "/guides/wordle-tips-strategy/", "/blog/what-time-does-wordle-reset/", "/wordle-hint-today/"]}
      lead="Wordle is easy to learn and hard to put down. This guide explains the rules in plain English, shows you what every color means, and walks through a full example game."
    >
      <div className="answer-box">
        <strong>In one sentence:</strong> guess the hidden five-letter word in six tries, using the green, yellow and gray colors after each guess as clues.
      </div>

      <h2 id="what-is-wordle">What is Wordle?</h2>
      <p>
        Wordle is a daily word puzzle. Software engineer Josh Wardle created it, and The New York Times bought it in early 2022. Everyone gets the same five-letter word each day,
        so it&apos;s fun to compare results with friends. The best part? A game only takes a few minutes.
      </p>

      <h2 id="rules">The rules of Wordle</h2>
      <Steps
        items={[
          <><strong>Type a five-letter word</strong> and press Enter. It has to be a real word; random letters won&apos;t be accepted.</>,
          <><strong>Read the colors.</strong> Each letter&apos;s tile changes color to show how close you are.</>,
          <><strong>Use the clues</strong> to make a better guess next time.</>,
          <><strong>Find the word in six guesses or fewer</strong> to win. Then come back tomorrow for a new one.</>,
        ]}
      />

      <h2 id="colors">What the Wordle colors mean</h2>
      <IconList
        icon="CircleCheckBig"
        items={[<><strong>Green:</strong> the letter is in the word and in the right spot.</>]}
      />
      <IconList icon="CircleHelp" tone="amber" items={[<><strong>Yellow:</strong> the letter is in the word, but in a different spot.</>]} />
      <IconList icon="X" tone="red" items={[<><strong>Gray:</strong> the letter isn&apos;t in the word. Don&apos;t use it again.</>]} />
      <HeroImage
        name="blog-how-to-play-colors"
        alt="Two rows of tiles: CRANE with A and N in green, then PLANT all green, showing how Wordle colors guide you to the answer"
        caption="CRANE shows two green letters, A and N. Two guesses later, PLANT is solved."
      />

      <h2 id="example">A full example game</h2>
      <p>Let&apos;s say today&apos;s word is PLANT. Here&apos;s how a game might go:</p>
      <div className="board" data-length={5} aria-label="Example game: CRANE then PLANT">
        {GAME.map((r) => (
          <div className="board-row" key={r.word}>
            {Array.from(r.word).map((ch, i) => (
              <span key={i} className={`tile ${COLOR[r.pattern[i] as "g" | "y" | "x"]}`} style={{ cursor: "default" }}>
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>
      <Steps
        items={[
          <><strong>First guess: CRANE.</strong> A and N turn green, so the word looks like _ _ A N _. C, R and E turn gray, so they&apos;re out. That leaves {afterCrane.length} possible words, including {afterCrane.slice(0, 4).map(U).join(", ")}.</>,
          <><strong>Second guess: PLANT.</strong> All five tiles turn green. Solved in two!</>,
        ]}
      />
      <p>
        Real games usually take three or four guesses. If you get stuck, our <Link href="/">Wordle Helper</Link> can show you every word that still fits your colors.
      </p>

      <h2 id="double-letters">How double letters work</h2>
      <p>
        Some answers use the same letter twice, like SPOON or SKILL. When you guess a word with a repeated letter, each copy gets its own color. Say you guess SPEED and only one
        E turns yellow while the other turns gray. That means the answer has exactly one E. A gray tile on a second copy doesn&apos;t mean the letter is missing; it means
        there&apos;s no second one.
      </p>

      <h2 id="hard-mode">What is hard mode?</h2>
      <p>
        Hard mode is an optional setting. Once you find a green or yellow letter, every later guess must use it, and green letters must stay in place. It makes the game more
        challenging, because you can&apos;t play a &ldquo;helper&rdquo; word to test new letters. Try it once you feel comfortable with the normal game.
      </p>

      <h2 id="sharing">Sharing your results</h2>
      <p>
        After each game you can share a grid of colored squares. It shows how you did without giving away the word, which is why you see those little color grids all over
        social media. Just be careful not to post the answer itself, since friends in other time zones may not have played yet.
      </p>

      <h2 id="tips">5 tips for your first games</h2>
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[
          <><strong>Start with a strong word.</strong> {openers.slice(0, 3).map((o) => U(o.word)).join(", ")} test lots of common letters. See our <Link href="/guides/best-wordle-starting-words/">best starting words</Link>.</>,
          <><strong>Move yellow letters.</strong> A yellow letter is in the word, just not where you put it.</>,
          <><strong>Avoid gray letters.</strong> They can&apos;t be in the answer, so don&apos;t waste tiles on them.</>,
          <><strong>Think about common endings</strong> like -ER, -LY and -CH.</>,
          <><strong>Take a hint if you need one.</strong> Our <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> page gives gentle clues without spoiling the word.</>,
        ]}
      />
      <p>
        Ready for more? Our <Link href="/guides/wordle-tips-strategy/">Wordle tips and strategy guide</Link> covers the habits that help experienced players win in fewer guesses.
      </p>
    </BlogLayout>
  );
}
