import { faq, helperCta, related } from "../lib/layout.mjs";
import { esc, formatDate, shortDate, puzzleNumber, up } from "../lib/site.mjs";
import { pick } from "../lib/tools.mjs";

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const RARE = new Set(["j", "q", "x", "z", "v", "k", "w", "f"]);

export function hintsFor(entry) {
  const w = entry.answer;
  const letters = Array.from(w);
  const vowels = letters.filter((c) => VOWELS.has(c)).length;
  const repeats = [...new Set(letters.filter((c, i) => letters.indexOf(c) !== i))];
  const rare = [...new Set(letters.filter((c) => RARE.has(c)))];
  const hints = [
    {
      title: "Hint 1: How many vowels?",
      body: `Today's word has <strong>${vowels === 0 ? "no vowels" : `${vowels} vowel${vowels === 1 ? "" : "s"}`}</strong> (counting A, E, I, O and U${letters.includes("y") ? "; it also contains a Y" : ""}).`,
    },
    {
      title: "Hint 2: Any repeated letters?",
      body: repeats.length
        ? `<strong>Yes.</strong> ${repeats.length === 1 ? "One letter appears" : `${repeats.length} letters appear`} more than once.`
        : "<strong>No.</strong> All five letters are different.",
    },
    {
      title: "Hint 3: Any uncommon letters?",
      body: rare.length
        ? `<strong>Yes</strong> — it uses ${rare.length === 1 ? "a less common letter" : `${rare.length} less common letters`} (one of F, J, K, Q, V, W, X or Z).`
        : "<strong>No.</strong> It is made only of everyday letters — no F, J, K, Q, V, W, X or Z.",
    },
    { title: "Hint 4: First letter", body: `The word starts with <strong>${up(w[0])}</strong>.` },
    { title: "Hint 5: Last letter", body: `The word ends with <strong>${up(w[4])}</strong>.` },
  ];
  if (entry.clue) hints.push({ title: "Hint 6: A clue to the meaning", body: esc(entry.clue) });
  return hints;
}

function hintPage({ daily, buildDate }) {
  const entry = daily[0];
  const isToday = entry && entry.date === buildDate;
  const todayNumber = puzzleNumber(buildDate);
  let main;
  if (entry) {
    const hints = hintsFor(entry);
    main = `
<section class="tool" data-daily data-date="${entry.date}" data-number="${entry.number}">
  <p class="small">${isToday ? "Today's puzzle" : "Latest puzzle with hints"}: <strong>Wordle #${entry.number}</strong> · ${formatDate(entry.date)}</p>
  <p class="notice" data-stale hidden></p>
  <p>Open the hints one at a time. Each one gives away a little more, and the answer is hidden in the last box.</p>
  <div class="hint-list">
    ${hints.map((h) => `<details><summary>${h.title}</summary><div><p>${h.body}</p></div></details>`).join("\n    ")}
    <details><summary>Show today's Wordle answer</summary><div><p>The answer to Wordle #${entry.number} is:</p><p class="answer-reveal">${up(entry.answer)}</p></div></details>
  </div>
</section>`;
  } else {
    main = `
<section class="tool">
  <p class="small">Today's puzzle: <strong>Wordle #${todayNumber}</strong> · ${formatDate(buildDate)}</p>
  <p class="notice">Hints for today's Wordle are on the way. In the meantime, the <a href="/">Wordle Helper</a> can solve it with you: enter your guesses and it shows every word that still fits.</p>
</section>`;
  }

  const recent = daily.slice(isToday ? 1 : 0, (isToday ? 1 : 0) + 7);
  const questions = [
    {
      q: "What is today's Wordle answer?",
      a: entry
        ? `<p>The answer is hidden in the last box above so you don't see it by accident. Open the hints first — most players only need one or two of them.</p>`
        : `<p>We publish hints and the answer as soon as the new puzzle is available. Until then, use the <a href="/">Wordle Helper</a> to narrow it down from your own guesses.</p>`,
    },
    {
      q: "What time does Wordle reset?",
      a: "<p>A new Wordle is released every day at midnight in your local time zone, so players in different countries can be on different puzzles for a few hours. This page always shows the newest puzzle we have hints for, with its number and date.</p>",
    },
    {
      q: "How many vowels are in today's Wordle?",
      a: "<p>Open Hint 1 above. It tells you how many of A, E, I, O and U appear, and whether the word also uses a Y.</p>",
    },
    {
      q: "What was yesterday's Wordle?",
      a: `<p>Yesterday's answer and every answer before it are listed in our <a href="/wordle-answers/">Wordle answers archive</a>.</p>`,
    },
  ];
  const f = faq(questions);
  return {
    path: "/wordle-hint-today/",
    title: entry ? `Today's Wordle Hint & Answer — #${entry.number} (${shortDate(entry.date)})` : "Today's Wordle Hint & Answer",
    description: entry
      ? `Spoiler-free hints for Wordle #${entry.number} on ${shortDate(entry.date)}: vowels, repeated letters, first letter and more — then the answer if you need it.`
      : "Spoiler-free hints for today's Wordle: vowels, repeated letters, first letter and more — then the answer if you need it.",
    changefreq: "daily",
    priority: 0.9,
    lastmod: entry ? entry.date : buildDate,
    breadcrumbs: [{ href: "/wordle-hint-today/", label: "Today's Wordle Hint" }],
    scripts: ["/assets/js/daily.js"],
    schema: [f.schema],
    body: `
<h1>Today's Wordle Hint</h1>
<p class="lead">Spoiler-free clues for today's Wordle, revealed one at a time — and the answer at the bottom if you really need it.</p>
${main}
${helperCta("Stuck? Try our Wordle Helper.")}
<h2>How to use these Wordle hints</h2>
<p>The hints get stronger as you go. The first three tell you about the shape of the word — vowels, double letters and rare letters — which helps you choose a good next guess without giving anything away. Hints 4 and 5 reveal the first and last letters, which is usually enough to finish. If you would rather work it out from your own clues, enter your guesses into the <a href="/">Wordle Helper</a> and it will list every word that still fits.</p>
<p>New to the game, or want to rely on hints less often? Our <a href="/guides/wordle-tips-strategy/">Wordle tips and strategy guide</a> and the list of <a href="/guides/best-wordle-starting-words/">best Wordle starting words</a> are good places to start.</p>
${
  recent.length
    ? `<h2>Recent Wordle answers</h2><details class="notice"><summary>Show the last ${recent.length} answers (spoilers)</summary><div class="table-wrap"><table><thead><tr><th>Puzzle</th><th>Date</th><th>Answer</th></tr></thead><tbody>${recent
        .map((d) => `<tr><td>#${d.number}</td><td>${shortDate(d.date)}</td><td><strong>${up(d.answer)}</strong></td></tr>`)
        .join("")}</tbody></table></div></details><p><a href="/wordle-answers/">See every past Wordle answer →</a></p>`
    : ""
}
${f.html}
${related(pick("helper", "answers", "guesser", "finder"))}
`,
  };
}

