import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { GridSolver } from "@/components/tools/GridSolver";
import { getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/wordle-unlimited-solver/");
export const metadata = metadataFor(page);

export default function Unlimited() {
  const five = getWords(5);
  const faqs: QA[] = [
    {
      q: "Does this work with Wordle Unlimited and other clones?",
      text: "Yes. Any game that colors letters green, yellow and gray like Wordle works. This solver searches every valid word by default.",
      a: <p>Yes. Any game that colors letters green, yellow and gray like Wordle will work. Since practice games often use bigger dictionaries, this page searches every valid word by default.</p>,
    },
    {
      q: "What if the answer isn't in the list?",
      text: "Some clones use names, slang or regional spellings our dictionary doesn't include. Check your tile colors first.",
      a: <p>First, double-check your tile colors. If they&apos;re right, the game may be using a name, slang word or regional spelling that our dictionary doesn&apos;t include.</p>,
    },
    {
      q: "Can I solve games with more or fewer letters?",
      text: "Yes. Use the 3, 4, 6 or 7 letter Wordle solvers.",
      a: (
        <p>
          Yes. Try the <Link href="/3-letter-wordle-solver/">3</Link>, <Link href="/4-letter-wordle-solver/">4</Link>, <Link href="/6-letter-wordle-solver/">6</Link> or{" "}
          <Link href="/7-letter-wordle-solver/">7 letter Wordle solver</Link>.
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
        lead={`Find the answer in Wordle Unlimited and other practice games. This solver searches all ${five.valid.length.toLocaleString()} valid five-letter words, not just the common ones.`}
      />
      <section className="card tool-card" aria-label="Wordle Unlimited solver">
        <GridSolver rareByDefault />
      </section>
      <section className="prose">
        <h2>Why use a separate solver for unlimited games?</h2>
        <p>
          The daily Wordle picks its answers from everyday words, so our main <Link href="/">Wordle Helper</Link> searches common words first. Wordle Unlimited and similar practice
          sites usually pick at random from a much larger dictionary. That means odd words like FJORD, NYMPH or KAZOO turn up more often.
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <p>
          This page starts with <em>Include rare words</em> switched on, so none of those slip through. Untick it whenever you want to focus on everyday words.
        </p>
        <h2>Use unlimited games to practise</h2>
        <IconList
          icon="Target"
          items={[
            <><strong>Solve on your own first,</strong> then add your guesses here to see how many words each one left.</>,
            <><strong>Compare your second guess</strong> with our top suggestion. Over time you&apos;ll start spotting the smarter move yourself.</>,
            <><strong>Try a new opener</strong> each game and see which ones leave the fewest words. Our <Link href="/guides/best-wordle-starting-words/">starting words guide</Link> has a head start.</>,
          ]}
        />
      </section>
      <HelperCta title="Playing today's official Wordle?" />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/wordle-guesser/", "/6-letter-wordle-solver/", "/7-letter-wordle-solver/"]} />
      <AuthorBox />
    </>
  );
}
