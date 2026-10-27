import Link from "next/link";
import { HeroImage, IconList, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { Icon } from "@/components/Icon";
import { metadataFor } from "@/lib/seo";
import { puzzleNumber } from "@/lib/site.mjs";

const path = "/blog/what-time-does-wordle-reset/";
export const metadata = metadataFor(path);

// Standard-time offsets. Daylight saving moves most of these by one hour.
const ZONES = [
  { place: "Kiribati (Line Islands)", offset: "UTC+14", utc: "10:00 the day before" },
  { place: "Auckland, New Zealand", offset: "UTC+12", utc: "12:00 the day before" },
  { place: "Sydney, Australia", offset: "UTC+10", utc: "14:00 the day before" },
  { place: "Tokyo, Japan", offset: "UTC+9", utc: "15:00 the day before" },
  { place: "New Delhi, India", offset: "UTC+5:30", utc: "18:30 the day before" },
  { place: "London, UK", offset: "UTC+0", utc: "00:00" },
  { place: "New York, USA", offset: "UTC−5", utc: "05:00" },
  { place: "Los Angeles, USA", offset: "UTC−8", utc: "08:00" },
  { place: "Honolulu, USA", offset: "UTC−10", utc: "10:00" },
];

export default function WordleReset() {
  const n2000 = "2026-12-10";
  const faqs: QA[] = [
    {
      q: "What time does Wordle reset?",
      text: "Wordle resets at midnight in your own local time zone, based on your device's clock.",
      a: <p>At midnight in your own local time zone. The game uses the date on your device, so a new puzzle appears as soon as your clock ticks past 12:00 AM.</p>,
    },
    {
      q: "Does Wordle reset at midnight Eastern Time for everyone?",
      text: "No. Wordle resets at local midnight for each player, not at a single global time.",
      a: <p>No. There&apos;s no single global reset time. Each player gets the new puzzle at their own local midnight, so someone in London usually gets it about five hours before someone in New York.</p>,
    },
    {
      q: "Is everyone's Wordle the same?",
      text: "Yes. Everyone who plays on the same date gets the same puzzle and the same answer.",
      a: <p>Yes. Everyone playing on the same date gets the same puzzle and the same answer. You may just reach that date at a different time than your friends.</p>,
    },
    {
      q: "What time does Wordle reset in the UK?",
      text: "At midnight UK time: 00:00 GMT in winter and 00:00 BST in summer.",
      a: <p>At midnight UK time. That&apos;s 00:00 GMT in winter and 00:00 BST in summer.</p>,
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/wordle-hint-today/", "/wordle-answers/", "/blog/hardest-wordle-words/", "/"]}
      lead="It's one of the most-searched Wordle questions, and the answer is simpler than you might think. Here's exactly when the new puzzle arrives, wherever you are."
    >
      <div className="answer-box">
        <strong>Quick answer:</strong> Wordle resets at <strong>midnight in your own time zone</strong>. A new puzzle appears as soon as your device&apos;s clock passes 12:00 AM.
      </div>

      <h2 id="how-it-works">How the Wordle reset works</h2>
      <p>
        Wordle doesn&apos;t switch to a new puzzle at one moment for the whole world. Instead, it checks the date on the phone or computer you&apos;re playing on. When your clock
        rolls over to a new day, you get the new puzzle. That&apos;s why there&apos;s no &ldquo;Wordle o&apos;clock&rdquo; that works for everyone.
      </p>
      <p>
        Each date has exactly one puzzle, and everyone who plays on that date gets the same word. Puzzles are numbered too. Wordle #0 appeared on June 19, 2021, and the number
        goes up by one every day. Wordle #2000 lands on <strong>December 10, 2026</strong> (we checked: that date is puzzle #{puzzleNumber(n2000)}).
      </p>

      <HeroImage name="blog-reset-world" alt="A globe with letter tiles spelling LOCAL TIMES, showing that Wordle resets at midnight in each time zone" caption="The new Wordle rolls around the world one time zone at a time." />

      <h2 id="around-the-world">When the new Wordle arrives around the world</h2>
      <p>
        Because the reset follows local midnight, the new puzzle sweeps around the globe over about a day. The first players to get it are on Pacific islands like Kiribati, and the
        last are on islands like American Samoa, almost a full day later. Here&apos;s when local midnight happens in a few places, shown in UTC:
      </p>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">When the new Wordle arrives in different time zones</caption>
          <thead>
            <tr>
              <th scope="col">Place</th>
              <th scope="col">Time zone</th>
              <th scope="col">New Wordle arrives (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z.place}>
                <td>{z.place}</td>
                <td>{z.offset}</td>
                <td>{z.utc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">Times use standard time. Where daylight saving applies, the new puzzle arrives one hour earlier in UTC.</p>

      <h2 id="different-puzzle">Why your friend might be on a different puzzle</h2>
      <p>
        If you share results with friends in other countries, you&apos;ve probably noticed this. At 8 PM in New York, it&apos;s already the next morning in Sydney. Your Australian
        friend is a full puzzle ahead of you and may post a score for a word you haven&apos;t seen yet.
      </p>
      <IconList
        icon="TriangleAlert"
        tone="amber"
        items={[
          <><strong>Watch out for spoilers.</strong> A friend in an earlier time zone may share tomorrow&apos;s answer without realizing it.</>,
          <><strong>Check the puzzle number.</strong> Scores include the number, like &ldquo;Wordle 1,955&rdquo;. If it&apos;s higher than yours, don&apos;t look too closely.</>,
          <><strong>Traveling?</strong> Your puzzle follows your device&apos;s clock. Crossing time zones can mean getting the next puzzle early, or waiting a little longer.</>,
        ]}
      />

      <h2 id="play-early">Can you play tomorrow&apos;s Wordle early?</h2>
      <p>
        Some people change their device&apos;s date to get the next puzzle sooner. We don&apos;t recommend it. Changing your clock can confuse other apps, and part of Wordle&apos;s charm
        is solving the same word as everyone else on the same day.
      </p>

      <h2 id="never-miss">Never miss a puzzle</h2>
      <IconList
        icon="CircleCheckBig"
        items={[
          <><strong>Make it a habit.</strong> Many players solve Wordle at the same time every day, like with morning coffee.</>,
          <><strong>Get a nudge when you&apos;re stuck.</strong> Our <Link href="/wordle-hint-today/">today&apos;s Wordle hint</Link> page shows the puzzle number and date, and warns you if your local puzzle is different.</>,
          <><strong>Missed a day?</strong> Every past answer is in our <Link href="/wordle-answers/">Wordle answers archive</Link>.</>,
        ]}
      />
      <p>
        <Icon name="Lightbulb" size={16} /> Got the new puzzle and want to keep your streak safe? Put your guesses into the <Link href="/">Wordle Helper</Link> to see every word that
        still fits.
      </p>
    </BlogLayout>
  );
}
