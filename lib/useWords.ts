"use client";

import { useEffect, useState } from "react";

const cache: Record<string, Promise<string[]>> = {};

export function loadWords(length: number, kind: "answers" | "valid"): Promise<string[]> {
  const key = `${length}-${kind}`;
  cache[key] ??= fetch(`/words/${key}.txt`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then((t) => t.trim().split("\n"))
    .catch((e) => {
      delete cache[key];
      throw e;
    });
  return cache[key];
}

type State = { answers: string[]; valid: string[]; validSet: Set<string>; status: "loading" | "ready" | "error"; retry: () => void };

/** Loads the likely-answer and valid-guess lists for a word length. */
export function useWords(length: number): State {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<State, "retry">>({ answers: [], valid: [], validSet: new Set(), status: "loading" });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: "loading" }));
    Promise.all([loadWords(length, "answers"), loadWords(length, "valid")])
      .then(([answers, valid]) => live && setState({ answers, valid, validSet: new Set(valid), status: "ready" }))
      .catch(() => live && setState((s) => ({ ...s, status: "error" })));
    return () => {
      live = false;
    };
  }, [length, attempt]);
  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
