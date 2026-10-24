"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadWords } from "@/lib/useWords";
import { Alert } from "../Alert";
import { Icon } from "../Icon";

type Verdict = { word: string; kind: "yes" | "maybe" | "no"; used: [string, number, string][] } | null;

let pastPromise: Promise<[string, number, string][]> | null = null;
const loadPast = () => (pastPromise ??= fetch("/words/past-answers.json").then((r) => (r.ok ? r.json() : [])).catch(() => []));

export function Dictionary() {
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function check(raw: string) {
    const word = raw.toLowerCase().replace(/[^a-z]/g, "");
    setVerdict(null);
    if (!word) {
      setError("Type a word to check.");
      inputRef.current?.focus();
      return;
    }
    if (word.length < 3 || word.length > 7) {
      setError(`${word.toUpperCase()} has ${word.length} letters. Our dictionary covers words with 3 to 7 letters.`);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const [answers, valid, past] = await Promise.all([loadWords(word.length, "answers"), loadWords(word.length, "valid"), loadPast()]);
      setVerdict({
        word,
        kind: answers.includes(word) ? "yes" : valid.includes(word) ? "maybe" : "no",
        used: past.filter((p: [string, number, string]) => p[0] === word),
      });
    } catch {
      setError("We couldn't load the dictionary. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const w = new URLSearchParams(window.location.search).get("word");
    if (w) {
      setValue(w.toUpperCase());
      check(w);
    }
  }, []);

  const W = verdict?.word.toUpperCase();
  const five = verdict?.word.length === 5;
  return (
    <div>
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          check(value);
        }}
        noValidate
      >
        <input
          ref={inputRef}
          className="upper"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/[^a-z]/gi, "").slice(0, 7));
            setError("");
          }}
          placeholder="Type a word"
          aria-label="Word to check"
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? <span className="spinner" /> : <Icon name="SpellCheck" size={18} />} Check word
        </button>
      </form>
      {error && <Alert type="error">{error}</Alert>}
      <div aria-live="polite">
        {verdict && (
          <div className={`verdict ${verdict.kind}`}>
            <span className="v-icon">
              <Icon name={verdict.kind === "yes" ? "Check" : verdict.kind === "maybe" ? "TriangleAlert" : "X"} size={24} />
            </span>
            <div>
              {verdict.kind === "yes" && (
                <>
                  <strong>Yes, {W} is a valid word.</strong>
                  <p>It&apos;s a common word, so it could easily be a {five ? "Wordle" : `${verdict.word.length}-letter puzzle`} answer.</p>
                </>
              )}
              {verdict.kind === "maybe" && (
                <>
                  <strong>{W} is valid, but rare.</strong>
                  <p>Most word games accept it as a guess, but it&apos;s unlikely to be the answer.</p>
                </>
              )}
              {verdict.kind === "no" && (
                <>
                  <strong>{W} isn&apos;t in our word list.</strong>
                  <p>Check the spelling. Names, short forms and slang usually aren&apos;t allowed.</p>
                </>
              )}
              {verdict.used.length > 0 && (
                <p>
                  <Icon name="Archive" size={15} /> {W} was already the answer to Wordle {verdict.used.map((u) => `#${u[1]} (${u[2]})`).join(", ")}. See all{" "}
                  <Link href="/wordle-answers/">past answers</Link>.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
