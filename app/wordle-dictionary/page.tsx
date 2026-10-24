import Link from "next/link";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { Dictionary } from "@/components/tools/Dictionary";
import { getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/wordle-dictionary/");
export const metadata = metadataFor(page);

export default function DictionaryPage() {
  const five = getWords(5);
  const faqs: QA[] = [
    {
      q: "Is my word a valid Wordle word?",
      text: "Type it into the box above. Common words are realistic answers. Rarer words are usually accepted as guesses but rarely chosen as answers.",
      a: <p>Type it into the box above. Common words are realistic answers. Rarer words are usually accepted as guesses but rarely chosen as the answer. Names and abbreviations normally aren&apos;t allowed.</p>,
    },
    {
      q: "Are plurals allowed in Wordle?",
      text: "Plurals are usually accepted as guesses, but Wordle almost never uses a simple plural as the answer.",
      a: <p>Plurals are usually fine as guesses, but Wordle almost never picks a simple plural like CATS or DOGS as the answer. Words that only look plural, like GLASS or BONUS, can be answers.</p>,
    },
    {
      q: "Is this the official Wordle dictionary?",
      text: "No. The New York Times doesn't publish its word list. Our dictionary is built from SCOWL, a widely used open English word list.",
      a: <p>No. The New York Times doesn&apos;t publish its list, and it changes now and then. Ours is built from SCOWL, a trusted open English word list, and closely matches the words Wordle accepts.</p>,
    },
  ];
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        showImage={false}
        lead="Is it a real Wordle word? Type any word to see if it's valid, whether it could be an answer, and whether it's already been used."
      />
      <section className="card tool-card" aria-label="Wordle dictionary search">
        <Dictionary />
      </section>
      <section className="prose">
        <h2>What your result means</h2>
        <IconList
          items={[
            <><strong>Valid and common:</strong> one of our {five.answers.length.toLocaleString()} likely five-letter answers. It&apos;s accepted as a guess and could be a future answer.</>,
          ]}
        />
        <IconList
          icon="TriangleAlert"
          tone="amber"
          items={[
            <><strong>Valid but rare:</strong> one of {(five.valid.length - five.answers.length).toLocaleString()} extra words you can play. Unusual words like these are rarely picked as answers.</>,
          ]}
        />
        <IconList icon="X" tone="red" items={[<><strong>Not in the list:</strong> probably a typo, a name, a short form or slang.</>]} />
        <p>
          If the word has already been a Wordle answer, the dictionary tells you which puzzle and when. That&apos;s handy because recent answers rarely come back. The full history
          lives in our <Link href="/wordle-answers/">past Wordle answers</Link> archive.
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <h2>Checking words for other games</h2>
        <p>
          The dictionary also covers 3, 4, 6 and 7-letter words, so it works for Wordle spin-offs too. Once you know your word is valid, see how it fits your board with the{" "}
          <Link href="/">Wordle Helper</Link>.
        </p>
      </section>
      <HelperCta />
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/wordle-word-list/", "/5-letter-word-finder/", "/wordle-answers/"]} />
      <AuthorBox />
    </>
  );
}
