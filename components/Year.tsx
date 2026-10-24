"use client";

import { useEffect, useState } from "react";

/** Copyright year: the build year in HTML, refreshed to the visitor's current year. */
export function Year({ fallback }: { fallback: number }) {
  const [year, setYear] = useState(fallback);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
