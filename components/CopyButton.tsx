"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

export function CopyButton({ text, label = "Copy", what = "Text", className = "" }: { text: string | (() => string); label?: string; what?: string; className?: string }) {
  const toast = useToast();
  const [done, setDone] = useState(false);
  async function copy() {
    const value = typeof text === "function" ? text() : text;
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
      toast({ type: "success", title: `${what} copied`, message: "Paste it anywhere you like." });
    } catch {
      toast({ type: "error", title: "Couldn't copy", message: "Your browser blocked the clipboard. Select the text and copy it by hand." });
    }
  }
  return (
    <button type="button" className={`btn btn-ghost btn-sm ${className}`} onClick={copy}>
      <Icon name={done ? "Check" : "Copy"} size={16} />
      {done ? "Copied" : label}
    </button>
  );
}
