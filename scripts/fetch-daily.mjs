// Fetches Wordle answers from the NYT puzzle endpoint into data/daily.json.
//
//   npm run fetch-daily                 # yesterday and today (UTC)
//   npm run fetch-daily -- --backfill   # every puzzle since #1 (June 2021)
//   npm run fetch-daily -- 2026-10-01 2026-10-05   # a date range
//
// The endpoint (https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json) is
// unofficial and undocumented, so this script is defensive: failed dates are
// skipped, existing entries are never deleted, and hand-written clues are kept.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SITE, puzzleNumber } from "../lib/site.mjs";

const API = process.env.WORDLE_API || "https://www.nytimes.com/svc/wordle/v2";
const FILE = process.env.DAILY_FILE || join(process.cwd(), "data/daily.json");
const CONCURRENCY = 4;

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (date, n) => {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};

function datesToFetch(args) {
  const today = process.env.BUILD_DATE || iso(new Date());
  if (args.includes("--backfill")) {
    const out = [];
    for (let d = addDays(SITE.epoch, 1); d <= today; d = addDays(d, 1)) out.push(d);
    return out;
  }
  const range = args.filter((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
  if (range.length) {
    const [from, to = from] = range;
    const out = [];
    for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
    return out;
  }
  // Only up to today (UTC): the commit that adds each new day's answer is
  // what triggers the rebuild that publishes it.
  return [addDays(today, -1), today];
}

async function fetchOne(date, attempt = 1) {
  try {
    const res = await fetch(`${API}/${date}.json`, {
      headers: { "user-agent": `${SITE.domain} daily hints (+${SITE.url})`, accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 404) return { date, error: "not published yet" };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const answer = String(data.solution || "").toLowerCase();
    if (!/^[a-z]{5}$/.test(answer)) return { date, error: `unexpected solution ${JSON.stringify(data.solution)}` };
    const number = Number.isInteger(data.days_since_launch) ? data.days_since_launch : puzzleNumber(date);
    return { date: data.print_date || date, number, answer };
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      return fetchOne(date, attempt + 1);
    }
    return { date, error: e.message };
  }
}

async function main() {
  const dates = datesToFetch(process.argv.slice(2));
  const results = [];
  for (let i = 0; i < dates.length; i += CONCURRENCY) {
    results.push(...(await Promise.all(dates.slice(i, i + CONCURRENCY).map((d) => fetchOne(d)))));
  }

  const byDate = new Map(JSON.parse(readFileSync(FILE, "utf8")).map((e) => [e.date, e]));
  let added = 0;
  let changed = 0;
  for (const r of results) {
    if (r.error) continue;
    const old = byDate.get(r.date);
    if (!old) added++;
    else if (old.answer !== r.answer || old.number !== r.number) {
      changed++;
      console.warn(`Updated ${r.date}: ${old.answer} -> ${r.answer}`);
    } else continue;
    // Keep any hand-written clue.
    byDate.set(r.date, { ...old, date: r.date, number: r.number, answer: r.answer });
  }
  const entries = [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
  writeFileSync(FILE, JSON.stringify(entries, null, 2) + "\n");

  const failed = results.filter((r) => r.error);
  for (const f of failed.slice(0, 10)) console.warn(`Skipped ${f.date}: ${f.error}`);
  if (failed.length > 10) console.warn(`…and ${failed.length - 10} more skipped dates`);
  console.log(`Checked ${dates.length} dates: ${added} added, ${changed} updated, ${failed.length} skipped. ${entries.length} entries in total.`);

  // Fail loudly only if nothing at all could be fetched (endpoint down or blocked).
  if (failed.length === results.length) process.exit(1);
}

main();
