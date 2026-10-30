import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { HeroImage, IconList, Stats, type QA } from "@/components/Content";
import { BlogLayout } from "@/components/BlogLayout";
import { getWords } from "@/lib/data.mjs";
import { metadataFor } from "@/lib/seo";

const path = "/blog/audio-vs-raise-best-wordle-opener/";
export const metadata = metadataFor(path);

type Result = {
  opener: string;
  vowels: number;
  bits: number;
  patterns: number;
  expectedLeft: number;
  allGrayPct: number;
  average: number;
  solvedWithinFour: number;
  solvedWithinSix: number;
  failures: number;
};

export default function AudioVsRaise() {
  // Written by `npm run compare-openers`.
  const { games, results } = JSON.parse(readFileSync(join(process.cwd(), "data/opener-comparison.json"), "utf8")) as { games: number; results: Result[] };
  const U = (w: string) => w.toUpperCase();
  const by = (w: string) => results.find((r) => r.opener === w)!;
  const audio = by("audio");
  const raise = by("raise");
  const adieu = by("adieu");
  const byAverage = [...results].sort((a, b) => a.average - b.average);
  const byInfo = [...results].sort((a, b) => b.bits - a.bits);
  const best = byAverage[0];
  const vowelOpeners = results.filter((r) => r.vowels >= 4);
  const extraPer100 = Math.round((audio.average - best.average) * 100);
  const answers = getWords(5).answers as string[];
  const share = (ch: string) => Math.round((100 * answers.filter((w) => w.includes(ch)).length) / answers.length);

  const faqs: QA[] = [
    {
      q: "Is AUDIO a good Wordle starting word?",
      text: `It's not bad, but it's not the best. In our test AUDIO averaged ${audio.average} guesses, compared with ${best.average} for ${U(best.opener)}.`,
      a: (
        <p>
          It&apos;s not bad, but it&apos;s not the best. In our test AUDIO averaged {audio.average} guesses per game, compared with {best.average} for {U(best.opener)}. It finds
          vowels well but leaves too many consonants untested.
        </p>
      ),
    },
    {
      q: "Is it better to start Wordle with vowels or consonants?",
      text: "A mix is best. Openers with two or three vowels and common consonants like R, S, T and L beat vowel-heavy words.",
      a: <p>A mix is best. Openers with two or three vowels plus common consonants like R, S, T and L beat vowel-heavy words, because consonants narrow the answer down faster.</p>,
    },
    {
      q: "What is the best Wordle starting word?",
      text: `Of the openers we tested, ${U(best.opener)} had the best average over full games, while ${U(byInfo[0].opener)} revealed the most on the first guess alone.`,
      a: (
        <p>
          Of the openers we tested, {U(best.opener)} had the best average over full games, while {U(byInfo[0].opener)} revealed the most on the first guess alone. See the full
          ranking in our <Link href="/guides/best-wordle-starting-words/">best Wordle starting words</Link> guide.
        </p>
      ),
    },
  ];

  return (
    <BlogLayout
      path={path}
      faqs={faqs}
      related={["/guides/best-wordle-starting-words/", "/blog/hardest-wordle-words/", "/wordle-guesser/", "/blog/how-to-play-wordle/"]}
      lead="Lots of players open with AUDIO or ADIEU to knock out the vowels fast. Others swear by RAISE or SLATE. Instead of guessing, we let our solver play every likely answer with each opener."
    >
      <div className="answer-box">
        <strong>Short answer:</strong> {U(best.opener)} wins. Across {games.toLocaleString()} games it averaged <strong>{best.average} guesses</strong>. AUDIO averaged{" "}
        <strong>{audio.average}</strong>, and the vowel-heavy openers finished {vowelOpeners.every((r) => byAverage.indexOf(r) >= byAverage.length - vowelOpeners.length) ? "last" : "behind the leaders"}.
      </div>

      <Stats
        items={[
          { icon: "Trophy", value: `${U(best.opener)} ${best.average}`, label: "best average guesses" },
          { icon: "Scale", value: `RAISE ${raise.average}`, label: "average guesses" },
          { icon: "TriangleAlert", value: `AUDIO ${audio.average}`, label: "average guesses" },
        ]}
      />

      <h2 id="test">How we tested it</h2>
      <p>
        Arguments about Wordle openers usually come down to gut feeling. We wanted a fair, repeatable test. So our solver played all {games.toLocaleString()} likely answers in our
        word list once for each opener: {results.map((r) => U(r.opener)).join(", ")}. After the first guess, it always played its own top suggestion. The only thing that changed
        between runs was the first word.
      </p>

      <h2 id="results">The results</h2>
      <div className="table-wrap">
        <table>
          <caption className="visually-hidden">How five Wordle openers performed across every likely answer</caption>
          <thead>
            <tr>
              <th scope="col">Opener</th>
              <th scope="col">Vowels</th>
              <th scope="col">Words left after guess 1</th>
              <th scope="col">Avg. guesses</th>
              <th scope="col">Solved in 4 or fewer</th>
              <th scope="col">Not solved in 6</th>
            </tr>
          </thead>
          <tbody>
            {byAverage.map((r) => (
              <tr key={r.opener}>
                <td>
                  <strong>{U(r.opener)}</strong>
                </td>
                <td>{r.vowels}</td>
                <td>~{Math.round(r.expectedLeft)}</td>
                <td>{r.average}</td>
                <td>{r.solvedWithinFour}%</td>
                <td>{r.failures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">
        &ldquo;Words left after guess 1&rdquo; is the average number of possible answers remaining after the opener. Lower is better.
      </p>
      <HeroImage
        name="blog-audio-vs-raise-chart"
        alt="Letter tiles comparing SLATE and AUDIO as Wordle openers, with SLATE solving more puzzles in fewer guesses"
        caption="Same solver, same answers, different first word."
      />

      <h2 id="why-audio">Why AUDIO feels like a smart start</h2>
      <p>
        AUDIO tests four of the five vowels in one go, and almost every answer has at least one of them. So it <em>feels</em> productive: you usually see a yellow or two. But
        it&apos;s not actually safer. An all-gray AUDIO happens with {audio.allGrayPct}% of answers, while an all-gray RAISE happens with {raise.allGrayPct}%.{" "}
        {audio.allGrayPct > raise.allGrayPct ? "AUDIO comes back blank slightly more often." : "The two are about the same."}
      </p>

      <h2 id="why-it-loses">Why it still loses</h2>
      <p>The catch is what AUDIO doesn&apos;t test. Here&apos;s why it falls behind:</p>
      <IconList
        icon="TriangleAlert"
        tone="amber"
        items={[
          <><strong>Vowels are easy to find later.</strong> Most words have only one or two, and they show up in almost any second guess anyway.</>,
          <><strong>Consonants do the real work.</strong> Letters like R, S, T and L split the answers into far more groups. After AUDIO, about {Math.round(audio.expectedLeft)} words remain on average; after RAISE, about {Math.round(raise.expectedLeft)}.</>,
          <><strong>It spends a tile on U and skips E.</strong> U appears in only {share("u")}% of likely answers, while E, the most common letter of all, appears in {share("e")}%. AUDIO tests the weak one and misses the strong one.</>,
        ]}
      />
      <p>
        ADIEU, the other popular vowel opener, has the same problem. It averaged {adieu.average} guesses
        {adieu.average === audio.average ? ", exactly the same as AUDIO" : ""}. Over 100 games, starting with AUDIO instead of {U(best.opener)} costs you about {extraPer100} extra guesses.
      </p>

      <h2 id="raise-vs-slate">A surprise: the best first guess isn&apos;t always the best opener</h2>
      <p>
        {U(byInfo[0].opener)} reveals the most on the first guess alone; it leaves the fewest words on average. Yet {U(best.opener)}
        {best.opener === byInfo[0].opener ? " also" : ""} came out on top over complete games. Why the difference? A first guess also sets up the second one. Some openers leave
        letter patterns that are easier to finish off. The gaps are small, though: any of {byAverage.slice(0, 3).map((r) => U(r.opener)).join(", ")} is an excellent choice.
      </p>

      <h2 id="verdict">So which opener should you use?</h2>
      <IconList
        icon="CircleCheckBig"
        items={[
          <><strong>Want the best results?</strong> Start with {U(best.opener)} or another strong all-rounder from our <Link href="/guides/best-wordle-starting-words/">starting words guide</Link>.</>,
          <><strong>Love AUDIO?</strong> Keep it, but follow it with a word full of common consonants like R, S, T, L and N.</>,
          <><strong>Not sure what to play second?</strong> Enter your first guess into the <Link href="/wordle-guesser/">Wordle guesser</Link> and it will rank your best next move.</>,
        ]}
      />
      <p className="small muted">
        Method: each opener played all {games.toLocaleString()} likely answers in our word list once, with the solver taking its top-ranked suggestion after the first guess.
        Results depend on our word list, which is not the official NYT list.
      </p>
    </BlogLayout>
  );
}