function archivePage({ daily, buildDate }) {
  const past = daily.filter((d) => d.date < buildDate);
  const rows = past.map((d) => `<tr><td>#${d.number}</td><td>${formatDate(d.date)}</td><td><strong>${up(d.answer)}</strong></td></tr>`).join("");
  const letterCounts = {};
  for (const d of past) for (const c of new Set(d.answer)) letterCounts[c] = (letterCounts[c] || 0) + 1;
  const topLetters = Object.entries(letterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([c]) => up(c));
  const questions = [
    {
      q: "What was yesterday's Wordle answer?",
      a: past.length
        ? `<p>The most recent answer in the archive is <strong>${up(past[0].answer)}</strong> (Wordle #${past[0].number}, ${formatDate(past[0].date)}). Today's puzzle has its own page: <a href="/wordle-hint-today/">today's Wordle hint</a>.</p>`
        : `<p>The archive is being filled in. For today's puzzle, see <a href="/wordle-hint-today/">today's Wordle hint</a>.</p>`,
    },
    {
      q: "Why are today's answers not on this page?",
      a: `<p>To avoid spoilers, an answer only moves into the archive once the next puzzle is out. Until then it lives on <a href="/wordle-hint-today/">today's hint page</a>, hidden behind a reveal button.</p>`,
    },
    {
      q: "How can past answers help me play?",
      a: `<p>Past answers show which letters and patterns Wordle likes. You can also check any word in the <a href="/wordle-dictionary/">Wordle dictionary</a> to see whether it has already been used.</p>`,
    },
  ];
  const f = faq(questions);
  return {
    path: "/wordle-answers/",
    title: "Past Wordle Answers — Full Archive of Every Solution",
    description: "Every past Wordle answer in one list, newest first, with puzzle numbers and dates. Check what yesterday's word was and which words have already been used.",
    changefreq: "daily",
    priority: 0.8,
    breadcrumbs: [{ href: "/wordle-answers/", label: "Past Wordle Answers" }],
    schema: [f.schema],
    body: `
<h1>Past Wordle Answers</h1>
<p class="lead">Every previous Wordle solution, newest first. Today's answer is not shown here — it moves into the archive once the next puzzle is released.</p>
<p>Want a clue for today instead? Visit <a href="/wordle-hint-today/">today's Wordle hint</a>, or solve it step by step with the <a href="/">Wordle Helper</a>.</p>
${
  past.length
    ? `<p>The archive lists <strong>${past.length.toLocaleString()}</strong> answers. The letters that appear in the most answers so far are ${topLetters.join(", ")}.</p>
<div class="table-wrap"><table><thead><tr><th>Puzzle</th><th>Date</th><th>Answer</th></tr></thead><tbody>${rows}</tbody></table></div>`
    : `<p class="notice">The answers archive is being filled in. Check back soon.</p>`
}
${helperCta()}
${f.html}
${related(pick("hint", "helper", "dictionary", "list"))}
`,
  };
}

export default function daily(ctx) {
  return [hintPage(ctx), archivePage(ctx)];
}
