export const SITE = {
  name: "Wordle Helper",
  domain: "wordlehelp.co",
  url: "https://wordlehelp.co",
  email: "hello@wordlehelp.co",
  // Wordle #0 was published on 19 June 2021.
  epoch: "2021-06-19",
  // When the site content was last reviewed. Pages can override it.
  updated: "2026-10-24",
  themeColor: "#14806a",
  // Social profiles for Organization schema. Add real URLs when they exist.
  sameAs: [],
};

export function puzzleNumber(isoDate) {
  const ms = Date.parse(isoDate + "T00:00:00Z") - Date.parse(SITE.epoch + "T00:00:00Z");
  return Math.round(ms / 86400000);
}

export function formatDate(isoDate) {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(isoDate) {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
