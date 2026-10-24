// Checks the built site in out/ (run `npm run build` first).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out", import.meta.url));
const built = existsSync(join(out, "index.html"));

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === "_next" ? [] : htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, name) => {
  const m = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`).exec(html);
  return m ? decode(m[1]) : null;
};

test("built pages meet SEO and accessibility rules", { skip: !built && "run npm run build first" }, () => {
  const files = htmlFiles(out).filter((f) => !/\/(404|_not-found)(\/index)?\.html$/.test(f) && !f.endsWith("_not-found.html"));
  assert.ok(files.length >= 95, `only ${files.length} pages`);
  const problems = [];
  const titles = new Map();
  for (const file of files) {
    const rel = file.slice(out.length);
    const html = readFileSync(file, "utf8");
    const title = decode((/<title>([^<]*)<\/title>/.exec(html) || [])[1] || "");
    const desc = meta(html, "name", "description") || "";
    if (!title) problems.push(`${rel}: missing title`);
    if (title.length > 50) problems.push(`${rel}: title ${title.length} chars: ${title}`);
    if (!desc) problems.push(`${rel}: missing description`);
    if (desc.length > 144) problems.push(`${rel}: description ${desc.length} chars`);
    if (titles.has(title)) problems.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${rel}: needs exactly one h1`);
    if (!/<link rel="canonical" href="https:\/\/wordlehelp\.co\//.test(html)) problems.push(`${rel}: missing canonical`);
    const og = meta(html, "property", "og:image");
    if (!og) problems.push(`${rel}: missing og:image`);
    else if (!existsSync(join(out, new URL(og).pathname))) problems.push(`${rel}: og:image file missing ${og}`);
    if (!meta(html, "name", "twitter:card")) problems.push(`${rel}: missing twitter:card`);
    if (!/Not affiliated with The New York Times/.test(html)) problems.push(`${rel}: missing NYT disclaimer`);
    if (!/class="skip-link"/.test(html)) problems.push(`${rel}: missing skip link`);
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      const alt = /\balt="([^"]*)"/.exec(img);
      if (!alt || !alt[1].trim()) problems.push(`${rel}: image without alt text: ${img.slice(0, 90)}`);
      const src = /\bsrc="([^"]+)"/.exec(img)?.[1] ?? "";
      if (src.startsWith("/images/") && !src.endsWith(".webp")) problems.push(`${rel}: non-WebP image ${src}`);
    }
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(json);
      } catch {
        problems.push(`${rel}: invalid JSON-LD`);
      }
    }
    // Every page except the homepage links to it from its main content.
    if (rel !== "/index.html") {
      const main = html.slice(html.indexOf("<main"), html.indexOf("</main>")).replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, "");
      if (!/<a [^>]*href="\/"[^>]*>(?:<[^>]+>)*[^<]*Wordle (Helper|solver)/i.test(main)) problems.push(`${rel}: no "Wordle Helper" link to the homepage`);
    }
  }
  assert.deepEqual(problems, []);
});

test("no broken internal links or assets", { skip: !built && "run npm run build first" }, () => {
  const broken = new Set();
  for (const file of htmlFiles(out)) {
    const html = readFileSync(file, "utf8");
    for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      if (url.startsWith("/_next/")) {
        if (!existsSync(join(out, url))) broken.add(`${file.slice(out.length)} -> ${url}`);
        continue;
      }
      const target = join(out, decodeURIComponent(url));
      const ok = url.endsWith("/") ? existsSync(join(target, "index.html")) : existsSync(target);
      if (!ok) broken.add(`${file.slice(out.length)} -> ${url}`);
    }
  }
  assert.deepEqual([...broken], []);
});

test("sitemap, robots, manifest, icons and 404 exist", { skip: !built && "run npm run build first" }, () => {
  const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/wordlehelp\.co\/<\/loc>/);
  for (const [, loc] of sitemap.matchAll(/<loc>https:\/\/wordlehelp\.co(\/[^<]*)<\/loc>/g)) {
    assert.ok(existsSync(join(out, loc, "index.html")), `sitemap URL missing: ${loc}`);
  }
  assert.match(readFileSync(join(out, "robots.txt"), "utf8"), /Sitemap: https:\/\/wordlehelp\.co\/sitemap\.xml/);
  for (const f of ["404.html", "manifest.webmanifest", "favicon.ico", "icon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]) {
    assert.ok(existsSync(join(out, f)), `missing ${f}`);
  }
  const notFound = readFileSync(join(out, "404.html"), "utf8");
  assert.match(notFound, /noindex/);
});
