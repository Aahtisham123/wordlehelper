"use client";

import { Alert } from "../Alert";
import { Icon } from "../Icon";

export const COLORS = ["gray", "yellow", "green"] as const;

export function Legend() {
  return (
    <p className="legend">
      <span><i style={{ background: "var(--tile-gray)" }} /> Gray: not in the word</span>
      <span><i style={{ background: "var(--tile-yellow)" }} /> Yellow: in the word, wrong spot</span>
      <span><i style={{ background: "var(--tile-green)" }} /> Green: right letter, right spot</span>
    </p>
  );
}

export function LoadingWords() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="loading-line">
        <span className="spinner" /> Loading the word list…
      </p>
      <div className="skeleton-grid" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </div>
  );
}

export function LoadError({ retry }: { retry: () => void }) {
  return (
    <Alert type="error" title="We couldn't load the word list">
      <p>Check your internet connection, then try again.</p>
      <button type="button" className="btn btn-sm" onClick={retry}>
        <Icon name="RotateCcw" size={16} /> Try again
      </button>
    </Alert>
  );
}

export function WordButtons({ words, onPick, limit }: { words: string[]; onPick?: (w: string) => void; limit?: number }) {
  return (
    <ul className="word-grid">
      {(limit ? words.slice(0, limit) : words).map((w) => (
        <li key={w}>
          {onPick ? (
            <button type="button" onClick={() => onPick(w)} title={`Use ${w.toUpperCase()} as your next guess`}>
              {w}
            </button>
          ) : (
            <span>{w}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function storageGet<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
