"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "../Alert";

/** Wordle resets at local midnight; warn visitors on a different puzzle. */
export function DailyNotice({ number }: { number: number }) {
  const [current, setCurrent] = useState<number | null>(null);
  useEffect(() => {
    const now = new Date();
    const local = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    setCurrent(Math.round((local - Date.UTC(2021, 5, 19)) / 86400000));
  }, []);
  if (current === null || current === number) return null;
  if (current > number)
    return (
      <Alert type="info" title={`Wordle #${current} is already out where you are`}>
        Hints for it are on the way. The hints below are for #{number}.
      </Alert>
    );
  return (
    <Alert type="warning" title={`Heads up: these hints are for Wordle #${number}`}>
      That puzzle reaches your time zone at midnight. Your current puzzle is #{current}; its answer is in the <Link href="/wordle-answers/">answers archive</Link>.
    </Alert>
  );
}
