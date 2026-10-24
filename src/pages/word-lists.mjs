import { faq, helperCta, related, wordGrid } from "../lib/layout.mjs";
import { up } from "../lib/site.mjs";
import { pick } from "../lib/tools.mjs";
import { rankByFrequency } from "../assets/js/engine.js";

const ABC = "abcdefghijklmnopqrstuvwxyz".split("");
const VOWELS = "aeiou";

const KINDS = {
  "starting-with": {
    label: (c) => `5 Letter Words Starting With ${up(c)}`,
    phrase: (c) => `starting with ${up(c)}`,
    test: (c) => (w) => w[0] === c,
  },
  "ending-in": {
    label: (c) => `5 Letter Words Ending in ${up(c)}`,
    phrase: (c) => `ending in ${up(c)}`,
    test: (c) => (w) => w[4] === c,
  },
  containing: {
    label: (c) => `5 Letter Words Containing ${up(c)}`,
    phrase: (c) => `containing ${up(c)}`,
    test: (c) => (w) => w.includes(c),
  },
};

// The most frequent letters among a set of words, skipping `skip`.
function topLetters(list, skip, count = 3) {
  const freq = {};
  for (const w of list) for (const ch of new Set(w)) if (ch !== skip) freq[ch] = (freq[ch] || 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([ch, n]) => ({ ch, pct: Math.round((100 * n) / list.length) }));
}

function listPage(kind, c, { words }) {
  const def = KINDS[kind];
  const test = def.test(c);
  const { answers, valid, answerSet } = words[5];
  const common = answers.filter(test);
  const all = valid.filter(test);
  if (all.length === 0) return null;
  const rare = all.filter((w) => !answerSet.has(w));
  const best = rankByFrequency(common.length ? common : all).slice(0, 8).map((x) => x.word);
  const letters = topLetters(common.length ? common : all, c);
  const doubles = common.filter((w) => new Set(w).size < 5).length;
  const oneVowel = common.filter((w) => Array.from(w).filter((ch) => VOWELS.includes(ch)).length <= 1).length;
  const L = up(c);
  const path = `/5-letter-words/${kind}-${c}/`;
  const title = def.label(c);
  const phrase = def.phrase(c);
  const neighbours = ABC.filter((x) => x !== c);

  const insights = [];
  if (common.length) {
    insights.push(`There are <strong>${common.length}</strong> common five-letter words ${phrase} — the kind Wordle uses as answers — and <strong>${all.length}</strong> in total if you include rare words.`);
    if (letters.length) insights.push(`The letters that most often appear alongside ${L} in these words are ${letters.map((l) => `${up(l.ch)} (${l.pct}%)`).join(", ")}, so they are good letters to test next.`);
    if (doubles) insights.push(`${doubles} of the common words use a repeated letter, so don't rule out double letters.`);
    if (oneVowel) insights.push(`${oneVowel} contain only one vowel (A, E, I, O or U).`);
  } else {
    insights.push(`${L} is a rare letter in that position: we found no common five-letter words ${phrase}, only ${all.length} rarer ${all.length === 1 ? "word" : "words"} that are valid guesses. It is very unlikely to be a Wordle answer pattern.`);
  }

  const f = faq([
    {
      q: `How many 5 letter words are ${phrase}?`,
      a: `<p>Our Wordle dictionary has ${common.length} common five-letter words ${phrase} and ${all.length} including rare ones.</p>`,
    },
    {
      q: `What is a good Wordle guess ${phrase}?`,
      a: best.length
        ? `<p>${best.slice(0, 3).map(up).join(", ")} are strong choices: they use the letters that appear most often in the other words on this list, so they rule out the most possibilities.</p>`
        : "<p>There are no common words in this list, so try a different pattern.</p>",
    },
  ]);

  return {
    path,
    title: `${title} — Wordle Word List`,
    description: common.length
      ? `${all.length} five-letter words ${phrase}, with the ${common.length} most likely Wordle answers first. Best guesses include ${best.slice(0, 3).map(up).join(", ")}.`
      : `Five-letter words ${phrase}: ${all.length} rare valid Wordle guesses.`,
    noindex: all.length < 10,
    priority: 0.5,
    breadcrumbs: [
      { href: "/5-letter-words/", label: "5 Letter Words" },
      { href: path, label: title },
    ],
    schema: [f.schema],
    body: `
<h1>${title}</h1>
<p class="lead">${all.length} five-letter words ${phrase}, with the most likely Wordle answers first.</p>
${best.length ? `<section class="best"><h3>Best Wordle guesses ${phrase}</h3><p>${best.map((w) => `<strong>${up(w)}</strong>`).join(" · ")}</p></section>` : ""}
<ul>${insights.map((i) => `<li>${i}</li>`).join("")}</ul>
<p>Know more than one letter? Enter your guesses into the <a href="/">Wordle Helper</a> to filter by every clue at once, or search by several letters with the <a href="/5-letter-word-finder/">5 letter word finder</a>.</p>
${common.length ? `<h2>Common 5 letter words ${phrase} (${common.length})</h2>${wordGrid(rankByFrequency(common).map((x) => x.word).sort())}` : ""}
${rare.length ? `<h2>Rare 5 letter words ${phrase} (${rare.length})</h2><p class="small">Accepted as guesses but unlikely to be an answer.</p>${wordGrid(rare)}` : ""}
${helperCta()}
<h2>More 5 letter word lists</h2>
<p>${Object.keys(KINDS)
      .filter((k) => k !== kind)
      .map((k) => `<a href="/5-letter-words/${k}-${c}/">${KINDS[k].label(c)}</a>`)
      .join(" · ")}</p>
<p>${def.label("").replace(/ $/, "")}: ${neighbours.map((x) => `<a href="/5-letter-words/${kind}-${x}/">${up(x)}</a>`).join(" ")}</p>
${f.html}
${related(pick("helper", "finder", "list", "dictionary"))}
`,
  };
}

