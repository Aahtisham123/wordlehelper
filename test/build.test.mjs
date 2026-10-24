import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}

test("site builds and every page is well formed", () => {
  execFileSync("node", ["src/build.mjs"], { cwd: root, env: { ...process.env, BUILD_DATE: "2026-10-24" } });
  const files = htmlFiles(dist);
  assert.ok(files.length > 90, `only ${files.length} pages built`);
  const missing = new Set();
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const rel = file.slice(dist.length);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${rel} should have exactly one h1`);
    assert.match(html, /<link rel="canonical" href="https:\/\/wordlehelp\.co\//, `${rel} canonical`);
    assert.match(html, /Not affiliated with The New York Times/, `${rel} disclaimer`);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = join(dist, href);
      const ok = href.endsWith("/") ? existsSync(join(target, "index.html")) : existsSync(target);
      if (!ok) missing.add(`${rel} -> ${href}`);
    }
    // Every page except the homepage links back to it as "Wordle Helper" in its main content.
    if (rel !== "/index.html" && rel !== "/404.html") {
      const main = html.slice(html.indexOf("<main"), html.indexOf("</main>")).replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, "");
      assert.match(main, /<a href="\/">Wordle (Helper|solver)<\/a>/i, `${rel} should link to the homepage tool`);
    }
  }
  assert.deepEqual([...missing], [], "broken internal links");
  assert.ok(readFileSync(join(dist, "sitemap.xml"), "utf8").includes("<loc>https://wordlehelp.co/</loc>"));
});

test("daily hint and archive pages use the right entries", () => {
  execFileSync("node", ["src/build.mjs"], {
    cwd: root,
    env: { ...process.env, BUILD_DATE: "2026-10-24", DAILY_FILE: join(root, "test/fixtures/daily.json") },
  });
  const hint = readFileSync(join(dist, "wordle-hint-today/index.html"), "utf8");
  assert.match(hint, /Wordle #1953/);
  assert.match(hint, /<details><summary>Show today's Wordle answer<\/summary>[\s\S]*CRANE/);
  assert.match(hint, /A long-legged bird/);
  assert.doesNotMatch(hint, /GHOST/, "future answers must stay hidden");
  const archive = readFileSync(join(dist, "wordle-answers/index.html"), "utf8");
  assert.match(archive, /EERIE/);
  assert.match(archive, /PLANT/);
  assert.doesNotMatch(archive, /CRANE/, "today's answer stays off the archive");
  assert.doesNotMatch(archive, /GHOST/);
  const past = JSON.parse(readFileSync(join(dist, "assets/words/past-answers.json"), "utf8"));
  assert.deepEqual(past.map((p) => p[0]).sort(), ["eerie", "plant"]);
  // Restore the normal build.
  execFileSync("node", ["src/build.mjs"], { cwd: root, env: { ...process.env, BUILD_DATE: "2026-10-24" } });
});
