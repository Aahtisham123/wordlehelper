import Link from "next/link";
import { Alert } from "@/components/Alert";
import { AuthorBox, Faq, HelperCta, HeroImage, IconList, PageHeader, RelatedCards, type QA } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { Icon } from "@/components/Icon";
import { DailyNotice } from "@/components/tools/DailyNotice";
import { buildDate, getDaily } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE, formatDate, puzzleNumber, shortDate } from "@/lib/site.mjs";

const page = getPage("/wordle-hint-today/");
export const metadata = metadataFor(page);

const VOWELS = "aeiou";
const RARE = "fjkqvwxz";

type Entry = { date: string; number: number; answer: string; clue?: string };

function hints(e: Entry) {
  const w = e.answer;
  const letters = Array.from(w);
  const vowels = letters.filter((c) => VOWELS.includes(c)).length;
  const repeats = [...new Set(letters.filter((c, i) => letters.indexOf(c) !== i))];
  const rare = [...new Set(letters.filter((c) => RARE.includes(c)))];
  const list = [
    {
      icon: "Hash",
      title: "Hint 1: How many vowels?",
      body: (
        <>
          Today&apos;s word has <strong>{vowels === 0 ? "no vowels" : `${vowels} vowel${vowels === 1 ? "" : "s"}`}</strong> (A, E, I, O or U)
          {letters.includes("y") ? ", and it also uses a Y." : "."}
        </>
      ),
    },
    {
      icon: "Layers",
      title: "Hint 2: Any repeated letters?",
      body: repeats.length ? (
        <>
          <strong>Yes.</strong> {repeats.length === 1 ? "One letter shows up" : `${repeats.length} letters show up`} more than once.
        </>
      ) : (
        <>
          <strong>No.</strong> All five letters are different.
        </>
      ),
    },
    {
      icon: "Sparkles",
      title: "Hint 3: Any unusual letters?",
      body: rare.length ? (
        <>
          <strong>Yes.</strong> It uses {rare.length === 1 ? "one less common letter" : `${rare.length} less common letters`} from F, J, K, Q, V, W, X and Z.
        </>
      ) : (
        <>
          <strong>No.</strong> It only uses everyday letters, with no F, J, K, Q, V, W, X or Z.
        </>
      ),
    },
    { icon: "ArrowRight", title: "Hint 4: First letter", body: <>The word starts with <strong>{w[0].toUpperCase()}</strong>.</> },
    { icon: "Flame", title: "Hint 5: Last letter", body: <>The word ends with <strong>{w[4].toUpperCase()}</strong>.</> },
  ];
  if (e.clue) list.push({ icon: "Lightbulb", title: "Hint 6: What it means", body: <>{e.clue}</> });
  return list;
}

