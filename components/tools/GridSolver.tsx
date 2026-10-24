"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { filterCandidates, rankByFrequency } from "@/lib/engine.mjs";
import { useWords } from "@/lib/useWords";
import { Alert } from "../Alert";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";
import { useToast } from "../Toast";
import { COLORS, Legend, LoadError, LoadingWords, WordButtons, storageGet, storageSet } from "./shared";
import { Suggestions } from "./Suggestions";

type Row = { word: string; marks: number[] };

/**
 * Method 1 — Guess Grid. Type each guess, tap tiles to match the game's
 * colors, and see every word that still fits.
 */
export function GridSolver({ length = 5, mode = "helper", rareByDefault = false }: { length?: number; mode?: "helper" | "guesser"; rareByDefault?: boolean }) {
  const words = useWords(length);
  const toast = useToast();
  const storeKey = `wh-grid-${length}-${mode}`;
  const maxRows = length >= 6 ? 7 : 6;
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [rare, setRare] = useState(rareByDefault);
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const announced = useRef("");

  useEffect(() => {
    const saved = storageGet<Row[]>(storeKey);
    if (saved?.every((r) => r.word?.length === length)) setRows(saved);
  }, [storeKey, length]);
  useEffect(() => storageSet(storeKey, rows), [rows, storeKey]);

  const pool = rare ? words.valid : words.answers;
  const candidates = useMemo(() => (pool.length ? (filterCandidates(pool, rows) as string[]) : []), [pool, rows]);
  const ranked = useMemo(() => (rankByFrequency(candidates) as { word: string }[]).map((x) => x.word), [candidates]);

  // Celebrate once when the board narrows to a single answer.
  useEffect(() => {
    if (words.status !== "ready" || !rows.length) return;
    const key = rows.map((r) => r.word + r.marks.join("")).join("|");
    if (candidates.length === 1 && announced.current !== key) {
      announced.current = key;
      toast({ type: "success", title: `Solved: ${candidates[0].toUpperCase()}`, message: "Only one word fits your clues." });
    }
  }, [candidates, rows, words.status, toast]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const word = input.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length !== length) {
      setError(`Please type exactly ${length} letters. “${input.toUpperCase() || "(empty)"}” has ${word.length}.`);
      inputRef.current?.focus();
      return;
    }
    setError("");
    setWarning(words.validSet.size && !words.validSet.has(word) ? `${word.toUpperCase()} isn't in our word list. Check the spelling — we added it anyway.` : "");
    const greens: Record<number, string> = {};
    rows.forEach((r) => r.marks.forEach((m, i) => m === 2 && (greens[i] = r.word[i])));
    const next = [...rows, { word, marks: Array.from(word, (c, i) => (greens[i] === c ? 2 : 0)) }].slice(-maxRows);
    setRows(next);
    setInput("");
    setShowAll(false);
  }

  function cycle(r: number, i: number) {
    setRows((all) => all.map((row, ri) => (ri === r ? { ...row, marks: row.marks.map((m, mi) => (mi === i ? (m + 1) % 3 : m)) } : row)));
  }

  function pick(w: string) {
    setInput(w.toUpperCase());
    inputRef.current?.focus();
  }

  return (
    <div className="solver" data-mode={mode}>
      <form onSubmit={add} noValidate>
        <label htmlFor={`guess-${length}-${mode}`}>Type a {length}-letter guess, then tap each tile to match your colors</label>
        <div className="entry" style={{ marginTop: 8 }}>
          <input
            ref={inputRef}
            id={`guess-${length}-${mode}`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(/[^a-z]/gi, "").slice(0, length));
              setError("");
            }}
            maxLength={length}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={"?".repeat(length)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `guess-err-${length}` : undefined}
          />
          <button type="submit" className="btn">
            <Icon name="Check" size={18} /> Add guess
          </button>
        </div>
        {error && (
          <p id={`guess-err-${length}`} className="small" style={{ color: "var(--red)", margin: "8px 0 0", display: "flex", gap: 6, alignItems: "center" }}>
            <Icon name="CircleAlert" size={16} /> {error}
          </p>
        )}
        <Legend />
      </form>

      <div className="board" data-length={length} aria-live="polite">
        {rows.map((row, r) => (
          <div className={`board-row${candidates.length === 1 && row.word === candidates[0] ? " win" : ""}`} key={r + row.word}>
            {Array.from(row.word).map((ch, i) => (
              <button
                key={i}
                type="button"
                className={`tile ${COLORS[row.marks[i]]}`}
                onClick={() => cycle(r, i)}
                aria-label={`${ch.toUpperCase()}, position ${i + 1}, ${COLORS[row.marks[i]]}. Tap to change.`}
              >
                {ch}
              </button>
            ))}
            <button type="button" className="icon-btn row-remove" onClick={() => setRows(rows.filter((_, ri) => ri !== r))} aria-label={`Remove ${row.word.toUpperCase()}`}>
              <Icon name="X" size={18} />
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="board-row" aria-hidden="true">
            {Array.from({ length }, (_, i) => (
              <span key={i} className="tile empty" />
            ))}
          </div>
        )}
      </div>
      {warning && <Alert type="warning">{warning}</Alert>}

      <div className="solver-bar">
        <label className="check">
          <input type="checkbox" checked={rare} onChange={(e) => setRare(e.target.checked)} /> Include rare words
        </label>
        {rows.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setRows([]);
              setWarning("");
              toast({ type: "info", title: "Board cleared", message: "Start fresh with a new guess." });
              inputRef.current?.focus();
            }}
          >
            <Icon name="RotateCcw" size={16} /> Clear board
          </button>
        )}
      </div>

      <div className="results">
        {words.status === "loading" && <LoadingWords />}
        {words.status === "error" && <LoadError retry={words.retry} />}
        {words.status === "ready" && candidates.length === 0 && (
          <Alert type="error" title="No words match these colors">
            <p>One tile is probably set to the wrong color — tap it to fix it.{!rare && " You can also tick “Include rare words”."}</p>
          </Alert>
        )}
        {words.status === "ready" && candidates.length > 0 && (
          <>
            <p className="count">
              <b>{candidates.length.toLocaleString()}</b>
              {candidates.length === 1 ? (
                <span>
                  word left — the answer is <strong>{candidates[0].toUpperCase()}</strong>!
                </span>
              ) : (
                <span>possible words {rows.length ? "left" : "to start with"}</span>
              )}
            </p>
            {candidates.length === 1 && <Alert type="success" title="You've cracked it!">Type {candidates[0].toUpperCase()} into your game to finish the puzzle.</Alert>}
            <Suggestions
              candidates={candidates}
              pool={words.valid}
              limit={mode === "guesser" ? 10 : 5}
              maxPool={mode === "guesser" ? 600 : 300}
              title={mode === "guesser" ? "Best next guesses, ranked by information" : "Suggested next guess"}
              onPick={pick}
            />
            <div className="list-toolbar">
              <h3 style={{ margin: 0 }}>{candidates.length > 1 ? "Possible answers, most likely first" : "The answer"}</h3>
              <CopyButton text={() => ranked.map((w) => w.toUpperCase()).join(", ")} label="Copy list" what="Word list" />
            </div>
            <WordButtons words={ranked} onPick={pick} limit={showAll ? undefined : 120} />
            {ranked.length > 120 && !showAll && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAll(true)}>
                Show all {ranked.length.toLocaleString()} words
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
