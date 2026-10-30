// Plays every likely answer with several opening words and records how each
// opener performs. Feeds the "AUDIO vs RAISE" blog post.
//
//   npm run compare-openers
//
// Same rules as the main benchmark: after the opener, the solver always plays
// its own top suggestion.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { bestGuesses, decode, entropy, filterCandidates, score } from "../lib/engine.mjs";

const root = process.cwd();
const list = (f) => readFileSync(join(root, "data/words", f), "utf8").trim().split("\n");
const answers = list("5-answers.txt");
const guesses = list("5-valid.txt");
const OPENERS = ["raise", "slate", "crane", "audio", "adieu"];

const results = [];
for (const opener of OPENERS) {
  const t0 = Date.now();
  const e = entropy(opener, answers);
  // How many answers share each first-guess color pattern.
  const groups = new Map();
  for (const a of answers) {
    const k = score(opener, a);
    groups.set(k, (groups.get(k) || 0) + 1);
  }
  const expectedLeft = [...groups.values()].reduce((s, n) => s + (n * n) / answers.length, 0);
  const allGray = groups.get(0) || 0;
  let total = 0;
  const dist = {};
  for (const secret of answers) {
    const rows = [];
    let guess = opener;
    let turns = 1;
    while (guess !== secret) {
      rows.push({ word: guess, marks: decode(score(guess, secret), 5) });
      guess = bestGuesses(filterCandidates(answers, rows), guesses, { limit: 1, maxPool: 300 })[0].word;
      turns++;
    }
    total += turns;
    dist[turns] = (dist[turns] || 0) + 1;
  }
  const within = (n) => Number(((100 * Object.entries(dist).filter(([k]) => Number(k) <= n).reduce((s, [, v]) => s + v, 0)) / answers.length).toFixed(1));
  results.push({
    opener,
    vowels: (opener.match(/[aeiou]/g) || []).length,
    bits: Number(e.bits.toFixed(3)),
    patterns: e.buckets,
    expectedLeft: Number(expectedLeft.toFixed(1)),
    allGrayPct: Number(((100 * allGray) / answers.length).toFixed(1)),
    average: Number((total / answers.length).toFixed(2)),
    solvedWithinFour: within(4),
    solvedWithinSix: within(6),
    failures: answers.length - Object.entries(dist).filter(([k]) => Number(k) <= 6).reduce((s, [, v]) => s + v, 0),
    distribution: dist,
  });
  console.log(`${opener}: avg ${results.at(-1).average} (${Date.now() - t0}ms)`);
}
writeFileSync(join(root, "data/opener-comparison.json"), JSON.stringify({ games: answers.length, results }, null, 2) + "\n");
