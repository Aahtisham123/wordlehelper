// Adds or updates a daily Wordle entry in data/daily.json.
//
//   npm run add-answer -- 2026-10-24 crane
//   npm run add-answer -- 2026-10-24 crane "A bird with long legs, or a machine on a building site"
//
// The optional third argument is your own one-line clue, shown as the final
// hint before the answer. Entries dated in the future stay hidden until the
// site is built on or after that date, so you can schedule hints ahead.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { puzzleNumber } from "../lib/site.mjs";

const file = join(dirname(fileURLToPath(import.meta.url)), "../data/daily.json");
const [date, rawAnswer, clue] = process.argv.slice(2);

if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || Number.isNaN(Date.parse(date))) {
  console.error("Usage: npm run add-answer -- YYYY-MM-DD ANSWER [\"clue\"]");
  process.exit(1);
}
const answer = (rawAnswer || "").toLowerCase();
if (!/^[a-z]{5}$/.test(answer)) {
  console.error("The answer must be exactly five letters.");
  process.exit(1);
}

const entries = JSON.parse(readFileSync(file, "utf8")).filter((e) => e.date !== date);
const entry = { date, number: puzzleNumber(date), answer };
if (clue) entry.clue = clue;
entries.push(entry);
entries.sort((a, b) => (a.date < b.date ? -1 : 1));
writeFileSync(file, JSON.stringify(entries, null, 2) + "\n");
console.log(`Saved Wordle #${entry.number} (${date}): ${answer.toUpperCase()}`);
