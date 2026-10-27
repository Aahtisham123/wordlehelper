"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";

type Entry = { p: string; t: string; d: string; s: string; k: string };

const SECTION: Record<string, string> = {
  home: "Tool", daily: "Daily", solvers: "Solver", words: "Word tool", lists: "Word list", guides: "Guide", blog: "Blog", site: "Info",
};

let indexPromise: Promise<Entry[]> | null = null;
const loadIndex = () => (indexPromise ??= fetch("/search-index.json").then((r) => (r.ok ? r.json() : [])).catch(() => []));

function rank(entries: Entry[], q: string): Entry[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return entries
    .map((e) => {
      const t = e.t.toLowerCase(), k = e.k.toLowerCase(), d = e.d.toLowerCase();
      let score = 0;
      for (const term of terms) {
        const s = (t.includes(term) ? 6 : 0) + (k.includes(term) ? 3 : 0) + (d.includes(term) ? 1 : 0);
        if (!s) return { e, score: 0 };
        score += s + (t.startsWith(term) ? 2 : 0);
      }
      // The 76 letter lists match many queries; keep them below the main pages.
      return { e, score: score - (e.s === "lists" ? 8 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.e);
}

export function openSearch() {
  window.dispatchEvent(new Event("wh:search"));
}

export function SearchButton({ compact = false }: { compact?: boolean }) {
  return (
    <button type="button" className={compact ? "icon-btn" : "search-trigger"} onClick={openSearch} aria-label="Search the site">
      <Icon name="Search" size={compact ? 20 : 18} />
      {!compact && (
        <>
          <span>Search tools &amp; guides</span>
          <kbd>/</kbd>
        </>
      )}
    </button>
  );
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("wh:search", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wh:search", show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    loadIndex().then(setEntries);
    setTimeout(() => input.current?.focus(), 10);
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  const results = useMemo(() => (entries ? rank(entries, q) : []), [entries, q]);
  const word = /^[a-z]{3,7}$/i.test(q.trim()) ? q.trim().toLowerCase() : null;
  const items = [...results.map((r) => ({ href: r.p, title: r.t, sub: r.d, tag: SECTION[r.s] ?? "Page" })), ...(word ? [{ href: `/wordle-dictionary/?word=${word}`, title: `Is “${word.toUpperCase()}” a valid Wordle word?`, sub: "Check it in the Wordle dictionary", tag: "Word" }] : [])];

  function close(restoreFocus = true) {
    setOpen(false);
    setQ("");
    setActive(0);
    if (restoreFocus) lastFocus.current?.focus?.();
  }
  function go(href: string) {
    // Don't refocus the trigger button: the same Enter press would reopen search.
    close(false);
    router.push(href);
    setTimeout(() => document.getElementById("main")?.focus({ preventScroll: true }), 50);
  }

  if (!open) return null;
  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search the site">
        <div className="search-input">
          <Icon name="Search" size={20} />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, items.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter" && items[active]) {
                e.preventDefault();
                go(items[active].href);
              }
            }}
            placeholder="Search tools, guides, word lists…"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={items[active] ? `sr-${active}` : undefined}
          />
          <button type="button" className="icon-btn" onClick={() => close()} aria-label="Close search">
            <Icon name="X" size={18} />
          </button>
        </div>
        <ul id="search-results" className="search-results" role="listbox">
          {!entries && q && (
            <li className="search-empty">
              <span className="spinner" /> Loading…
            </li>
          )}
          {entries && q && items.length === 0 && <li className="search-empty">No results for “{q}”. Try “solver”, “hint” or “starting words”.</li>}
          {!q && (
            <li className="search-empty">
              Popular: <button className="chip" onClick={() => setQ("hint")}>hint</button> <button className="chip" onClick={() => setQ("solver")}>solver</button>{" "}
              <button className="chip" onClick={() => setQ("starting words")}>starting words</button> <button className="chip" onClick={() => setQ("words ending")}>words ending</button>
            </li>
          )}
          {items.map((it, i) => (
            <li key={it.href} id={`sr-${i}`} role="option" aria-selected={i === active}>
              <a
                href={it.href}
                className={i === active ? "active" : ""}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(it.href);
                }}
              >
                <span className="search-tag">{it.tag}</span>
                <strong>{it.title}</strong>
                <span className="search-sub">{it.sub}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="search-hint">
          <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