function indexPage(available, { words }) {
  const section = (kind, heading) =>
    `<h2>${heading}</h2><ul class="az">${ABC.filter((c) => available.has(`${kind}-${c}`))
      .map((c) => `<li><a href="/5-letter-words/${kind}-${c}/" title="${KINDS[kind].label(c)}">${up(c)}</a></li>`)
      .join("")}</ul>`;
  return {
    path: "/5-letter-words/",
    title: "5 Letter Words — Lists by Starting, Ending & Contained Letter",
    description: "Browse five-letter word lists for Wordle: words starting with, ending in or containing any letter from A to Z, with the most likely answers first.",
    priority: 0.6,
    breadcrumbs: [{ href: "/5-letter-words/", label: "5 Letter Words" }],
    body: `
<h1>5 Letter Words</h1>
<p class="lead">Five-letter word lists for Wordle and other word games, grouped by the letter they start with, end in or contain.</p>
<p>Every list puts the common words — the realistic Wordle answers — first, and suggests the best guesses for that pattern. Our dictionary holds ${words[5].answers.length.toLocaleString()} common five-letter words and ${words[5].valid.length.toLocaleString()} valid guesses; you can see them all on the <a href="/wordle-word-list/">Wordle word list</a>.</p>
${section("starting-with", "5 letter words starting with…")}
${section("ending-in", "5 letter words ending in…")}
${section("containing", "5 letter words containing…")}
${helperCta("Have green, yellow and gray letters?")}
${related(pick("helper", "finder", "list", "unscrambler"))}
`,
  };
}

export default function wordLists(ctx) {
  const pages = [];
  const available = new Set();
  for (const kind of Object.keys(KINDS)) {
    for (const c of ABC) {
      const page = listPage(kind, c, ctx);
      if (page) {
        pages.push(page);
        available.add(`${kind}-${c}`);
      }
    }
  }
  // Drop cross-links to letters that have no page.
  for (const p of pages) {
    p.body = p.body.replace(/<a href="\/5-letter-words\/([a-z-]+)-([a-z])\/">([^<]*)<\/a>/g, (m, kind, c, text) =>
      available.has(`${kind}-${c}`) ? m : `<span class="small">${text}</span>`
    );
  }
  return [indexPage(available, ctx), ...pages];
}
