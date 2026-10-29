import Link from "next/link";
import { HeroImage, IconList, Stats, WordGrid, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { CopyButton } from "@/components/CopyButton";
import { getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/5-letter-words-no-vowels/";
export const metadata = metadataFor(path);

const noVowels = (w: string) => !/[aeiou]/.test(w);
// Valid words, but widely seen as offensive, so we leave them out of this list.
const LEFT_OUT = new Set(["gypsy", "lynch"]);

// Plain-English meanings for the common words. Any word without one shows a dash.
const MEANING: Record<string, string> = {
  crypt: "an underground room, often beneath a church",
  dryly: "in a dry or quietly funny way",
  flyby: "a flight past a place, like a plane over a crowd",
  glyph: "a carved or written symbol",
  lymph: "a clear fluid that moves through the body",
  myrrh: "a sweet-smelling resin used in perfume",
  nymph: "a nature spirit in myths; also a young insect",
  psych: "to get yourself or someone ready, as in “psych yourself up”",
  pygmy: "very small for its kind, as in a pygmy goat",
  shyly: "in a shy way",
  slyly: "in a sly or sneaky way",
  sylph: "a slim, graceful person or an airy spirit",
  tryst: "a secret meeting",
  wryly: "in a dry, slightly mocking way",
};

export default function NoVowels() {
  const five = getWords(5);
  const answers = five.answers as string[];
  const common = answers.filter((w) => noVowels(w) && !LEFT_OUT.has(w));
  const rare = (five.valid as string[]).filter((w) => noVowels(w) && !five.answerSet.has(w) && !LEFT_OUT.has(w));
  const noY = [...common, ...rare].filter((w) => !w.includes("y"));
  const oneVowel = answers.filter((w) => (w.match(/[aeiou]/g) || []).length === 1).length;
  const oneVowelPct = Math.round((100 * oneVowel) / answers.length);
  const doubleY = common.filter((w) => w.split("y").length - 1 >= 2);
  const U = (w: string) => w.toUpperCase();

  const faqs: QA[] = [
    {
      q: "Are there 5 letter words with no vowels?",
      text: `Yes, if you count A, E, I, O and U as the vowels. Common examples include ${common.slice(0, 5).map(U).join(", ")}. Almost all of them use Y instead.`,
      a: (
        <p>
          Yes, if you count A, E, I, O and U as the vowels. Common examples include {common.slice(0, 5).map(U).join(", ")}. Almost all of them lean on Y to do a vowel&apos;s job.
        </p>
      ),
    },
    {
      q: "Is Y a vowel in Wordle?",
      text: "Wordle doesn't label vowels, but Y acts like a vowel in words such as NYMPH and CRYPT. Treat it like one when your other vowels turn gray.",
      a: <p>Wordle doesn&apos;t label letters as vowels. But Y acts like a vowel in words such as NYMPH and CRYPT, so treat it like one when your A, E, I, O and U turn gray.</p>,
    },
    {
      q: "Can a Wordle answer have no vowels at all?",
      text: "Yes. Words like NYMPH and CRYPT have no A, E, I, O or U and are realistic answers.",
      a: <p>Yes. Words like NYMPH and CRYPT have no A, E, I, O or U, and they&apos;re everyday enough to be realistic answers.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/5-letter-word-finder/", "/blog/hardest-wordle-words/", "/guides/wordle-tips-strategy/", "/5-letter-words/"]}
      lead="Your vowels all came back gray and you're stuck. Don't panic. A small group of five-letter words gets by without A, E, I, O or U, and here's every one worth knowing."
    >
      <div className="answer-box">
        <strong>Quick answer:</strong> common 5-letter words with no A, E, I, O or U include <strong>{common.slice(0, 6).map(U).join(", ")}</strong>. Almost all of them use Y as
        their vowel.
      </div>

      <Stats
        items={[
          { icon: "List", value: String(common.length), label: "common words with no vowels" },
          { icon: "BookA", value: String(rare.length), label: "rarer ones Wordle accepts" },
          { icon: "Hash", value: `${oneVowelPct}%`, label: "of likely answers have just one vowel" },
        ]}
      />

      <h2 id="common">Common 5 letter words with no vowels</h2>
      <p>These are the everyday words, the kind Wordle could pick as an answer. Each one uses Y where you&apos;d expect a vowel:</p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">Common five-letter words with no A, E, I, O or U, with meanings</caption>
          <thead>
            <tr>
              <th scope="col">Word</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {common.map((w) => (
              <tr key={w}>
                <td>
                  <strong>{U(w)}</strong>
                </td>
                <td>{MEANING[w] ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <CopyButton text={common.map(U).join(", ")} label="Copy this list" what="Word list" />
      </p>

      <h2 id="rare">Rarer words with no vowels</h2>
      <p>Wordle also accepts these as guesses, but they&apos;re unlikely to be the answer. They can still be handy for testing letters:</p>
      <WordGrid words={rare} />
      {noY.length > 0 && (
        <p>
          Fun fact: {noY.map(U).join(", ")} {noY.length === 1 ? "is the only word" : "are the only words"} here without a Y.{" "}
          {noY.includes("crwth") && "CRWTH is an old Welsh stringed instrument, and it uses W as its vowel sound."}
        </p>
      )}

      <h2 id="why-y">Why Y is the key</h2>
      <p>
        In English, Y often does a vowel&apos;s job, especially in short words. That&apos;s why nearly every word on this page has one. Some even use two, like{" "}
        {doubleY.map(U).join(", ") || "SHYLY and SLYLY"}.
      </p>
      <HeroImage
        name="blog-no-vowels-y"
        alt="Two rows of tiles: AUDIO all gray, then CRYPT all green, showing that a word with no vowels can be the answer"
        caption="When AUDIO comes back all gray, it's time to think about Y."
      />

      <h2 id="strategy">How to spot a no-vowel Wordle answer</h2>
      <IconList
        icon="Lightbulb"
        tone="amber"
        items={[
          <><strong>Watch your vowels.</strong> If two guesses turn A, E, I, O and U gray, the answer probably uses Y.</>,
          <><strong>Test Y early.</strong> Put Y in your second or third guess when your vowels aren&apos;t lighting up.</>,
          <><strong>Think about -LY and -PH.</strong> Endings like these show up a lot in no-vowel words.</>,
          <><strong>Use the finder.</strong> Put your gray vowels into our <Link href="/5-letter-word-finder/">5 letter word finder</Link> to see every word that&apos;s left.</>,
        ]}
      />
      <p>
        No-vowel words are rare, but words with just one vowel are not: {oneVowel.toLocaleString()} of our {answers.length.toLocaleString()} likely answers ({oneVowelPct}%) have only one.
        So when a guess shows a single yellow vowel, it may be the only one in the word. For more lists like this, browse our{" "}
        <Link href="/5-letter-words/containing-y/">5 letter words containing Y</Link>, or let the <Link href="/">Wordle Helper</Link> do the work.
      </p>
    </BlogLayout>
  );
}
