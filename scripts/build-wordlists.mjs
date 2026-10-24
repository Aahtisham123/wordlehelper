// Regenerates data/words/*.txt and data/openers.json from SCOWL (via the
// wordlist-english package). Only needed when changing the dictionary;
// the generated files are committed so the site build has no dependencies.
//
//   npm install && npm run wordlists

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { entropy, score } from "../src/assets/js/engine.js";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = dirname(require.resolve("wordlist-english/package.json"));

// SCOWL size levels. "Common" words become the likely answers; everything up
// to level 70 is accepted as a valid guess.
const COMMON_LEVELS = [10, 20, 35, 40, 50];
const VALID_LEVELS = [10, 20, 35, 40, 50, 55, 60, 70];
const LENGTHS = [3, 4, 5, 6, 7];

// Removed from every list.
const BANNED = new Set(readFileSync(join(root, "data/blocklist.txt"), "utf8").split(/\s+/).filter(Boolean));
// Kept as valid guesses but never offered as likely answers.
const NOT_ANSWERS = new Set(readFileSync(join(root, "data/not-answers.txt"), "utf8").split(/\s+/).filter(Boolean));

function load(levels) {
  const out = new Set();
  for (const lvl of levels) {
    for (const dialect of ["english", "american"]) {
      for (const w of JSON.parse(readFileSync(join(pkgDir, `${dialect}-words-${lvl}.json`), "utf8"))) {
        if (/^[a-z]+$/.test(w) && LENGTHS.includes(w.length) && !BANNED.has(w)) out.add(w);
      }
    }
  }
  return out;
}

const valid = load(VALID_LEVELS);
const common = load(COMMON_LEVELS);
const all = new Set([...valid]);

// Wordle answers are almost never simple plurals, third-person verbs or
// regular past tenses, so drop those inflections from the answer lists.
function isInflection(w) {
  if (w.endsWith("s") && !w.endsWith("ss")) {
    if (all.has(w.slice(0, -1))) return true;
    if (w.endsWith("es") && all.has(w.slice(0, -2))) return true;
    if (w.endsWith("ies") && all.has(w.slice(0, -3) + "y")) return true;
  }
  if (w.endsWith("ed")) {
    const stem = w.slice(0, -2);
    if (all.has(stem) || all.has(stem + "e") || all.has(w.slice(0, -1))) return true;
    if (stem.length > 2 && stem.at(-1) === stem.at(-2) && all.has(stem.slice(0, -1))) return true;
    if (w.endsWith("ied") && all.has(w.slice(0, -3) + "y")) return true;
  }
  return false;
}

mkdirSync(join(root, "data/words"), { recursive: true });
const answersByLength = {};
for (const n of LENGTHS) {
  const answers = [...common].filter((w) => w.length === n && !isInflection(w) && !NOT_ANSWERS.has(w)).sort();
  const guesses = [...valid].filter((w) => w.length === n).sort();
  answersByLength[n] = answers;
  writeFileSync(join(root, `data/words/${n}-answers.txt`), answers.join("\n") + "\n");
  writeFileSync(join(root, `data/words/${n}-valid.txt`), guesses.join("\n") + "\n");
  console.log(`${n} letters: ${answers.length} likely answers, ${guesses.length} valid guesses`);
}

// Best opening words for the 5-letter game, by expected information.
const answers5 = answersByLength[5];
const guesses5 = [...valid].filter((w) => w.length === 5);
const t = Date.now();
const openers = guesses5
  .map((w) => ({ word: w, ...entropy(w, answers5) }))
  .sort((a, b) => b.bits - a.bits)
  .slice(0, 50)
  .map((o) => ({ word: o.word, bits: Number(o.bits.toFixed(3)), buckets: o.buckets, isAnswer: answers5.includes(o.word) }));
writeFileSync(join(root, "data/openers.json"), JSON.stringify(openers, null, 2) + "\n");
console.log(`Ranked ${guesses5.length} openers in ${Date.now() - t}ms. Top 5: ${openers.slice(0, 5).map((o) => o.word).join(", ")}`);

// Best second words to pair with the top openers: the guess that, played
// together with the opener, splits the answers into the most groups.
const pairs = {};
for (const opener of openers.slice(0, 3).map((o) => o.word)) {
  const first = answers5.map((a) => score(opener, a));
  const ranked = guesses5
    .filter((g) => g !== opener)
    .map((g) => {
      const buckets = new Map();
      answers5.forEach((a, i) => {
        const k = first[i] * 243 + score(g, a);
        buckets.set(k, (buckets.get(k) || 0) + 1);
      });
      let bits = 0;
      for (const n of buckets.values()) bits -= (n / answers5.length) * Math.log2(n / answers5.length);
      return { word: g, bits: Number(bits.toFixed(3)), buckets: buckets.size };
    })
    .sort((a, b) => b.bits - a.bits)
    .slice(0, 5);
  pairs[opener] = ranked;
}
writeFileSync(join(root, "data/second-words.json"), JSON.stringify(pairs, null, 2) + "\n");
console.log("Best second words:", Object.entries(pairs).map(([k, v]) => `${k} → ${v[0].word}`).join(", "));
