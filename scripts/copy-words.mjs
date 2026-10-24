// Prepares generated public files before `next dev` / `next build`:
//   public/words/*.txt          word lists the browser tools fetch
//   public/words/past-answers.json  answers before today (for the dictionary)
//   public/search-index.json    pages for the site search
import { mkdirSync, readdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PAGES, LIST_KINDS, listSlugs, listPage } from "../lib/registry.mjs";
import { getWords, getDaily, buildDate } from "../lib/data.mjs";

const root = process.cwd();
const out = join(root, "public/words");
mkdirSync(out, { recursive: true });
for (const f of readdirSync(join(root, "data/words"))) {
  if (f.endsWith(".txt") && !f.startsWith("LICENSE")) copyFileSync(join(root, "data/words", f), join(out, f));
}

const today = buildDate();
const past = getDaily().filter((d) => d.date < today).map((d) => [d.answer, d.number, d.date]);
writeFileSync(join(out, "past-answers.json"), JSON.stringify(past));

const five = getWords(5);
const lists = listSlugs(five.valid).map(({ slug, kind, letter }) => {
  const all = five.valid.filter(LIST_KINDS[kind].test(letter));
  return listPage(slug, { all: all.length, common: all.filter((w) => five.answerSet.has(w)).length });
});
const index = [...PAGES, ...lists]
  .filter((p) => !p.noindex)
  .map((p) => ({ p: p.path, t: p.nav, d: p.description, s: p.section, k: p.keywords.join(" ") }));
writeFileSync(join(root, "public/search-index.json"), JSON.stringify(index));
console.log(`Prepared word lists, ${past.length} past answers and ${index.length} search entries.`);
