// Builds the static site into dist/.
//
//   node src/build.mjs                 # uses today's date (UTC)
//   BUILD_DATE=2026-10-24 node src/build.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, cpSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "./lib/site.mjs";
import { render } from "./lib/layout.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const buildDate = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const readList = (f) => readFileSync(join(root, "data/words", f), "utf8").trim().split("\n");
const words = {};
for (const n of [3, 4, 5, 6, 7]) {
  const answers = readList(`${n}-answers.txt`);
  const valid = readList(`${n}-valid.txt`);
  words[n] = { answers, valid, answerSet: new Set(answers), validSet: new Set(valid) };
}

// Daily entries dated after the build date stay hidden until their day.
const daily = JSON.parse(readFileSync(process.env.DAILY_FILE || join(root, "data/daily.json"), "utf8"))
  .filter((d) => d.date <= buildDate)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const ctx = {
  buildDate,
  words,
  daily,
  openers: JSON.parse(readFileSync(join(root, "data/openers.json"), "utf8")),
  secondWords: JSON.parse(readFileSync(join(root, "data/second-words.json"), "utf8")),
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Static assets. The stylesheet gets a content hash for long-lived caching.
cpSync(join(root, "src/assets"), join(out, "assets"), { recursive: true });
const cssSource = readFileSync(join(root, "src/assets/css/site.css"));
const cssPath = `/assets/css/site.${createHash("sha1").update(cssSource).digest("hex").slice(0, 8)}.css`;
writeFileSync(join(out, cssPath), cssSource);
mkdirSync(join(out, "assets/words"), { recursive: true });
for (const n of [3, 4, 5, 6, 7]) {
  for (const kind of ["answers", "valid"]) {
    writeFileSync(join(out, `assets/words/${n}-${kind}.txt`), words[n][kind].join("\n"));
  }
}
// Today's answer is left out so the dictionary can't spoil it.
writeFileSync(join(out, "assets/words/past-answers.json"), JSON.stringify(daily.filter((d) => d.date < buildDate).map((d) => [d.answer, d.number, d.date])));
cpSync(join(root, "src/static"), out, { recursive: true });

const pages = [];
for (const file of readdirSync(join(root, "src/pages")).sort()) {
  if (!file.endsWith(".mjs")) continue;
  const mod = await import(join(root, "src/pages", file));
  const result = mod.default(ctx);
  pages.push(...(Array.isArray(result) ? result : [result]));
}

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.path)) throw new Error(`Duplicate page path ${page.path}`);
  seen.add(page.path);
  const file = page.path === "/404/" ? join(out, "404.html") : join(out, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page, { css: cssPath, buildDate }));
}

const sitemap = pages
  .filter((p) => !p.noindex && p.path !== "/404/")
  .map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${p.lastmod || buildDate}</lastmod><changefreq>${p.changefreq || "monthly"}</changefreq><priority>${p.priority ?? 0.5}</priority></url>`)
  .join("\n");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

if (!existsSync(join(out, "404.html"))) throw new Error("Missing 404 page");
console.log(`Built ${pages.length} pages into dist/ (build date ${buildDate}, ${daily.length} daily entries).`);
