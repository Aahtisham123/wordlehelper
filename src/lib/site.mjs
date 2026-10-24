export const SITE = {
  name: "Wordle Helper",
  domain: "wordlehelp.co",
  url: "https://wordlehelp.co",
  email: "hello@wordlehelp.co",
  // Wordle #0 was published on 19 June 2021.
  epoch: "2021-06-19",
};

export const NAV = [
  { href: "/", label: "Wordle Helper" },
  { href: "/wordle-hint-today/", label: "Today's Hint" },
  { href: "/wordle-answers/", label: "Past Answers" },
  {
    label: "Tools",
    children: [
      { href: "/wordle-guesser/", label: "Wordle Guesser" },
      { href: "/5-letter-word-finder/", label: "5 Letter Word Finder" },
      { href: "/wordle-dictionary/", label: "Wordle Dictionary" },
      { href: "/wordle-word-list/", label: "Wordle Word List" },
      { href: "/wordle-unscrambler/", label: "Wordle Unscrambler" },
      { href: "/wordle-unlimited-solver/", label: "Wordle Unlimited Solver" },
      { href: "/3-letter-wordle-solver/", label: "3 Letter Solver" },
      { href: "/4-letter-wordle-solver/", label: "4 Letter Solver" },
      { href: "/6-letter-wordle-solver/", label: "6 Letter Solver" },
      { href: "/7-letter-wordle-solver/", label: "7 Letter Solver" },
    ],
  },
  { href: "/5-letter-words/", label: "Word Lists" },
  {
    label: "Guides",
    children: [
      { href: "/guides/best-wordle-starting-words/", label: "Best Starting Words" },
      { href: "/guides/wordle-tips-strategy/", label: "Tips & Strategy" },
      { href: "/guides/wordle-filler-words/", label: "Filler Words" },
      { href: "/guides/how-to-cheat-at-wordle/", label: "Is a Helper Cheating?" },
      { href: "/guides/how-wordle-helper-works/", label: "How It Works" },
    ],
  },
];

export const FOOTER = [
  {
    title: "Solvers",
    links: [
      { href: "/", label: "Wordle Helper" },
      { href: "/wordle-guesser/", label: "Wordle Guesser" },
      { href: "/wordle-unlimited-solver/", label: "Wordle Unlimited Solver" },
      { href: "/3-letter-wordle-solver/", label: "3 Letter Wordle Solver" },
      { href: "/4-letter-wordle-solver/", label: "4 Letter Wordle Solver" },
      { href: "/6-letter-wordle-solver/", label: "6 Letter Wordle Solver" },
      { href: "/7-letter-wordle-solver/", label: "7 Letter Wordle Solver" },
    ],
  },
  {
    title: "Word tools",
    links: [
      { href: "/5-letter-word-finder/", label: "5 Letter Word Finder" },
      { href: "/wordle-dictionary/", label: "Wordle Dictionary" },
      { href: "/wordle-word-list/", label: "Wordle Word List" },
      { href: "/wordle-unscrambler/", label: "Wordle Unscrambler" },
      { href: "/5-letter-words/", label: "5 Letter Word Lists" },
    ],
  },
  {
    title: "Daily",
    links: [
      { href: "/wordle-hint-today/", label: "Today's Wordle Hint" },
      { href: "/wordle-answers/", label: "Past Wordle Answers" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/guides/best-wordle-starting-words/", label: "Best Wordle Starting Words" },
      { href: "/guides/wordle-tips-strategy/", label: "Wordle Tips & Strategy" },
      { href: "/guides/wordle-filler-words/", label: "Wordle Filler Words" },
      { href: "/guides/how-to-cheat-at-wordle/", label: "Is Using a Helper Cheating?" },
      { href: "/guides/how-wordle-helper-works/", label: "How Wordle Helper Works" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/about/", label: "About" },
      { href: "/contact/", label: "Contact" },
      { href: "/privacy/", label: "Privacy Policy" },
      { href: "/terms/", label: "Terms of Use" },
      { href: "/disclaimer/", label: "Disclaimer" },
    ],
  },
];

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const up = (s) => String(s).toUpperCase();

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
