import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, PageHeader, RelatedCards, Steps, type QA } from "@/components/Content";
import { Unscrambler } from "@/components/tools/Unscrambler";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/wordle-unscrambler/");
export const metadata = metadataFor(page);

export default function UnscramblerPage() {
  const faqs: QA[] = [
    {
      q: "How does the Wordle unscrambler work?",
      text: "It checks every 3 to 7 letter word in our dictionary and keeps the ones you can spell using only your letters.",
      a: <p>It checks every 3 to 7-letter word in our dictionary and keeps the ones you can spell with your letters, using each letter no more times than you typed it. Results are grouped by length, most common first.</p>,
    },
    {
      q: "Can I use blank tiles?",
      text: "Yes. Type a question mark for each unknown letter.",
      a: <p>Yes. Type a question mark (?) for each unknown letter and it can stand for anything.</p>,
    },
    {
      q: "How does this help with Wordle?",
      text: "When you know which letters are in the word but not their order, enter them with a ? for each unknown letter to see real words you can make.",
      a: (
        <p>
          Late in a game you often know the letters but not the order. Enter them, plus a ? for each unknown one, to see real words. Then use the <Link href="/">Wordle Helper</Link>{" "}
          to check which of those fit your colors.
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
        lead="What words can you make with these letters? Enter up to 12 letters, using ? for any unknown letter, and see every word you can spell."
      />
      <section className="card tool-card" aria-label="Word unscrambler">
        <Unscrambler />
      </section>
      <section className="prose">
        <h2>Using the scramble solver for Wordle</h2>
        <p>
          Sometimes you&apos;ve found most of the letters but just can&apos;t see the word. An unscrambler can jog your memory. Here&apos;s a quick example:
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <Steps
          items={[
            <><strong>You know the answer has R, A, E and C.</strong> Type <code>RAEC?</code> with one blank for the missing letter.</>,
            <><strong>Scan the 5-letter group.</strong> You&apos;ll see words like CRANE, REACH, CRATE, TRACE and CARVE.</>,
            <><strong>Use your colors to choose.</strong> Or paste your board into the <Link href="/">Wordle Helper</Link> and let it pick for you.</>,
          ]}
        />
        <p>
          The unscrambler also helps with anagram puzzles, Scrabble-style games and word jumbles. It searches 3 to 7-letter words and lists the common ones first. Tick
          &ldquo;Include rare words&rdquo; to see the whole dictionary.
        </p>
      </section>
      <HelperCta />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/5-letter-word-finder/", "/wordle-dictionary/", "/3-letter-wordle-solver/"]} />
      <AuthorBox />
    </>
  );
}
