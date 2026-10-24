import Link from "next/link";
import { AuthorBox, Faq, HelperCta, IconList, PageHeader, RelatedCards, WordGrid, type QA } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { Icon } from "@/components/Icon";
import { getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";

const page = getPage("/wordle-word-list/");
export const metadata = metadataFor(page);
const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

export default function WordList() {
  const { answers, valid, answerSet } = getWords(5);
  const rare = valid.filter((w: string) => !answerSet.has(w));
  const groups = ABC.map((c) => ({ c, list: answers.filter((w: string) => w[0] === c) })).filter((g) => g.list.length);
  const faqs: QA[] = [
    {
      q: "How many possible Wordle words are there?",
      text: `Our list has ${answers.length} common five-letter words that make realistic answers, and ${valid.length} valid guesses in total.`,
      a: (
        <p>
          Our list has {answers.length.toLocaleString()} common five-letter words that make realistic answers, and {valid.length.toLocaleString()} valid guesses in total. That&apos;s a
          tiny slice of the 11,881,376 possible five-letter letter combinations.
        </p>
      ),
    },
    {
      q: "Is this the official list of Wordle answers?",
      text: "No. The New York Times curates its own answer list and doesn't publish it. Ours is an independent list of common English words.",
      a: <p>No. The New York Times picks its own answers and doesn&apos;t publish the list. Ours is an independent list of common English words, filtered to match the kinds of words Wordle uses.</p>,
    },
    {
      q: "Can I download the word list?",
      text: "Yes. Both lists are available as plain text files from this page.",
      a: (
        <p>
          Yes, as plain text: <a href="/words/5-answers.txt">likely answers</a> and <a href="/words/5-valid.txt">all valid guesses</a>. You can also copy each letter&apos;s list with
          one tap.
        </p>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        lead={`Every likely Wordle answer, ${answers.length.toLocaleString()} common five-letter words sorted A to Z, plus ${rare.length.toLocaleString()} rarer words you can still play.`}
      />
      <nav aria-label="Jump to letter">
        <ul className="az">
          {groups.map((g) => (
            <li key={g.c}>
              <a href={`#letter-${g.c}`}>{g.c.toUpperCase()}</a>
            </li>
          ))}
        </ul>
      </nav>
      <section className="prose">
        <h2>How we built this Wordle word list</h2>
        <p>
          Wordle accepts far more words as guesses than it uses as answers. Answers are everyday words; guesses can be almost any real five-letter word. Our list mirrors that
          split:
        </p>
        <IconList
          items={[
            <><strong>Likely answers</strong> are common English words, minus plurals (CATS), past tenses (ASKED) and offensive words, since Wordle avoids those.</>,
            <><strong>Valid guesses</strong> add rarer words such as AALII or ZOOID. You can play them, but you&apos;ll probably never see one as an answer.</>,
          ]}
        />
        <p>
          Use the list to plan openers, check spelling or just browse. To filter it with your actual clues, open the <Link href="/">Wordle Helper</Link>. To search by letters, try
          the <Link href="/5-letter-word-finder/">5 letter word finder</Link>.
        </p>
        <p className="inline-form">
          <a className="btn btn-ghost btn-sm" href="/words/5-answers.txt" download>
            <Icon name="FileText" size={16} /> Download likely answers (.txt)
          </a>
          <a className="btn btn-ghost btn-sm" href="/words/5-valid.txt" download>
            <Icon name="FileText" size={16} /> Download all valid words (.txt)
          </a>
        </p>
      </section>
      <HelperCta />
      <h2>Likely Wordle answers ({answers.length.toLocaleString()})</h2>
      {groups.map((g) => (
        <section key={g.c} aria-labelledby={`letter-${g.c}`}>
          <div className="list-toolbar">
            <h3 id={`letter-${g.c}`} style={{ margin: "18px 0 0" }}>
              {g.c.toUpperCase()}: {g.list.length} words
            </h3>
            <CopyButton text={g.list.map((w: string) => w.toUpperCase()).join(", ")} label="Copy" what={`${g.c.toUpperCase()} words`} />
          </div>
          <WordGrid words={g.list} />
          <p className="small">
            <Link href={`/5-letter-words/starting-with-${g.c}/`}>More 5 letter words starting with {g.c.toUpperCase()} →</Link>
          </p>
        </section>
      ))}
      <h2>Other valid guesses ({rare.length.toLocaleString()})</h2>
      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Show all {rare.length.toLocaleString()} rare valid words</summary>
        <WordGrid words={rare} />
      </details>
      <Faq items={faqs} />
      <RelatedCards paths={["/", "/wordle-dictionary/", "/5-letter-word-finder/", "/5-letter-words/"]} />
      <AuthorBox />
    </>
  );
}
