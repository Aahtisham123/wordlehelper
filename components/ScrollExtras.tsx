"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Reading progress bar across the top plus a back-to-top button. */
export function ScrollExtras() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max > 0 ? el.scrollTop / max : 0);
        setShowTop(el.scrollTop > 700);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <button
        type="button"
        className={`back-to-top${showTop ? " show" : ""}`}
        onClick={() => {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          document.getElementById("main")?.focus({ preventScroll: true });
        }}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <Icon name="ArrowUp" size={20} />
      </button>
    </>
  );
}
