"use client";

import { useState } from "react";
import { rankByFrequency, unscramble } from "@/lib/engine.mjs";
import { loadWords } from "@/lib/useWords";
import { Alert } from "../Alert";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";
import { WordButtons } from "./shared";

type Group = { n: number; words: string[] };

export function Unscrambler() {
  const [letters, setLetters] = useState("");
  const [rare, setRare] = useState(false);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(value = letters, useRare = rare) {
    const clean = value.toLowerCase().replace(/[^a-z?]/g, "");
    setGroups(null);
    if (clean.length < 3) {
      setError("Enter at least 3 letters. Use ? for a blank tile.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const lengths = [7, 6, 5, 4, 3].filter((n) => n <= clean.length);
      const lists = await Promise.all(lengths.map((n) => loadWords(n, useRare ? "valid" : "answers")));
      setGroups(
        lengths
          .map((n, i) => ({ n, words: (rankByFrequency(unscramble(lists[i], clean)) as { word: string }[]).map((x) => x.word) }))
          .filter((g) => g.words.length),
      );
    } catch {
      setError("We couldn't load the word lists. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const total = groups?.reduce((a, g) => a + g.words.length, 0) ?? 0;
  return (
    <div>
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        noValidate
      >
        <input
          className="upper"
          value={letters}
          onChange={(e) => {
            setLetters(e.target.value.replace(/[^a-z?]/gi, "").slice(0, 12));
            setError("");
          }}
          placeholder="e.g. RTAEC?"
          aria-label="Your letters"
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? <span className="spinner" /> : <Icon name="Shuffle" size={18} />} Unscramble
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        <label className="check">
          <input
            type="checkbox"
            checked={rare}
            onChange={(e) => {
              setRare(e.target.checked);
              if (groups) run(letters, e.target.checked);
            }}
          />{" "}
          Include rare words
        </label>
      </p>
      {error && <Alert type="error">{error}</Alert>}
      <div aria-live="polite">
        {groups && total === 0 && (
          <Alert type="warning" title="No words found">
            Try adding a ? blank tile or ticking “Include rare words”.
          </Alert>
        )}
        {groups && total > 0 && (
          <>
            <p className="count">
              <b>{total.toLocaleString()}</b>
              <span>words you can make from {letters.toUpperCase()}</span>
            </p>
            {groups.map((g) => (
              <section key={g.n}>
                <div className="list-toolbar">
                  <h3 style={{ margin: "12px 0 0" }}>
                    {g.n}-letter words ({g.words.length})
                  </h3>
                  <CopyButton text={() => g.words.map((w) => w.toUpperCase()).join(", ")} label="Copy" what={`${g.n}-letter words`} />
                </div>
                <WordButtons words={g.words} />
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
