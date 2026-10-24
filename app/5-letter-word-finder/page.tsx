import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { WordFinder } from "@/components/tools/WordFinder";
import { getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/5-letter-word-finder/");
export const metadata = metadataFor(page);
const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Finder() {
  const five = getWords(5);
  const faqs: QA[] = [
    {
      q: "How do I find a 5 letter word with certain letters?",
      text: "Type the letters you know are in the word into the yellow box. Put green letters in their exact spots and gray letters in the gray box. The list updates as you type.",
      a: <p>Type the letters you know are in the word into the yellow box. Put any green letters in their exact spots, and add gray letters to the gray box. The list updates as you type.</p>,
    },
    {
      q: "Can I search for words that start or end with certain letters?",
      text: "Yes. Use the Starts with and Ends with boxes, or browse our ready-made 5 letter word lists.",
      a: (
        <p>
          Yes. Use the <em>Starts with</em> and <em>Ends with</em> boxes. You can also browse ready-made lists such as{" "}
          <Link href="/5-letter-words/starting-with-s/">5 letter words starting with S</Link> or <Link href="/5-letter-words/ending-in-e/">ending in E</Link>.
        </p>
      ),
    },
    {
      q: "Why don't I see very unusual words?",
      text: "The finder searches common words first because those are realistic Wordle answers. Tick Include rare words to see the full dictionary.",
      a: <p>The finder shows common words first, because those are the realistic Wordle answers. Tick &ldquo;Include rare words&rdquo; to search the full dictionary.</p>,
    },
  ];
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        showImage={false}
        lead="Search five-letter words by the letters they contain, start with or end with. Fill in what you know and matching words appear as you type."
      />
      <section className="card tool-card" aria-label="5 letter word search">
        <WordFinder variant="full" />
      </section>
      <section className="prose">
        <h2>How to search for 5 letter words</h2>
        <p>This 5 letter word search was built for Wordle, but it works just as well for crosswords and other word games. Each box narrows the list a little more:</p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <IconList
          icon="TextSearch"
          items={[
            <><strong>Green letters</strong> go in the boxes when you know exactly where a letter belongs.</>,
            <><strong>Yellow letters</strong> must appear somewhere in the word, in any spot.</>,
            <><strong>Gray letters</strong> are left out completely.</>,
            <><strong>Starts with / ends with</strong> help when you know the beginning or ending, such as words starting with ST or ending in ER.</>,
            <><strong>Contains together</strong> finds letters that sit side by side, like CH, OU or LL.</>,
          ]}
        />
        <p>
          Results are sorted with the most likely Wordle answers first. We search {five.answers.length.toLocaleString()} common five-letter words by default and{" "}
          {five.valid.length.toLocaleString()} when you include rare ones. You can also switch to 3, 4, 6 or 7 letters.
        </p>
        <h2>Word finder or Wordle Helper?</h2>
        <p>
          The finder treats a yellow letter as &ldquo;somewhere in the word&rdquo;. It doesn&apos;t know which spots you&apos;ve already ruled out. If you want that extra precision, enter
          your full guesses into the <Link href="/">Wordle Helper</Link>. Its Guess Grid reads every tile, handles double letters and suggests your best next guess.
        </p>
        <h2>Browse 5 letter words by first letter</h2>
        <ul className="az">
          {ABC.map((c) => (
            <li key={c}>
              <Link href={`/5-letter-words/starting-with-${c}/`} aria-label={`5 letter words starting with ${c.toUpperCase()}`}>
                {c.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <HelperCta />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/5-letter-words/", "/wordle-dictionary/", "/wordle-unscrambler/"]} />
      <AuthorBox />
    </>
  );
}
