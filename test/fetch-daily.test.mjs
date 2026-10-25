import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// A stand-in for the NYT endpoint.
const PUZZLES = {
  "2026-10-23": { solution: "eerie", print_date: "2026-10-23", days_since_launch: 1952 },
  "2026-10-24": { solution: "CRANE", print_date: "2026-10-24", days_since_launch: 1953 },
  "2026-10-25": { solution: "12345", print_date: "2026-10-25", days_since_launch: 1954 },
};

function run(args, env) {
  return new Promise((resolve) => {
    execFile("node", ["scripts/fetch-daily.mjs", ...args], { env: { ...process.env, ...env } }, (err, stdout, stderr) =>
      resolve({ code: err ? err.code : 0, stdout, stderr }),
    );
  });
}

test("fetch-daily merges answers, keeps clues and skips bad data", async () => {
  const server = createServer((req, res) => {
    const date = /(\d{4}-\d{2}-\d{2})\.json$/.exec(req.url)?.[1];
    if (!PUZZLES[date]) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(PUZZLES[date]));
  });
  await new Promise((r) => server.listen(0, r));
  const api = `http://127.0.0.1:${server.address().port}`;
  const file = join(mkdtempSync(join(tmpdir(), "daily-")), "daily.json");
  writeFileSync(file, JSON.stringify([{ date: "2026-10-23", number: 1952, answer: "eerie", clue: "Strange and spooky" }]));

  const r = await run(["2026-10-22", "2026-10-25"], { WORDLE_API: api, DAILY_FILE: file });
  server.close();
  assert.equal(r.code, 0, r.stderr);
  const entries = JSON.parse(readFileSync(file, "utf8"));
  assert.deepEqual(entries, [
    { date: "2026-10-23", number: 1952, answer: "eerie", clue: "Strange and spooky" },
    { date: "2026-10-24", number: 1953, answer: "crane" },
  ]);
  assert.match(r.stderr, /Skipped 2026-10-25: unexpected solution/);
  assert.match(r.stderr, /Skipped 2026-10-22: not published yet/);
});

test("fetch-daily fails loudly when the endpoint is unreachable", async () => {
  const file = join(mkdtempSync(join(tmpdir(), "daily-")), "daily.json");
  writeFileSync(file, "[]");
  const r = await run(["2026-10-24"], { WORDLE_API: "http://127.0.0.1:9", DAILY_FILE: file });
  assert.equal(r.code, 1);
  assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), []);
});
