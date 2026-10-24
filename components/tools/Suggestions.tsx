"use client";

import { useEffect, useState } from "react";
import { bestGuesses } from "@/lib/engine.mjs";
import { Icon } from "../Icon";

type Guess = { word: string; bits: number; buckets: number; isCandidate: boolean };

/** Ranks next guesses by expected information, off the main render path. */
export function useBestGuesses(candidates: string[], pool: string[], limit: number, maxPool: number) {
  const [result, setResult] = useState<Guess[] | null>(null);
  useEffect(() => {
    setResult(null);
    if (candidates.length < 2 || !pool.length) return;
    const t = setTimeout(() => setResult(bestGuesses(candidates, pool, { limit, maxPool }) as Guess[]), 30);
    return () => clearTimeout(t);
  }, [candidates, pool, limit, maxPool]);
  return result;
}

export function Suggestions({ candidates, pool, limit = 5, maxPool = 300, title, onPick }: { candidates: string[]; pool: string[]; limit?: number; maxPool?: number; title: string; onPick: (w: string) => void }) {
  const top = useBestGuesses(candidates, pool, limit, maxPool);
  if (candidates.length < 2) return null;
  return (
    <div className="suggest">
      <h3>
        <Icon name="Sparkles" size={18} /> {title}
      </h3>
      {!top ? (
        <p className="loading-line small">
          <span className="spinner" /> Working out the smartest guesses…
        </p>
      ) : (
        <ol>
          {top.map((g, i) => (
            <li key={g.word} onClick={() => onPick(g.word)} title={`Use ${g.word.toUpperCase()}`}>
              <span className="rank">{i + 1}</span>
              <span className="w">{g.word.toUpperCase()}</span>
              {g.isCandidate ? <span className="pill">could be the answer</span> : <span className="pill amber">helper word</span>}
              <span className="meta">
                {g.bits.toFixed(2)} bits · {g.buckets} groups · about {Math.max(1, Math.round(candidates.length / Math.pow(2, g.bits)))} left after
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
