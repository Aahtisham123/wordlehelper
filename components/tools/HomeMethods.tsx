"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { GridSolver } from "./GridSolver";
import { GuidedSolver } from "./GuidedSolver";
import { WordFinder } from "./WordFinder";

const METHODS = [
  { id: "grid", label: "Guess Grid", sub: "Enter guesses & colors", icon: "Grid3x3" },
  { id: "clues", label: "Letter Clues", sub: "Type the letters you know", icon: "TextSearch" },
  { id: "guided", label: "Guided Solve", sub: "Let the helper pick", icon: "Route" },
] as const;

type Id = (typeof METHODS)[number]["id"];

/** The three ways to solve on the homepage, as an accessible tab set. */
export function HomeMethods({ opener }: { opener: string }) {
  const [active, setActive] = useState<Id>("grid");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (METHODS.some((m) => m.id === fromHash)) setActive(fromHash as Id);
  }, []);

  function select(id: Id, focus = false) {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    if (focus) tabs.current[METHODS.findIndex((m) => m.id === id)]?.focus();
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    const n = METHODS.length;
    if (e.key === "ArrowRight") select(METHODS[(i + 1) % n].id, true);
    if (e.key === "ArrowLeft") select(METHODS[(i - 1 + n) % n].id, true);
  }

  return (
    <div className="methods">
      <div className="tabs" role="tablist" aria-label="Choose how to solve">
        {METHODS.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`tab-${m.id}`}
            role="tab"
            type="button"
            className="tab"
            aria-selected={active === m.id}
            aria-controls={`panel-${m.id}`}
            tabIndex={active === m.id ? 0 : -1}
            onClick={() => select(m.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <Icon name={m.icon} size={20} />
            <span className="tab-text">
              {m.label}
              <small>{m.sub}</small>
            </span>
          </button>
        ))}
      </div>
      {METHODS.map((m) => (
        <div key={m.id} id={`panel-${m.id}`} role="tabpanel" aria-labelledby={`tab-${m.id}`} hidden={active !== m.id} className="tab-panel">
          {active === m.id && (m.id === "grid" ? <GridSolver /> : m.id === "clues" ? <WordFinder variant="clues" /> : <GuidedSolver opener={opener} />)}
        </div>
      ))}
    </div>
  );
}
