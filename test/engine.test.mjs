import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { score, encode, decode, filterCandidates, matchWords, unscramble, bestGuesses, rankByFrequency } from "../lib/engine.mjs";

const marks = (s) => Array.from(s).map((c) => ({ x: 0, y: 1, g: 2 })[c]);
const fb = (guess, answer) => decode(score(guess, answer), guess.length).map((m) => "xyg"[m]).join("");

test("scores simple guesses", () => {
  assert.equal(fb("crane", "crane"), "ggggg");
  assert.equal(fb("crane", "react"), "yygxy");
  assert.equal(fb("ghost", "crane"), "xxxxx");
});

test("handles duplicate letters like Wordle", () => {
  // Only one E in the answer: the green E claims it, the other E is gray.
  assert.equal(fb("geese", "those"), "xxxgg");
  // Two Ls guessed, one in answer, not in place: first L yellow, second gray.
  assert.equal(fb("llama", "hello"), "yyxxx");
  // Green beats an earlier yellow for the same letter.
  assert.equal(fb("speed", "abide"), "xxyxy");
  assert.equal(fb("eerie", "abide"), "xxxyg");
});

test("encode/decode round trip", () => {
  const m = [2, 0, 1, 1, 0];
  assert.deepEqual(decode(encode(m), 5), m);
});

test("filters candidates from feedback rows", () => {
  const words = ["crane", "react", "trace", "cater", "those", "ghost"];
  const left = filterCandidates(words, [{ word: "crane", marks: marks("yygxy") }]);
  assert.deepEqual(left, ["react"]);
  assert.deepEqual(filterCandidates(words, []), words);
});

test("pattern matching", () => {
  const words = ["crane", "crate", "grape", "trace", "brine"];
  assert.deepEqual(matchWords(words, { pattern: "cra?e" }), ["crane", "crate"]);
  assert.deepEqual(matchWords(words, { starts: "cr", excludes: "n" }), ["crate"]);
  assert.deepEqual(matchWords(words, { ends: "ce" }), ["trace"]);
  assert.deepEqual(matchWords(words, { includes: "pg" }), ["grape"]);
});

test("unscramble with blanks", () => {
  const words = ["cat", "act", "tack", "cast", "at"];
  assert.deepEqual(unscramble(words, "tca"), ["cat", "act", "at"]);
  assert.deepEqual(unscramble(words, "tca?", { exact: true }), ["tack", "cast"]);
});

test("solves real games with the shipped word list", () => {
  const answers = readFileSync(new URL("../data/words/5-answers.txt", import.meta.url), "utf8").trim().split("\n");
  const valid = readFileSync(new URL("../data/words/5-valid.txt", import.meta.url), "utf8").trim().split("\n");
  for (const secret of ["crane", "joker", "nymph", "piety", "vivid"]) {
    if (!answers.includes(secret)) continue;
    let candidates = answers;
    const rows = [];
    let guess = "raise";
    let turns = 1;
    while (guess !== secret && turns < 10) {
      rows.push({ word: guess, marks: decode(score(guess, secret), 5) });
      candidates = filterCandidates(answers, rows);
      assert.ok(candidates.includes(secret), `${secret} dropped after ${guess}`);
      guess = bestGuesses(candidates, valid, { limit: 1 })[0].word;
      turns++;
    }
    assert.ok(turns <= 6, `${secret} took ${turns} turns`);
  }
  assert.ok(rankByFrequency(answers).length === answers.length);
});
