"use client";

import { useEffect, useMemo, useState } from "react";
import { filterCandidates } from "@/lib/engine.mjs";
import { useWords } from "@/lib/useWords";
import { Alert } from "../Alert";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";
import { useToast } from "../Toast";
import { COLORS, LoadError, LoadingWords } from "./shared";
import { useBestGuesses } from "./Suggestions";

type Row = { word: string; marks: number[] };

/**
 * Method 3 — Guided Solve. The helper picks every guess; the player types it
 * into the game and reports the colors back.
 */
export function GuidedSolver({ opener }: { opener: string }) {
  const words = useWords(5);
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [marks, setMarks] = useState<number[]>([0, 0, 0, 0, 0]);
  const [override, setOverride] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [customError, setCustomError] = useState("");
  const [won, setWon] = useState(false);

  const candidates = useMemo(() => (words.answers.length ? (filterCandidates(words.answers, rows) as string[]) : []), [words.answers, rows]);
  const fallback = useMemo(() => (words.valid.length && candidates.length === 0 && rows.length ? (filterCandidates(words.valid, rows) as string[]) : []), [words.valid, candidates.length, rows]);
  const live = candidates.length ? candidates : fallback;
  const best = useBestGuesses(rows.length ? live : [], words.valid, 1, 300);
  const suggestion = override ?? (rows.length === 0 ? opener : live.length === 1 ? live[0] : best?.[0]?.word ?? null);

  useEffect(() => setMarks([0, 0, 0, 0, 0]), [suggestion]);

  function submit() {
    if (!suggestion) return;
    const row = { word: suggestion, marks };
    if (marks.every((m) => m === 2)) {
      setRows([...rows, row]);
      setWon(true);
      toast({ type: "success", title: `Solved in ${rows.length + 1} ${rows.length ? "guesses" : "guess"}!`, message: `The answer was ${suggestion.toUpperCase()}.` });
      return;
    }
    setRows([...rows, row]);
    setOverride(null);
  }

  function applyCustom(e: React.FormEvent) {
    e.preventDefault();
    const w = custom.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length !== 5) {
      setCustomError("Please type a 5-letter word.");
      return;
    }
    if (!words.validSet.has(w)) {
      setCustomError(`${w.toUpperCase()} isn't in our word list. Check the spelling.`);
      return;
    }
    setCustomError("");
    setOverride(w);
    setCustom("");
    toast({ type: "info", title: `Now using ${w.toUpperCase()}`, message: "Set its tile colors from your game." });
  }

  function restart() {
    setRows([]);
    setOverride(null);
    setWon(false);
  }

  if (words.status === "loading") return <LoadingWords />;
  if (words.status === "error") return <LoadError retry={words.retry} />;

  const turn = rows.length + 1;
  const stuck = rows.length > 0 && live.length === 0;

  return (
    <div className="guided">
      <div className="guided-step">
        <div className="progress-dots" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className={i < rows.length ? "done" : i === rows.length && !won ? "now" : ""} />
          ))}
        </div>
        <span>{won ? `Solved in ${rows.length}` : turn <= 6 ? `Guess ${turn} of 6` : `Extra guess ${turn}`}</span>
        {rows.length > 0 && !won && (
          <span>
            · <strong>{live.length.toLocaleString()}</strong> {live.length === 1 ? "word" : "words"} still possible
          </span>
        )}
      </div>

      {rows.length > 0 && (
        <div className="board" data-length={5}>
          {rows.map((r, ri) => (
            <div className={`board-row${won && ri === rows.length - 1 ? " win" : ""}`} key={ri}>
              {Array.from(r.word).map((ch, i) => (
                <span key={i} className={`tile ${COLORS[r.marks[i]]}`} style={{ cursor: "default" }}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {won ? (
        <div className="win-box">
          <Icon name="PartyPopper" size={36} />
          <h3>Nice work — you solved it!</h3>
          <p>
            The answer was <strong>{rows[rows.length - 1].word.toUpperCase()}</strong>, found in {rows.length} {rows.length === 1 ? "guess" : "guesses"}.
          </p>
          <button type="button" className="btn" onClick={restart}>
            <Icon name="RotateCcw" size={18} /> Solve another puzzle
          </button>
        </div>
      ) : stuck ? (
        <Alert type="error" title="No word fits those colors">
          <p>A tile was probably set to the wrong color. Undo the last guess and check it against your game.</p>
          <button type="button" className="btn btn-sm" onClick={() => setRows(rows.slice(0, -1))}>
            <Icon name="RotateCcw" size={16} /> Undo last guess
          </button>
        </Alert>
      ) : !suggestion ? (
        <p className="loading-line">
          <span className="spinner" /> Picking the smartest next guess…
        </p>
      ) : (
        <>
          <Alert type="tip" title={rows.length === 0 ? "Step 1: type this word into your game" : live.length === 1 ? "This must be the answer" : "Next, type this word into your game"}>
            {rows.length === 0
              ? `${opener.toUpperCase()} is our best-tested opener. It reveals more about the answer than any other first word.`
              : live.length === 1
                ? "Only one word fits all your clues."
                : candidates.length === 0
                  ? "No common word fits, so we're searching rare words too."
                  : "We chose the guess that rules out the most words, based on your colors so far."}
          </Alert>
          <p className="small muted" style={{ margin: "4px 0 6px" }}>
            Then tap each tile below until it matches the color your game showed:
          </p>
          <div className="board" data-length={5}>
            <div className="board-row" key={suggestion}>
              {Array.from(suggestion).map((ch, i) => (
                <button
                  key={i}
                  type="button"
                  className={`tile ${COLORS[marks[i]]}`}
                  onClick={() => setMarks((m) => m.map((x, j) => (j === i ? (x + 1) % 3 : x)))}
                  aria-label={`${ch.toUpperCase()}, position ${i + 1}, ${COLORS[marks[i]]}. Tap to change.`}
                >
                  {ch}
                </button>
              ))}
              <CopyButton text={suggestion.toUpperCase()} label="Copy" what="Word" />
            </div>
          </div>
          <div className="inline-form" style={{ marginTop: 10 }}>
            <button type="button" className="btn" onClick={submit}>
              <Icon name="Check" size={18} /> These are my colors
            </button>
            {rows.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setRows(rows.slice(0, -1))}>
                <Icon name="RotateCcw" size={16} /> Undo
              </button>
            )}
          </div>
          <details className="small" style={{ marginTop: 14 }}>
            <summary style={{ cursor: "pointer", fontWeight: 650 }}>I played a different word</summary>
            <form className="inline-form" onSubmit={applyCustom} style={{ marginTop: 10 }}>
              <input
                className="upper"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value.replace(/[^a-z]/gi, "").slice(0, 5));
                  setCustomError("");
                }}
                placeholder="Your word"
                aria-label="The word you played"
                aria-invalid={customError ? true : undefined}
              />
              <button type="submit" className="btn btn-ghost">
                Use this word
              </button>
            </form>
            {customError && (
              <p className="small" style={{ color: "var(--red)", display: "flex", gap: 6, alignItems: "center", margin: "6px 0 0" }}>
                <Icon name="CircleAlert" size={16} /> {customError}
              </p>
            )}
          </details>
        </>
      )}
    </div>
  );
}
