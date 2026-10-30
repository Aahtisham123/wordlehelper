// Single source of truth for every page: SEO title (≤ 50 chars), meta
// description (≤ 144 chars), navigation, sitemap, search index, social image
// and hero illustration. Pages read their metadata from here.

import { SITE } from "./site.mjs";

const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * @typedef {Object} PageEntry
 * @property {string} path
 * @property {string} title        Full <title>, at most 50 characters.
 * @property {string} description  Meta description, at most 144 characters.
 * @property {string} heading      Visible H1.
 * @property {string} nav          Short label for menus and search.
 * @property {string} section      home | daily | solvers | words | lists | guides | blog | site
 * @property {string} [published]  ISO publish date (blog posts).
 * @property {number} [readingTime] Minutes (blog posts).
 * @property {string} icon         lucide-react icon name.
 * @property {string} [image]      Hero illustration key (public/images/<key>.webp).
 * @property {string} [imageAlt]
 * @property {string} og           Social image key (public/og/<key>.jpg).
 * @property {string[]} keywords   Extra search terms for the site search.
 * @property {string} updated      ISO date the content was last reviewed.
 * @property {number} priority
 * @property {string} changefreq
 * @property {boolean} [noindex]
 */

/** @type {PageEntry[]} */
export const PAGES = [
  {
    path: "/",
    title: "Wordle Helper - Free Wordle Solver & Word Finder",
    description: "Free Wordle Helper with 3 ways to solve: enter your colors, type known letters, or let the solver guide you. See the best next guess fast.",
    heading: "Wordle Helper",
    nav: "Wordle Helper",
    section: "home",
    icon: "WandSparkles",
    image: "home-hero",
    imageAlt: "Wordle Helper illustration: colored letter tiles spelling HELPS next to a magnifying glass and a ranked list of words",
    keywords: ["wordle solver", "wordle calculator", "solve wordle", "wordle checker", "words remaining"],
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/wordle-hint-today/",
    title: "Today's Wordle Hint & Answer (Updated Daily)",
    description: "Stuck on today's Wordle? Open spoiler-free hints one by one: vowels, double letters, first letter and more. Reveal the answer only if you want.",
    heading: "Today's Wordle Hint",
    nav: "Today's Hint",
    section: "daily",
    icon: "Lightbulb",
    image: "hint",
    imageAlt: "A glowing light bulb above five letter tiles, three of them still hidden, showing a Wordle hint being revealed step by step",
    keywords: ["what is todays wordle", "wordle answer today", "word of the day wordle", "wordle first letter today", "vowels in todays wordle"],
    priority: 0.9,
    changefreq: "daily",
  },
  {
    path: "/wordle-answers/",
    title: "Past Wordle Answers - Full List of Solutions",
    description: "Every past Wordle answer in one list, newest first, with puzzle numbers and dates. Check yesterday's word and see which words were already used.",
    heading: "Past Wordle Answers",
    nav: "Past Answers",
    section: "daily",
    icon: "Archive",
    image: "answers",
    imageAlt: "A stack of archive cards, each holding a five-letter Wordle answer with its puzzle number",
    keywords: ["yesterday's wordle", "wordle archive", "previous wordle answers", "wordle history"],
    priority: 0.8,
    changefreq: "daily",
  },
  {
    path: "/wordle-guesser/",
    title: "Wordle Guesser - Best Next Guess Calculator",
    description: "Enter your Wordle clues and get the 10 best next guesses, ranked by how many possible answers each one rules out. Free and instant.",
    heading: "Wordle Guesser",
    nav: "Wordle Guesser",
    section: "solvers",
    icon: "Target",
    image: "guesser",
    imageAlt: "A target with an arrow in the bullseye beside letter tiles, showing the Wordle guesser picking the best next guess",
    keywords: ["best next guess", "word guess solver", "best wordle guesses", "next guess calculator"],
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/wordle-unlimited-solver/",
    title: "Wordle Unlimited Solver - Find Any Answer",
    description: "Solve Wordle Unlimited and practice games. Enter your green, yellow and gray letters to search every valid five-letter word, rare ones included.",
    heading: "Wordle Unlimited Solver",
    nav: "Unlimited Solver",
    section: "solvers",
    icon: "Infinity",
    image: "unlimited",
    imageAlt: "An infinity loop made of colored letter tiles, representing endless Wordle Unlimited games",
    keywords: ["wordle unlimited answer", "wordle unlimited finder", "practice wordle"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/5-letter-wordle-solver/",
    updated: "2026-10-27",
    title: "5 Letter Wordle Solver - Free Five-Letter Helper",
    description: "Free 5 letter Wordle solver. Add your guesses and tile colors to see every five-letter word that still fits, ranked, plus the best next guess.",
    heading: "5 Letter Wordle Solver",
    nav: "5 Letter Solver",
    section: "solvers",
    icon: "Grid3x3",
    image: "solver-5",
    imageAlt: "Three rows of five letter tiles, SLATE, PRONE and NAIVE, turning from gray and yellow to all green as a 5-letter Wordle is solved",
    keywords: ["5 letter wordle solver", "wordle solver 5 letter", "five letter wordle helper", "5 letter word solver"],
    priority: 0.8,
    changefreq: "monthly",
  },
  ...[3, 4, 6, 7].map((n) => {
    const word = { 3: "Three", 4: "Four", 6: "Six", 7: "Seven" }[n];
    return {
      path: `/${n}-letter-wordle-solver/`,
      title: `${n} Letter Wordle Solver - ${word}-Letter Helper`,
      description: `Free ${n} letter Wordle solver. Add your guesses and tile colors to see every ${word.toLowerCase()}-letter word that still fits, plus the best next guess.`,
      heading: `${n} Letter Wordle Solver`,
      nav: `${n} Letter Solver`,
      section: "solvers",
      icon: "Grid3x3",
      image: `solver-${n}`,
      imageAlt: `A row of ${n} colored letter tiles in green, yellow and gray, showing a ${n}-letter Wordle puzzle being solved`,
      keywords: [`${word.toLowerCase()} letter wordle`, `${n} letter wordle helper`, `wordle ${n} letters`],
      priority: 0.6,
      changefreq: "monthly",
    };
  }),
  {
    path: "/5-letter-word-finder/",
    title: "5 Letter Word Finder for Wordle",
    description: "Find 5 letter words by the letters they contain, start with or end with. Add green, yellow and gray letters and the matches appear instantly.",
    heading: "5 Letter Word Finder",
    nav: "Word Finder",
    section: "words",
    icon: "TextSearch",
    image: "finder",
    imageAlt: "A magnifying glass hovering over a grid of five-letter words, with matching words highlighted in green",
    keywords: ["5 letter word search", "wordle word search", "find a five letter word", "words with these letters"],
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/wordle-dictionary/",
    title: "Wordle Dictionary - Is It a Valid Word?",
    description: "Type any word to check if Wordle accepts it, whether it could be an answer, and whether it was already used as a past Wordle answer.",
    heading: "Wordle Dictionary",
    nav: "Wordle Dictionary",
    section: "words",
    icon: "BookA",
    image: "dictionary",
    imageAlt: "An open dictionary with a green check mark next to a five-letter word, showing a valid Wordle word",
    keywords: ["wordle dictionary search", "is it a wordle word", "valid wordle words", "dictionary for wordle"],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/wordle-word-list/",
    title: "Wordle Word List - All Possible Words A–Z",
    description: "Browse every likely Wordle answer A to Z, plus rarer valid guesses. Copy or download the full five-letter Wordle word list for free.",
    heading: "Wordle Word List",
    nav: "Wordle Word List",
    section: "words",
    icon: "List",
    image: "word-list",
    imageAlt: "A long scroll of five-letter words sorted from A to Z, with common Wordle answers highlighted",
    keywords: ["words for wordle", "possible wordle words", "wordle combinations", "list of wordle words"],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/wordle-unscrambler/",
    title: "Wordle Unscrambler - Make Words From Letters",
    description: "Enter your letters, with ? for blanks, and see every 3 to 7 letter word you can make. A quick scramble solver for Wordle and other games.",
    heading: "Wordle Unscrambler",
    nav: "Unscrambler",
    section: "words",
    icon: "Shuffle",
    image: "unscrambler",
    imageAlt: "Jumbled letter tiles flying into place to spell a real word, showing how the Wordle unscrambler works",
    keywords: ["wordle scramble solver", "what words can i make with these letters", "anagram solver"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/5-letter-words/",
    title: "5 Letter Words - Lists by Letter for Wordle",
    description: "Five-letter word lists for Wordle: words that start with, end in or contain any letter from A to Z, with the most likely answers first.",
    heading: "5 Letter Words",
    nav: "5 Letter Words",
    section: "words",
    icon: "LetterText",
    image: "word-lists",
    imageAlt: "The alphabet from A to Z arranged as tiles, each leading to a list of five-letter words",
    keywords: ["five letter words", "wordle starts with", "words ending in", "words containing"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/guides/",
    title: "Wordle Guides - Strategy, Tips & Start Words",
    description: "Simple Wordle guides backed by real solver data: the best starting words, smart strategy, filler words, fair play and how our helper works.",
    heading: "Wordle Guides",
    nav: "All Guides",
    section: "guides",
    icon: "GraduationCap",
    image: "guides",
    imageAlt: "A graduation cap resting on a stack of Wordle strategy books",
    keywords: ["wordle strategy", "how to get better at wordle", "wordle guide"],
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/guides/best-wordle-starting-words/",
    title: "Best Wordle Starting Words, Ranked by Data",
    description: "We tested every valid opener against every likely answer. See the best Wordle starting words, the best second word and the top letters.",
    heading: "Best Wordle Starting Words",
    nav: "Best Starting Words",
    section: "guides",
    icon: "Trophy",
    image: "guide-starting-words",
    imageAlt: "A podium with gold, silver and bronze places holding the starting words RAISE, SLATE and ARISE",
    keywords: ["best wordle start word", "best second word wordle", "top letters in wordle", "wordle opener"],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/guides/wordle-tips-strategy/",
    title: "Wordle Tips - 12 Ways to Win in Fewer Guesses",
    description: "Easy Wordle tips that work: pick a strong opener, read every clue, avoid word traps, handle double letters and think like a solver.",
    heading: "Wordle Tips & Strategy",
    nav: "Tips & Strategy",
    section: "guides",
    icon: "Brain",
    image: "guide-tips",
    imageAlt: "A brain made of puzzle pieces next to a checklist, representing Wordle strategy tips",
    keywords: ["wordle tips", "win every game wordle", "tips for wordle", "wordle solver algorithm"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/guides/wordle-filler-words/",
    title: "Wordle Filler Words - When and How to Use Them",
    description: "Learn when a filler word beats guessing the answer, with tested filler words for traps like _ATCH, _IGHT and _OUND.",
    heading: "Wordle Filler Words",
    nav: "Filler Words",
    section: "guides",
    icon: "Puzzle",
    image: "guide-filler",
    imageAlt: "Five letter tiles ending in ATCH with a question mark on the first tile, showing a Wordle word trap",
    keywords: ["filler words for wordle", "good filler words", "best filler words", "wordle trap"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/guides/how-to-cheat-at-wordle/",
    title: "Is Using a Wordle Helper Cheating?",
    description: "An honest look at Wordle cheats and hacks: what counts as fair play, when a helper makes sense, and how to use one to get better.",
    heading: "Is Using a Wordle Helper Cheating?",
    nav: "Is It Cheating?",
    section: "guides",
    icon: "Scale",
    image: "guide-cheating",
    imageAlt: "A balance scale weighing a light bulb against a trophy, representing fair play in Wordle",
    keywords: ["how to cheat at wordle", "wordle hack", "wordle hacks", "wordle cheat"],
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/guides/how-wordle-helper-works/",
    title: "How Our Wordle Helper Works",
    description: "A plain-English look inside our Wordle solver: the word lists, how it reads your colors, how it ranks answers and picks the best guess.",
    heading: "How the Wordle Helper Works",
    nav: "How It Works",
    section: "guides",
    icon: "Microscope",
    image: "guide-how-it-works",
    imageAlt: "Gears turning inside a letter tile, showing the logic behind the Wordle Helper",
    keywords: ["how wordle solver works", "wordle algorithm", "wordle entropy", "wordle information theory"],
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/blog/",
    updated: "2026-10-30",
    title: "Wordle Blog - Tips, Data and Puzzle Insights",
    description: "The Wordle Helper blog: plain-English articles on Wordle strategy, puzzle data from our own solver, and answers to common player questions.",
    heading: "Wordle Blog",
    nav: "Blog",
    section: "blog",
    icon: "Newspaper",
    image: "blog",
    imageAlt: "A stack of newspaper pages made of colorful letter tiles, representing the Wordle Helper blog",
    keywords: ["wordle blog", "wordle articles", "wordle news"],
    priority: 0.6,
    changefreq: "weekly",
  },
  {
    path: "/blog/hardest-wordle-words/",
    updated: "2026-10-27",
    title: "The Hardest Wordle Words, Tested by Our Solver",
    description: "We let our solver play all 2,744 likely Wordle answers. These 13 words needed 6 or 7 guesses. Here's why they're so hard and how to beat them.",
    heading: "The Hardest Wordle Words, According to Our Solver",
    nav: "Hardest Wordle Words",
    section: "blog",
    icon: "Flame",
    image: "blog-hardest-words",
    imageAlt: "Letter tiles spelling COVER with a red flame badge, showing one of the hardest Wordle words",
    keywords: ["hardest wordle words", "hardest wordle answers", "difficult wordle words", "wordle word traps"],
    published: "2026-10-27",
    readingTime: 6,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/what-time-does-wordle-reset/",
    updated: "2026-10-27",
    title: "What Time Does Wordle Reset? Times by Zone",
    description: "Wordle resets at midnight in your own time zone. See when the new puzzle arrives around the world and why friends abroad may be a day ahead.",
    heading: "What Time Does Wordle Reset?",
    nav: "When Wordle Resets",
    section: "blog",
    icon: "Clock",
    image: "blog-wordle-reset",
    imageAlt: "A clock striking midnight above a row of fresh, empty Wordle-style letter tiles",
    keywords: ["what time does wordle reset", "when does wordle reset", "new wordle time", "wordle time zone"],
    published: "2026-10-27",
    readingTime: 4,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/how-to-play-wordle/",
    updated: "2026-10-29",
    title: "How to Play Wordle - A Simple Beginner's Guide",
    description: "New to Wordle? Learn the rules, what the green, yellow and gray tiles mean, how double letters and hard mode work, and easy tips to win.",
    heading: "How to Play Wordle: A Simple Guide for Beginners",
    nav: "How to Play Wordle",
    section: "blog",
    icon: "GraduationCap",
    image: "blog-how-to-play",
    imageAlt: "Letter tiles spelling LEARN and WORDS in green, yellow and gray, introducing how to play Wordle",
    keywords: ["how to play wordle", "wordle rules", "wordle for beginners", "what do wordle colors mean"],
    published: "2026-10-29",
    readingTime: 6,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/5-letter-words-no-vowels/",
    updated: "2026-10-29",
    title: "5 Letter Words With No Vowels for Wordle",
    description: "Common 5-letter words with no A, E, I, O or U, like NYMPH, CRYPT and GLYPH, plus why Y matters and how to spot these tricky Wordle answers.",
    heading: "5 Letter Words With No Vowels (A, E, I, O, U)",
    nav: "Words With No Vowels",
    section: "blog",
    icon: "SpellCheck",
    image: "blog-no-vowels",
    imageAlt: "Green letter tiles spelling NYMPH and GLYPH, two five-letter words with no A, E, I, O or U",
    keywords: ["5 letter words with no vowels", "words without vowels", "wordle no vowels", "5 letter words with y as a vowel"],
    published: "2026-10-29",
    readingTime: 5,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/5-letter-words-with-double-letters/",
    updated: "2026-10-30",
    title: "5 Letter Words With Double Letters for Wordle",
    description: "One in three likely Wordle answers repeats a letter. See 5-letter words with double letters, which letters repeat most and how to spot them.",
    heading: "5 Letter Words With Double Letters (and How to Spot Them)",
    nav: "Words With Double Letters",
    section: "blog",
    icon: "Layers",
    image: "blog-double-letters",
    imageAlt: "Green letter tiles spelling SPOON and SKILL, two five-letter Wordle words with double letters",
    keywords: ["5 letter words with double letters", "wordle double letters", "words with repeated letters", "5 letter words with two of the same letter"],
    published: "2026-10-30",
    readingTime: 6,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/audio-vs-raise-best-wordle-opener/",
    updated: "2026-10-30",
    title: "AUDIO vs RAISE - Is a Vowel Opener Better?",
    description: "Our solver played all 2,744 likely Wordle answers starting with AUDIO, RAISE and three other openers. Here's which one really wins, and why.",
    heading: "AUDIO vs RAISE: Should You Start Wordle With Vowels?",
    nav: "AUDIO vs RAISE",
    section: "blog",
    icon: "Scale",
    image: "blog-audio-vs-raise",
    imageAlt: "Two rows of letter tiles, AUDIO and RAISE, side by side as two Wordle openers are compared",
    keywords: ["audio wordle", "is audio a good wordle start", "raise vs audio", "best vowel starting word wordle", "adieu wordle"],
    published: "2026-10-30",
    readingTime: 6,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/wordle-words-with-q-z-x-j/",
    updated: "2026-10-30",
    title: "Wordle Words With Q, Z, X and J (Rare Letters)",
    description: "Q, Z, X and J each show up in fewer than 2% of Wordle answers. See every common word that uses them, where they sit and when to test them.",
    heading: "Wordle Words With Q, Z, X and J: A Guide to the Rarest Letters",
    nav: "Words With Q, Z, X, J",
    section: "blog",
    icon: "Gem",
    image: "blog-rare-letters",
    imageAlt: "Green letter tiles spelling QUAKE and JAZZY, two Wordle words that use rare letters",
    keywords: ["wordle words with q", "5 letter words with z", "5 letter words with x", "5 letter words with j", "rare letters wordle"],
    published: "2026-10-30",
    readingTime: 6,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/protect-your-wordle-streak/",
    updated: "2026-10-30",
    title: "Keep Your Wordle Streak Alive - Tips That Work",
    description: "Word traps like _IGHT and _OUND are classic streak killers. See the biggest traps in our data and easy habits that protect your Wordle streak.",
    heading: "How to Protect Your Wordle Streak",
    nav: "Protect Your Streak",
    section: "blog",
    icon: "ShieldCheck",
    image: "blog-streak",
    imageAlt: "A shield beside green letter tiles spelling KEEPS GOING, representing a protected Wordle streak",
    keywords: ["wordle streak", "keep wordle streak", "lost wordle streak", "wordle streak tips", "wordle word traps"],
    published: "2026-10-30",
    readingTime: 7,
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/about/",
    title: "About Wordle Helper",
    description: "Who builds Wordle Helper, how we test our tools, where our word lists come from and how we keep hints spoiler-free.",
    heading: "About Wordle Helper",
    nav: "About",
    section: "site",
    icon: "Info",
    image: "about",
    imageAlt: "Friendly team illustration with letter tiles spelling ABOUT",
    keywords: ["about us", "who made wordle helper", "editorial policy"],
    priority: 0.3,
    changefreq: "yearly",
  },
  {
    path: "/contact/",
    title: "Contact Wordle Helper",
    description: "Questions, feedback, a missing word or a bug to report? Here is how to reach the Wordle Helper team and what to include.",
    heading: "Contact Us",
    nav: "Contact",
    section: "site",
    icon: "Mail",
    keywords: ["contact", "feedback", "report a bug"],
    priority: 0.3,
    changefreq: "yearly",
  },
  {
    path: "/privacy/",
    title: "Privacy Policy | Wordle Helper",
    description: "How wordlehelp.co handles your data: tools run in your browser, what we store, cookies and analytics consent, and your choices.",
    heading: "Privacy Policy",
    nav: "Privacy Policy",
    section: "site",
    icon: "Lock",
    keywords: ["privacy", "cookies", "data"],
    priority: 0.2,
    changefreq: "yearly",
  },
  {
    path: "/terms/",
    title: "Terms of Use | Wordle Helper",
    description: "The terms for using wordlehelp.co and its free Wordle tools, word lists, hints and guides.",
    heading: "Terms of Use",
    nav: "Terms of Use",
    section: "site",
    icon: "FileText",
    keywords: ["terms", "conditions"],
    priority: 0.2,
    changefreq: "yearly",
  },
  {
    path: "/disclaimer/",
    title: "Disclaimer - Not Affiliated With the NYT",
    description: "Wordle Helper is an independent fan site. It is not affiliated with, endorsed by or sponsored by The New York Times.",
    heading: "Disclaimer",
    nav: "Disclaimer",
    section: "site",
    icon: "ShieldCheck",
    keywords: ["new york times", "trademark", "affiliation"],
    priority: 0.2,
    changefreq: "yearly",
  },
].map((p) => ({ updated: SITE.updated, og: ogKey(p.path), ...p }));

export function ogKey(path) {
  return path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "--");
}

// ---- Programmatic 5-letter word list pages -------------------------------

export const LIST_KINDS = {
  "starting-with": { label: (L) => `5 Letter Words Starting With ${L}`, phrase: (L) => `starting with ${L}`, test: (c) => (w) => w[0] === c },
  "ending-in": { label: (L) => `5 Letter Words Ending in ${L}`, phrase: (L) => `ending in ${L}`, test: (c) => (w) => w[4] === c },
  containing: { label: (L) => `5 Letter Words Containing ${L}`, phrase: (L) => `containing ${L}`, test: (c) => (w) => w.includes(c) },
};

/** All list slugs that have at least one word, e.g. "starting-with-a". */
export function listSlugs(validWords) {
  const out = [];
  for (const kind of Object.keys(LIST_KINDS)) {
    for (const c of ABC) {
      const count = validWords.filter(LIST_KINDS[kind].test(c)).length;
      if (count > 0) out.push({ slug: `${kind}-${c}`, kind, letter: c, count });
    }
  }
  return out;
}

export function parseListSlug(slug) {
  const m = /^(starting-with|ending-in|containing)-([a-z])$/.exec(slug);
  return m ? { kind: m[1], letter: m[2] } : null;
}

/** Registry entry for a programmatic list page. */
export function listPage(slug, { common, all }) {
  const { kind, letter } = parseListSlug(slug);
  const L = letter.toUpperCase();
  const def = LIST_KINDS[kind];
  const label = def.label(L);
  const phrase = def.phrase(L);
  return {
    path: `/5-letter-words/${slug}/`,
    title: `${label} | Wordle Helper`,
    description: common
      ? `${all} five-letter words ${phrase}, with the ${common} most likely Wordle answers first. Copy the list or check the best guesses.`
      : `Five-letter words ${phrase}: ${all} rare words that Wordle accepts as guesses, with tips on what to try next.`,
    heading: label,
    nav: label,
    section: "lists",
    icon: "LetterText",
    og: `words--${slug}`,
    keywords: [`5 letter words ${phrase}`, `five letter words ${phrase}`, `wordle ${phrase}`],
    updated: SITE.updated,
    priority: 0.5,
    changefreq: "monthly",
    noindex: all < 10,
  };
}

// ---- Navigation -----------------------------------------------------------

export const NAV_GROUPS = [
  { label: "Play", items: ["/", "/wordle-hint-today/", "/wordle-answers/"] },
  { label: "Solvers", items: ["/wordle-guesser/", "/wordle-unlimited-solver/", "/3-letter-wordle-solver/", "/4-letter-wordle-solver/", "/5-letter-wordle-solver/", "/6-letter-wordle-solver/", "/7-letter-wordle-solver/"] },
  { label: "Word tools", items: ["/5-letter-word-finder/", "/wordle-dictionary/", "/wordle-word-list/", "/wordle-unscrambler/", "/5-letter-words/"] },
  { label: "Guides", items: ["/blog/", "/guides/best-wordle-starting-words/", "/guides/wordle-tips-strategy/", "/guides/wordle-filler-words/", "/guides/how-to-cheat-at-wordle/", "/guides/how-wordle-helper-works/"] },
];

export const FOOTER_GROUPS = [
  { label: "Solvers", items: ["/", "/5-letter-wordle-solver/", "/wordle-guesser/", "/wordle-unlimited-solver/", "/4-letter-wordle-solver/", "/6-letter-wordle-solver/", "/7-letter-wordle-solver/"] },
  { label: "Word tools", items: ["/5-letter-word-finder/", "/wordle-dictionary/", "/wordle-word-list/", "/wordle-unscrambler/", "/5-letter-words/"] },
  { label: "Daily & guides", items: ["/wordle-hint-today/", "/wordle-answers/", "/guides/", "/blog/", "/guides/best-wordle-starting-words/"] },
  { label: "Company", items: ["/about/", "/contact/", "/privacy/", "/terms/", "/disclaimer/"] },
];

export function getPage(path) {
  const page = PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`No registry entry for ${path}`);
  return page;
}
