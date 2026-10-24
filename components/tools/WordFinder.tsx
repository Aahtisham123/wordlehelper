"use client";

import { useMemo, useRef, useState } from "react";
import { matchWords, rankByFrequency } from "@/lib/engine.mjs";
import { useWords } from "@/lib/useWords";
import { Alert } from "../Alert";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";
import { useToast } from "../Toast";
import { LoadError, LoadingWords, WordButtons } from "./shared";

const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const uniq = (s: string) => Array.from(new Set(clean(s))).join("");

/**
 * Method 2 — Letter Clues. Fill in green letters by position plus the
 * yellow and gray letters you know. The full variant adds starts/ends/
 * contains and word length (the 5 Letter Word Finder page).
 */
export function WordFinder({ variant = "clues" }: { variant?: "clues" | "full" }) {
  const toast = useToast();
  const [length, setLength] = useState(5);
  const words = useWords(length);
  const [greens, setGreens] = useState<string[]>(Array(5).fill(""));
  const [yellow, setYellow] = useState("");
  const [gray, setGray] = useState("");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [contains, setContains] = useState("");
  const [rare, setRare] = useState(false);
  const [limit, setLimit] = useState(200);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const known = greens.join("") + clean(yellow);
  const conflicts = Array.from(new Set(clean(gray))).filter((c) => known.includes(c));
  const grayLetters = Array.from(new Set(clean(gray))).filter((c) => !known.includes(c)).join("");
  const tooManyYellow = uniq(yellow).length + greens.filter(Boolean).length > length + 2;

  const pool = rare ? words.valid : words.answers;
  const found = useMemo(() => {
    if (!pool.length) return [];
    const pattern = greens.slice(0, length).map((g) => g || "?").join("");
    const list = matchWords(pool, { pattern, includes: yellow, excludes: grayLetters, starts, ends, contains }) as string[];
    return (rankByFrequency(list) as { word: string }[]).map((x) => x.word);
  }, [pool, greens, length, yellow, grayLetters, starts, ends, contains]);

  const touched = Boolean(greens.some(Boolean) || yellow || gray || starts || ends || contains);

  function setGreen(i: number, v: string) {
    const ch = clean(v).slice(-1);
    setGreens((g) => g.map((x, j) => (j === i ? ch : x)));
    if (ch) boxes.current[i + 1]?.focus();
  }

  function reset() {
    setGreens(Array(length).fill(""));
    setYellow("");
    setGray("");
    setStarts("");
    setEnds("");
    setContains("");
    setLimit(200);
    toast({ type: "info", title: "All clues cleared" });
    boxes.current[0]?.focus();
  }

  return (
    <div className="finder">
      <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
        {variant === "full" && (
          <div className="field" style={{ maxWidth: 220, marginBottom: 14 }}>
            <label htmlFor="wf-length">Word length</label>
            <select
              id="wf-length"
              value={length}
              onChange={(e) => {
                const n = Number(e.target.value);
                setLength(n);
                setGreens((g) => Array.from({ length: n }, (_, i) => g[i] ?? ""));
              }}
            >
              {[3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} letters
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <span className="field-label" id="green-label">
            <i style={{ background: "var(--tile-green)" }} /> Green letters <small>(letters you know the exact spot of)</small>
          </span>
          <div className="pattern" role="group" aria-labelledby="green-label">
            {Array.from({ length }, (_, i) => (
              <input
                key={i}
                ref={(el) => {
                  boxes.current[i] = el;
                }}
                value={greens[i] ?? ""}
                onChange={(e) => setGreen(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !greens[i]) boxes.current[i - 1]?.focus();
                }}
                maxLength={2}
                placeholder=" "
                aria-label={`Letter ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="fields" style={{ marginTop: 14 }}>
          <div className="field field-yellow">
            <label htmlFor={`wf-yellow-${variant}`} className="field-label">
              <i style={{ background: "var(--tile-yellow)" }} /> Yellow letters
            </label>
            <input id={`wf-yellow-${variant}`} className="upper" value={yellow} onChange={(e) => setYellow(e.target.value.replace(/[^a-z]/gi, ""))} placeholder="e.g. AR" />
            <small>In the word, but you don&apos;t know where.</small>
          </div>
          <div className="field field-gray">
            <label htmlFor={`wf-gray-${variant}`} className="field-label">
              <i style={{ background: "var(--tile-gray)" }} /> Gray letters
            </label>
            <input id={`wf-gray-${variant}`} className="upper" value={gray} onChange={(e) => setGray(e.target.value.replace(/[^a-z]/gi, ""))} placeholder="e.g. TINS" />
            <small>Letters that are not in the word.</small>
          </div>
          {variant === "full" && (
            <>
              <div className="field">
                <label htmlFor="wf-starts">Starts with</label>
                <input id="wf-starts" className="upper" value={starts} onChange={(e) => setStarts(clean(e.target.value))} placeholder="e.g. ST" />
              </div>
              <div className="field">
                <label htmlFor="wf-ends">Ends with</label>
                <input id="wf-ends" className="upper" value={ends} onChange={(e) => setEnds(clean(e.target.value))} placeholder="e.g. ER" />
              </div>
              <div className="field">
                <label htmlFor="wf-contains">Contains these letters together</label>
                <input id="wf-contains" className="upper" value={contains} onChange={(e) => setContains(clean(e.target.value))} placeholder="e.g. CH" />
              </div>
            </>
          )}
        </div>
        <div className="solver-bar" style={{ marginTop: 12 }}>
          <label className="check">
            <input type="checkbox" checked={rare} onChange={(e) => setRare(e.target.checked)} /> Include rare words
          </label>
          {touched && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              <Icon name="RotateCcw" size={16} /> Clear clues
            </button>
          )}
        </div>
      </form>

      {conflicts.length > 0 && (
        <Alert type="info" title={`We ignored ${conflicts.map((c) => c.toUpperCase()).join(", ")} in your gray letters`}>
          You also marked {conflicts.length === 1 ? "it" : "them"} green or yellow. Wordle shows a gray tile when you guess a letter twice but the answer has it only once, so the letter
          is still in the word.
        </Alert>
      )}
      {tooManyYellow && <Alert type="warning">That&apos;s more letters than fit in a {length}-letter word. Double-check your yellow letters.</Alert>}

      <div className="results" aria-live="polite">
        {words.status === "loading" && <LoadingWords />}
        {words.status === "error" && <LoadError retry={words.retry} />}
        {words.status === "ready" && found.length === 0 && (
          <Alert type="error" title="No words match these clues">
            <p>Try removing a letter or two, check for typos{rare ? "" : ", or tick “Include rare words”"}.</p>
          </Alert>
        )}
        {words.status === "ready" && found.length > 0 && (
          <>
            <p className="count">
              <b>{found.length.toLocaleString()}</b>
              <span>
                {length}-letter {found.length === 1 ? "word fits" : "words fit"} {touched ? "your clues" : "— add a clue to narrow it down"}
              </span>
            </p>
            {touched && found.length === 1 && (
              <Alert type="success" title={`Only one word fits: ${found[0].toUpperCase()}`}>
                That&apos;s almost certainly your answer.
              </Alert>
            )}
            <div className="list-toolbar">
              <span className="small muted">Most likely answers first</span>
              <CopyButton text={() => found.map((w) => w.toUpperCase()).join(", ")} label="Copy list" what="Word list" />
            </div>
            <WordButtons words={found} limit={limit} />
            {found.length > limit && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLimit(found.length)}>
                Show all {found.length.toLocaleString()} words
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
