import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, Stats, Steps, type QA } from "@/components/Content";
import { GridSolver } from "@/components/tools/GridSolver";
import { getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";

const NAME: Record<number, string> = { 3: "three", 4: "four", 6: "six", 7: "seven" };

const ADVICE: Record<number, { intro: string; tips: React.ReactNode[] }> = {
  3: {
    intro:
      "Three-letter puzzles look easy, yet they trip people up. With only three tiles, each guess tells you less, and loads of words differ by just one letter. Think CAT, BAT, HAT, MAT, PAT and RAT.",
    tips: [
      <><strong>Lead with vowels.</strong> Nearly every three-letter word has one, and finding it early halves your options.</>,
      <><strong>Don&apos;t chase one letter at a time.</strong> When five words share an ending, use a suggested helper word that tests several first letters at once.</>,
      <><strong>Remember short spellings.</strong> Words like ICY, SKY and FLY have no A, E, I, O or U at all.</>,
    ],
  },
  4: {
    intro:
      "Four-letter Wordle is a lovely warm-up for the classic game. The words are short, so vowels do a lot of the work, and the right opener often lights up two or three tiles straight away.",
    tips: [
      <><strong>Open with two vowels.</strong> Words like RATE, LINE or TEAR test the most common letters.</>,
      <><strong>Watch for double letters.</strong> BEER, TOOL and BALL are common, so consider them once your options shrink.</>,
      <><strong>Use common endings.</strong> -ED, -LY and -ER rarely fit, but -ST, -ND and -NK often do.</>,
    ],
  },
  6: {
    intro:
      "Six-letter games give you more letters per guess, but there are many more possible answers too. Your first two guesses really matter, so aim to test lots of common letters early.",
    tips: [
      <><strong>Pick openers with three vowels</strong> and common consonants like R, S, T and N.</>,
      <><strong>Think in chunks.</strong> Endings like -ER, -ED, -LY and -ION are common, and the ranked list brings them to the top once your clues point that way.</>,
      <><strong>Expect repeats.</strong> Longer words often reuse a letter, as in LETTER, COFFEE or BANANA.</>,
    ],
  },
  7: {
    intro:
      "Seven-letter puzzles are the toughest of the family. Thousands of words could be the answer, and long words often hide repeated letters. On the bright side, each guess covers seven spots, so two smart guesses can still clear out most of the list.",
    tips: [
      <><strong>Look for prefixes and suffixes.</strong> RE-, UN-, -ING, -ION and -ERS show up again and again.</>,
      <><strong>Enter colors exactly as shown.</strong> With long words, one wrong tile can hide the answer. The solver handles double letters as long as each tile matches your game.</>,
      <><strong>Use the rare-words switch</strong> if your game picks unusual answers.</>,
    ],
  },
};

export function LengthSolverPage({ n }: { n: number }) {
  const page = getPage(`/${n}-letter-wordle-solver/`);
  const words = getWords(n);
  const name = NAME[n];
  const others = [3, 4, 6, 7].filter((x) => x !== n);
  const faqs: QA[] = [
    {
      q: `How does the ${n} letter Wordle solver work?`,
      text: `It checks every ${n}-letter word against the colors you entered, using Wordle's rules, and keeps only the words that fit. The rest are ranked so the most likely answers come first.`,
      a: (
        <p>
          It checks every {n}-letter word in our list against the colors you entered, using the same rules as Wordle. Only words that would have produced exactly those colors
          stay. The rest are ranked so the most likely answers come first.
        </p>
      ),
    },
    {
      q: `How many ${n} letter words are there?`,
      text: `Our list has ${words.answers.length} common ${n}-letter words and ${words.valid.length} in total.`,
      a: (
        <p>
          Our list has {words.answers.length.toLocaleString()} common {n}-letter words that make good answers, and {words.valid.length.toLocaleString()} in total once you add the rare
          ones. Tick &ldquo;Include rare words&rdquo; to search them all.
        </p>
      ),
    },
    {
      q: "Can I use this for the normal 5-letter Wordle?",
      text: "For the classic five-letter Wordle, use the main Wordle Helper on our homepage.",
      a: (
        <p>
          For the classic game, use the main <Link href="/">Wordle Helper</Link>. It&apos;s tuned for five-letter answers and offers three ways to solve.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        showImage={false}
        lead={`A ${name}-letter Wordle helper. Add each guess, tap the tiles to match your colors, and see every ${n}-letter word that still fits.`}
      />
      <section className="card tool-card" aria-label={`${n} letter Wordle solver`}>
        <GridSolver length={n} />
      </section>
      <Stats
        items={[
          { icon: "List", value: words.answers.length.toLocaleString(), label: `common ${n}-letter words` },
          { icon: "BookA", value: words.valid.length.toLocaleString(), label: "valid words in total" },
          { icon: "Grid3x3", value: String(n >= 6 ? 7 : 6), label: "rows on the board" },
        ]}
      />
      <section className="prose">
        <h2>How to solve a {name}-letter Wordle</h2>
        <p>{ADVICE[n].intro}</p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <Steps
          items={[
            <><strong>Type the {n}-letter word you played</strong> and press <em>Add guess</em>.</>,
            <><strong>Tap each tile</strong> until its color matches your game: gray, then yellow, then green.</>,
            <><strong>Pick your next word</strong> from the ranked list or the suggestions, then repeat.</>,
          ]}
        />
        <h2>Tips for {name}-letter puzzles</h2>
        <IconList icon="Lightbulb" tone="amber" items={ADVICE[n].tips} />
        <p>
          This solver uses the same engine as our five-letter <Link href="/">Wordle Helper</Link>. Need a different size? Try the{" "}
          {others.map((x, i) => (
            <span key={x}>
              {i > 0 && (i === others.length - 1 ? " or " : ", ")}
              <Link href={`/${x}-letter-wordle-solver/`}>{NAME[x]}-letter solver</Link>
            </span>
          ))}
          .
        </p>
      </section>
      <HelperCta title="Playing the classic 5-letter Wordle?" />
      <Faq items={faqs} />
      <RelatedCards paths={[...others.map((x) => `/${x}-letter-wordle-solver/`), "/wordle-unscrambler/", "/5-letter-word-finder/"]} />
      <AuthorBox />
    </>
  );
}
