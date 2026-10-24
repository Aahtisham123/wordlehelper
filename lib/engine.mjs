// Wordle solving engine. Shared by the browser tools and the Node build/tests.
//
// Feedback is encoded as a base-3 integer, one digit per position, with
// position 0 as the least significant digit: 0 = gray, 1 = yellow, 2 = green.

export const GRAY = 0;
export const YELLOW = 1;
export const GREEN = 2;

const A = 97;

// Score `guess` against `answer` exactly as Wordle does, including the
// duplicate-letter rules (greens are claimed first, then yellows left to right
// while unmatched copies of that letter remain in the answer).
export function score(guess, answer) {
  const n = guess.length;
  const counts = new Int8Array(26);
  const marks = new Int8Array(n);
  for (let i = 0; i < n; i++) {
    const a = answer.charCodeAt(i) - A;
    if (guess.charCodeAt(i) - A === a) marks[i] = GREEN;
    else counts[a]++;
  }
  for (let i = 0; i < n; i++) {
    if (marks[i] === GREEN) continue;
    const g = guess.charCodeAt(i) - A;
    if (counts[g] > 0) {
      marks[i] = YELLOW;
      counts[g]--;
    }
  }
  let code = 0;
  for (let i = n - 1; i >= 0; i--) code = code * 3 + marks[i];
  return code;
}

export function encode(marks) {
  let code = 0;
  for (let i = marks.length - 1; i >= 0; i--) code = code * 3 + marks[i];
  return code;
}

export function decode(code, n) {
  const marks = [];
  for (let i = 0; i < n; i++) {
    marks.push(code % 3);
    code = Math.floor(code / 3);
  }
  return marks;
}

// Keep only the words that would have produced every recorded feedback.
// `rows` is a list of { word, marks } with marks as an array of 0/1/2.
export function filterCandidates(words, rows) {
  const usable = rows.filter((r) => r.word && r.word.length > 0);
  if (usable.length === 0) return words.slice();
  const codes = usable.map((r) => encode(r.marks));
  return words.filter((w) => {
    for (let i = 0; i < usable.length; i++) {
      if (w.length !== usable[i].word.length) return false;
      if (score(usable[i].word, w) !== codes[i]) return false;
    }
    return true;
  });
}

// Positional + overall letter frequencies across a word list.
export function letterStats(words) {
  const n = words.length ? words[0].length : 5;
  const overall = new Float64Array(26);
  const positional = Array.from({ length: n }, () => new Float64Array(26));
  for (const w of words) {
    const seen = new Set();
    for (let i = 0; i < w.length; i++) {
      const c = w.charCodeAt(i) - A;
      positional[i][c]++;
      if (!seen.has(c)) {
        overall[c]++;
        seen.add(c);
      }
    }
  }
  return { overall, positional, total: words.length };
}

// Heuristic "how likely is this the answer" score: rewards letters that are
// common in the remaining candidates, in the positions they usually appear.
export function frequencyScore(word, stats) {
  let s = 0;
  const seen = new Set();
  for (let i = 0; i < word.length; i++) {
    const c = word.charCodeAt(i) - A;
    s += stats.positional[i][c];
    if (!seen.has(c)) {
      s += stats.overall[c];
      seen.add(c);
    }
  }
  return s;
}

export function rankByFrequency(words, pool = words) {
  const stats = letterStats(pool);
  return words
    .map((w) => ({ word: w, score: frequencyScore(w, stats) }))
    .sort((a, b) => b.score - a.score || (a.word < b.word ? -1 : 1));
}

// Expected information (in bits) a guess reveals about the candidate set.
export function entropy(guess, candidates) {
  const buckets = new Map();
  for (const c of candidates) {
    const k = score(guess, c);
    buckets.set(k, (buckets.get(k) || 0) + 1);
  }
  const total = candidates.length;
  let h = 0;
  for (const count of buckets.values()) {
    const p = count / total;
    h -= p * Math.log2(p);
  }
  return { bits: h, buckets: buckets.size };
}

// Rank possible next guesses by expected information. To stay fast in the
// browser, the guess pool is trimmed to the strongest letter-frequency picks
// when the search space is large. Candidates get a small bonus because they
// can win outright.
export function bestGuesses(candidates, guessPool, { limit = 10, maxPool = 400 } = {}) {
  if (candidates.length === 0) return [];
  if (candidates.length <= 2) {
    return candidates.map((w) => ({ word: w, bits: candidates.length === 1 ? 0 : 1, buckets: candidates.length, isCandidate: true }));
  }
  const candidateSet = new Set(candidates);
  const stats = letterStats(candidates);
  let pool = Array.from(new Set([...candidates, ...guessPool]));
  if (pool.length > maxPool) {
    pool = pool
      .map((w) => ({ w, s: frequencyScore(w, stats) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, maxPool)
      .map((x) => x.w);
    // Always consider the candidates themselves when there are few of them.
    if (candidates.length <= maxPool) {
      for (const c of candidates) if (!pool.includes(c)) pool.push(c);
    }
  }
  const winBonus = 1 / candidates.length;
  return pool
    .map((w) => {
      const e = entropy(w, candidates);
      const isCandidate = candidateSet.has(w);
      return { word: w, bits: e.bits, buckets: e.buckets, isCandidate, rank: e.bits + (isCandidate ? winBonus : 0) };
    })
    .sort((a, b) => b.rank - a.rank || (a.word < b.word ? -1 : 1))
    .slice(0, limit);
}

// Pattern search used by the word finder and word list pages.
//   pattern:  string like "c?a?e" ("?", "_", "." or "*" = any letter)
//   starts / ends / contains: plain strings
//   includes: letters that must appear somewhere
//   excludes: letters that must not appear
export function matchWords(words, { pattern = "", starts = "", ends = "", contains = "", includes = "", excludes = "" } = {}) {
  const clean = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
  starts = clean(starts);
  ends = clean(ends);
  contains = clean(contains);
  const inc = Array.from(clean(includes));
  const exc = new Set(Array.from(clean(excludes)).filter((c) => !inc.includes(c)));
  const pat = (pattern || "").toLowerCase().replace(/[_.*\s-]/g, "?").replace(/[^a-z?]/g, "");
  return words.filter((w) => {
    if (pat && pat.replace(/\?+$/, "").length > 0) {
      if (pat.length !== w.length) return false;
      for (let i = 0; i < pat.length; i++) if (pat[i] !== "?" && pat[i] !== w[i]) return false;
    }
    if (starts && !w.startsWith(starts)) return false;
    if (ends && !w.endsWith(ends)) return false;
    if (contains && !w.includes(contains)) return false;
    for (const c of inc) if (!w.includes(c)) return false;
    for (const c of exc) if (w.includes(c)) return false;
    return true;
  });
}

// Words that can be spelled from the given letters. "?" is a blank tile.
// When `exact` is true every letter must be used.
export function unscramble(words, letters, { exact = false } = {}) {
  const pool = new Int8Array(26);
  let blanks = 0;
  let total = 0;
  for (const ch of (letters || "").toLowerCase()) {
    if (ch === "?" || ch === "*" || ch === "_") {
      blanks++;
      total++;
    } else if (ch >= "a" && ch <= "z") {
      pool[ch.charCodeAt(0) - A]++;
      total++;
    }
  }
  return words.filter((w) => {
    if (w.length > total || (exact && w.length !== total)) return false;
    const left = pool.slice();
    let free = blanks;
    for (let i = 0; i < w.length; i++) {
      const c = w.charCodeAt(i) - A;
      if (left[c] > 0) left[c]--;
      else if (free > 0) free--;
      else return false;
    }
    return true;
  });
}
