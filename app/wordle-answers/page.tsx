import Link from "next/link";
import { Alert } from "@/components/Alert";
import { AuthorBox, Faq, HelperCta, PageHeader, RelatedCards, Stats, type QA } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { buildDate, getDaily } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { formatDate } from "@/lib/site.mjs";

const page = getPage("/wordle-answers/");
export const metadata = metadataFor(page);

type Entry = { date: string; number: number; answer: string };

export default function Answers() {
  const today = buildDate();
  const past = (getDaily() as Entry[]).filter((d) => d.date < today);
  const counts: Record<string, number> = {};
  for (const d of past) for (const c of new Set(d.answer)) counts[c] = (counts[c] || 0) + 1;
  const topLetters = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c.toUpperCase());
  const doubles = past.filter((d) => new Set(d.answer).size < 5).length;

  const faqs: QA[] = [
    {
      q: "What was yesterday's Wordle answer?",
      text: past.length ? `The most recent answer in our archive is ${past[0].answer.toUpperCase()}, Wordle #${past[0].number}.` : "The archive is being filled in. For today's puzzle, see today's Wordle hint.",
      a: past.length ? (
        <p>
          The newest answer in the archive is <strong>{past[0].answer.toUpperCase()}</strong> (Wordle #{past[0].number}, {formatDate(past[0].date)}). Today&apos;s puzzle has its
          own page: <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link>.
        </p>
      ) : (
        <p>
          We&apos;re still filling in the archive. For today&apos;s puzzle, head to <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link>.
        </p>
      ),
    },
    {
      q: "Why isn't today's answer on this list?",
      text: "To avoid spoilers, an answer only moves here after the next puzzle is released.",
      a: (
        <p>
          To keep things spoiler-free. An answer only moves here once the next puzzle is out. Until then it sits on <Link href="/wordle-hint-today/">today&apos;s hint page</Link>,
          behind a reveal button.
        </p>
      ),
    },
    {
      q: "Can past answers help me win?",
      text: "Yes. Past answers show which letters and patterns Wordle likes, and you can check whether a word was already used.",
      a: (
        <p>
          They can. Past answers show the kinds of everyday words Wordle likes, and you can check any word in the <Link href="/wordle-dictionary/">Wordle dictionary</Link> to see
          whether it&apos;s already been used.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        page={page}
        trail={[{ href: page.path, label: page.nav }]}
        lead="Every previous Wordle solution in one place, newest first. Today's answer isn't here; it joins the list once the next puzzle comes out."
      />
      {past.length ? (
        <>
          <Stats
            items={[
              { icon: "Archive", value: past.length.toLocaleString(), label: "answers in the archive" },
              { icon: "Layers", value: String(doubles), label: "had a repeated letter" },
              { icon: "Star", value: topLetters.slice(0, 3).join(" "), label: "most common letters" },
            ]}
          />
          <div className="list-toolbar">
            <h2 style={{ margin: "10px 0 0" }}>All past Wordle answers</h2>
            <CopyButton text={past.map((d) => d.answer.toUpperCase()).join(", ")} label="Copy all" what="Answers" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Puzzle</th>
                  <th scope="col">Date</th>
                  <th scope="col">Answer</th>
                </tr>
              </thead>
              <tbody>
                {past.map((d) => (
                  <tr key={d.date}>
                    <td>#{d.number}</td>
                    <td>
                      <time dateTime={d.date}>{formatDate(d.date)}</time>
                    </td>
                    <td>
                      <strong>{d.answer.toUpperCase()}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Alert type="info" title="The archive is being filled in">
          Check back soon. Meanwhile, see <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> or solve it yourself with the <Link href="/">Wordle Helper</Link>.
        </Alert>
      )}

      <section className="prose">
        <h2>How to use the Wordle archive</h2>
        <p>
          Looking up yesterday&apos;s word is the obvious use, but the archive is handy in other ways too. Scanning old answers gives you a feel for the words Wordle picks: short,
          common words that most people know, rarely plurals and rarely obscure. That&apos;s useful when you&apos;re down to two options and need to pick the more likely one.
        </p>
        <p>
          Want to play along today? Grab a clue from <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link>, or narrow the list down step by step with our{" "}
          <Link href="/">Wordle Helper</Link>.
        </p>
      </section>

      <HelperCta />
      <Faq items={faqs} />
      <RelatedCards paths={["/wordle-hint-today/", "/", "/wordle-dictionary/", "/wordle-word-list/"]} />
      <AuthorBox>Each entry is added on the day of the puzzle and moved here once the next one is released. Spot an error? <Link href="/contact/">Tell us</Link>.</AuthorBox>
    </>
  );
}
