// Server-side data loaders. Only import from server components and scripts.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (f) => readFileSync(join(root, f), "utf8");
const json = (f) => JSON.parse(read(f));
const list = (f) => read(f).trim().split("\n");

export const buildDate = () => process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const wordCache = {};
export function getWords(n) {
  if (!wordCache[n]) {
    const answers = list(`data/words/${n}-answers.txt`);
    const valid = list(`data/words/${n}-valid.txt`);
    wordCache[n] = { answers, valid, answerSet: new Set(answers) };
  }
  return wordCache[n];
}

/** Daily entries visible on the build date, newest first. */
export function getDaily() {
  const file = process.env.DAILY_FILE || join(root, "data/daily.json");
  const today = buildDate();
  return JSON.parse(readFileSync(file, "utf8"))
    .filter((d) => d.date <= today)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getOpeners = () => json("data/openers.json");
export const getSecondWords = () => json("data/second-words.json");
export const getBenchmark = () => json("data/benchmark.json");
export const getTestimonials = () => json("data/testimonials.json");