export default function HintToday() {
  const daily = getDaily() as Entry[];
  const today = buildDate();
  const entry = daily[0];
  const isToday = entry?.date === today;
  const recent = daily.slice(isToday ? 1 : 0, (isToday ? 1 : 0) + 7);

  const faqs: QA[] = [
    {
      q: "What is today's Wordle answer?",
      text: "The answer is hidden in the last box on this page so you don't see it by accident. Try the hints first.",
      a: <p>It&apos;s hidden in the last box above, so you won&apos;t see it by accident. Try a hint or two first. Most players only need the vowel count or the first letter.</p>,
    },
    {
      q: "What time does a new Wordle come out?",
      text: "A new Wordle is released every day at midnight in your local time zone.",
      a: (
        <p>
          Every day at midnight in your own time zone. That means friends in other countries can be on a different puzzle for a few hours. This page always tells you the puzzle
          number and date, and warns you if your local puzzle is different.
        </p>
      ),
    },
    {
      q: "How many vowels are in today's Wordle?",
      text: "Open Hint 1 on this page to see how many vowels today's word has.",
      a: <p>Open Hint 1. It tells you how many of A, E, I, O and U are in the word, and whether there&apos;s a Y too.</p>,
    },
    {
      q: "What was yesterday's Wordle?",
      text: "Yesterday's answer and older ones are listed in the past Wordle answers archive.",
      a: (
        <p>
          Check the <Link href="/wordle-answers/">past Wordle answers</Link> list. It has every answer we&apos;ve covered, newest first.
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
        lead="Spoiler-free clues for today's Wordle. Open them one at a time, from gentle nudges to the first letter. The answer stays hidden until you choose to see it."
      />

      <section className="card tool-card" aria-label="Today's Wordle hints">
        {entry ? (
          <>
            <p className="small muted" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "0 0 10px" }}>
              <Icon name="CalendarDays" size={16} />
              {isToday ? "Today's puzzle" : "Latest puzzle with hints"}: <strong style={{ color: "var(--text)" }}>Wordle #{entry.number}</strong> · {formatDate(entry.date)}
            </p>
            <DailyNotice number={entry.number} />
            <div className="hint-list">
              {hints(entry).map((h) => (
                <details key={h.title}>
                  <summary>
                    <span className="h-icon">
                      <Icon name={h.icon} size={18} />
                    </span>
                    {h.title}
                    <Icon name="ChevronDown" size={18} className="chev" />
                  </summary>
                  <div className="h-body">
                    <p>{h.body}</p>
                  </div>
                </details>
              ))}
              <details>
                <summary>
                  <span className="h-icon" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                    <Icon name="Eye" size={18} />
                  </span>
                  Show today&apos;s Wordle answer
                  <Icon name="ChevronDown" size={18} className="chev" />
                </summary>
                <div className="h-body">
                  <p>The answer to Wordle #{entry.number} is:</p>
                  <div className="answer-tiles" aria-label={entry.answer.toUpperCase()}>
                    {Array.from(entry.answer).map((c, i) => (
                      <span key={i}>{c.toUpperCase()}</span>
                    ))}
                  </div>
                  <CopyButton text={entry.answer.toUpperCase()} label="Copy answer" what="Answer" />
                </div>
              </details>
            </div>
            <div className="list-toolbar" style={{ marginTop: 14 }}>
              <span className="small muted">Helping a friend? Share the hints, not the answer.</span>
              <CopyButton text={`${SITE.url}${page.path}`} label="Copy link" what="Link" />
            </div>
          </>
        ) : (
          <>
            <p className="small muted" style={{ margin: "0 0 10px" }}>
              Today&apos;s puzzle: <strong style={{ color: "var(--text)" }}>Wordle #{puzzleNumber(today)}</strong> · {formatDate(today)}
            </p>
            <Alert type="info" title="Today's hints are on their way">
              In the meantime, our <Link href="/">Wordle Helper</Link> can solve it with you. Enter your guesses and it shows every word that still fits.
            </Alert>
          </>
        )}
      </section>

      <HelperCta title="Stuck? Try our Wordle Helper." />

      <section className="prose">
        <h2>How to use these Wordle hints</h2>
        <p>
          The hints start gentle and get stronger as you go. The first three describe the shape of the word: how many vowels it has, whether a letter repeats, and whether it uses
          an unusual letter. That&apos;s often enough to steer your next guess without spoiling anything.
        </p>
        <HeroImage name={page.image!} alt={page.imageAlt ?? ""} />
        <IconList
          items={[
            <><strong>Hints 1 to 3</strong> help you pick a smarter next guess without giving the word away.</>,
            <><strong>Hints 4 and 5</strong> reveal the first and last letters, which is usually enough to finish.</>,
            <><strong>The last box</strong> shows the full answer, with a button to copy it.</>,
          ]}
        />
        <p>
          Prefer to work it out from your own clues? Put your guesses into the <Link href="/">Wordle Helper</Link> and it lists every word that still fits. New to the game? Our{" "}
          <Link href="/guides/wordle-tips-strategy/">Wordle tips</Link> and the list of <Link href="/guides/best-wordle-starting-words/">best starting words</Link> are a great place to start.
        </p>

        <h2>Why we keep hints spoiler-free</h2>
        <p>
          Half the fun of Wordle is that moment when the word clicks. So we never put the answer in the page title, the preview text or the first screen. Each hint stays closed
          until you tap it, and you can stop the moment you get it.
        </p>

        {recent.length > 0 && (
          <>
            <h2>Recent Wordle answers</h2>
            <details className="card">
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Show the last {recent.length} answers (spoilers)</summary>
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
                    {recent.map((d) => (
                      <tr key={d.date}>
                        <td>#{d.number}</td>
                        <td>{shortDate(d.date)}</td>
                        <td>
                          <strong>{d.answer.toUpperCase()}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <p>
              <Link href="/wordle-answers/">See every past Wordle answer →</Link>
            </p>
          </>
        )}
      </section>

      <Faq items={faqs} />
      <RelatedCards paths={["/", "/wordle-answers/", "/wordle-guesser/", "/5-letter-word-finder/"]} />
      <AuthorBox>
        Hints are written from each day&apos;s answer and checked before they go live. Found a mistake? <Link href="/contact/">Let us know</Link> with the puzzle number.
      </AuthorBox>
    </>
  );
}
