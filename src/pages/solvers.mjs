import { faq, solverWidget, helperCta, related } from "../lib/layout.mjs";
import { pick } from "../lib/tools.mjs";

const NUMBER_WORDS = { 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven" };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function lengthSolver(n, { words }) {
  const name = NUMBER_WORDS[n];
  const answers = words[n].answers.length.toLocaleString();
  const valid = words[n].valid.length.toLocaleString();
  const others = { 3: "three", 4: "four", 6: "six", 7: "seven" };
  const games = {
    3: "three-letter Wordle clones and quick-play modes",
    4: "four-letter games such as Wordle variants with shorter words",
    6: "six-letter games such as Wordle 6 and other longer variants",
    7: "seven-letter games and long-word Wordle variants",
  }[n];
  const extra = {
    3: `<p>Three-letter puzzles are short but surprisingly tricky: with only three tiles, each guess reveals less, and many words differ by a single letter (CAT, BAT, HAT, MAT, PAT, RAT…). When you find yourself in one of those traps, use a guess from the <em>Suggested next guess</em> box to test several of the possible first letters at once instead of guessing them one by one.</p>`,
    4: `<p>Four-letter Wordle is a good warm-up for the classic game. Words are short enough that vowels do a lot of work — a first guess with two vowels and two common consonants, such as one of the top suggestions the solver shows before you enter anything, usually locates at least two letters.</p>`,
    6: `<p>Six-letter games give you more letters per guess but also many more possible answers, so the first two guesses matter. Look for openers with three vowels and common consonants like R, S, T and N, and watch for common endings such as -ER, -ED, -ING and -LY, which the ranked list will surface automatically once your clues point that way.</p>`,
    7: `<p>Seven-letter puzzles are the hardest of the family: there are thousands of possible answers and long words often contain repeated letters. Because each guess covers seven positions, two well-chosen guesses can still eliminate almost everything — enter them here and let the solver rank what's left. Watch out for double letters; the solver accounts for them correctly as long as each tile's color is entered exactly as the game showed it.</p>`,
  }[n];
  const f = faq([
    {
      q: `How does the ${n} letter Wordle solver work?`,
      a: `<p>It checks every ${n}-letter word in its dictionary against the colors you entered, using the same rules as Wordle, and keeps only the words that could have produced those exact colors. The survivors are ranked so the most likely answers come first.</p>`,
    },
    {
      q: `How many ${n} letter words are there?`,
      a: `<p>Our list contains ${answers} common ${n}-letter words that make likely answers and ${valid} words in total, including rarer ones. Tick “Include rare words” to search all of them.</p>`,
    },
    {
      q: "Can I use this for the regular five-letter Wordle?",
      a: `<p>For the classic five-letter game, use the main <a href="/">Wordle Helper</a> — it is tuned for five-letter answers.</p>`,
    },
  ]);
  return {
    path: `/${n}-letter-wordle-solver/`,
    title: `${n} Letter Wordle Solver — ${cap(name)} Letter Wordle Helper`,
    description: `Free ${n} letter Wordle solver. Enter your guesses and green, yellow and gray tiles to see every ${name}-letter word that fits, ranked, plus the best next guess.`,
    priority: 0.7,
    breadcrumbs: [{ href: `/${n}-letter-wordle-solver/`, label: `${n} Letter Wordle Solver` }],
    scripts: ["/assets/js/solver-ui.js"],
    schema: [f.schema],
    body: `
<h1>${n} Letter Wordle Solver</h1>
<p class="lead">A ${name}-letter Wordle helper: enter each guess, tap the tiles to match your colors, and see every ${n}-letter word that is still possible.</p>
<section class="tool" aria-label="${n} letter Wordle solver">
${solverWidget({ length: n, mode: "helper" })}
</section>
<h2>Solving ${name}-letter Wordle puzzles</h2>
<p>This solver works for ${games}. It uses the same approach as our five-letter <a href="/">Wordle Helper</a>: type a guess, set each tile to gray, yellow or green, and the list updates to show only the ${n}-letter words that match every clue. Tap a word to use it as your next guess.</p>
${extra}
<p>The default list holds ${answers} common ${n}-letter words. Games that pick answers from a bigger dictionary can use rarer words, so if nothing matches, tick <em>Include rare words</em> to search all ${valid}.</p>
<p>Other lengths: ${Object.entries(others)
      .filter(([k]) => Number(k) !== n)
      .map(([k, v]) => `<a href="/${k}-letter-wordle-solver/">${v}-letter solver</a>`)
      .join(", ")}, or the classic <a href="/">five-letter Wordle solver</a>.</p>
${helperCta("Playing the classic five-letter Wordle?")}
${f.html}
${related(pick("helper", "unscrambler", "finder", "unlimited"))}
`,
  };
}

function guesser({ words, openers }) {
  const f = faq([
    {
      q: "How does the Wordle guesser choose the next guess?",
      a: "<p>For every possible guess, it works out which color pattern you would see for each word that could still be the answer, then measures how evenly those patterns split the remaining words. The guess with the most even split — the most information — is ranked first.</p>",
    },
    {
      q: "Why is the best guess sometimes a word that can't be the answer?",
      a: "<p>A word that cannot win can still teach you more. If six words are left that differ only in one letter, a guess that tests five of those letters at once guarantees a win next turn, while guessing them one by one could take six turns. Words that could also be the answer are marked so you can choose.</p>",
    },
    {
      q: "What do bits mean?",
      a: "<p>Bits measure information. Each bit halves the number of remaining words on average: a 3-bit guess leaves about one eighth of them, a 5-bit guess about one thirty-second.</p>",
    },
    {
      q: "Can I use the guesser in hard mode?",
      a: "<p>In hard mode every guess must use the letters you have already found. Pick a suggestion marked “could be the answer”, or choose from the list of possible answers below the suggestions — those always follow hard-mode rules.</p>",
    },
  ]);
  return {
    path: "/wordle-guesser/",
    title: "Wordle Guesser — Best Next Guess Calculator",
    description: "Wordle guesser that calculates your best next guess. Enter your clues and get the top 10 guesses ranked by how many possible answers they eliminate.",
    priority: 0.8,
    breadcrumbs: [{ href: "/wordle-guesser/", label: "Wordle Guesser" }],
    scripts: ["/assets/js/solver-ui.js"],
    schema: [f.schema],
    body: `
<h1>Wordle Guesser</h1>
<p class="lead">Not sure what to play next? Enter your guesses and colors, and the Wordle guesser ranks the 10 best next guesses by how many possible answers each one rules out.</p>
<section class="tool" aria-label="Wordle next guess calculator">
${solverWidget({ length: 5, mode: "guesser" })}
</section>
<h2>Best guesses, not just possible answers</h2>
<p>Most word finders only list the words that fit your clues. The Wordle guesser goes one step further and asks which guess will leave you with the <em>fewest</em> words afterwards. It tests up to 600 strong candidate guesses against every remaining answer, so the suggestions update in a fraction of a second as you change tile colors.</p>
<p>Each suggestion shows three numbers:</p>
<ul>
  <li><strong>Bits</strong> — the information the guess is expected to reveal. Higher is better; each bit halves what's left.</li>
  <li><strong>Groups</strong> — how many different color patterns the guess can produce. More groups mean the answers are spread more thinly.</li>
  <li><strong>Left on average</strong> — roughly how many words you can expect to remain after playing it.</li>
</ul>
<p>Before you enter anything, the guesser shows the best opening words. Our top openers are ${openers.slice(0, 5).map((o) => o.word.toUpperCase()).join(", ")} — the full ranking is in our guide to the <a href="/guides/best-wordle-starting-words/">best Wordle starting words</a>.</p>
<h2>When to trust the guesser</h2>
<p>Early in the game, follow the information score — it consistently wins in fewer turns. When only two or three words remain, simply guess one of them: a coin-flip chance of winning now is worth more than extra information. The guesser accounts for this by giving a small bonus to words that could be the answer.</p>
<p>The guesser uses the same engine and word lists as the <a href="/">Wordle Helper</a>, with ${words[5].answers.length.toLocaleString()} likely answers and ${words[5].valid.length.toLocaleString()} valid guesses.</p>
${helperCta("Prefer a simpler view?")}
${f.html}
${related(pick("helper", "finder", "starters", "tips"))}
`,
  };
}

function unlimited({ words }) {
  const f = faq([
    {
      q: "Does this work with Wordle Unlimited and other clones?",
      a: "<p>Yes. Any game that colors letters green, yellow and gray the way Wordle does will work. Because unlimited games often choose answers from a much bigger dictionary, this solver searches every valid word by default.</p>",
    },
    {
      q: "What if the answer isn't in the list?",
      a: "<p>Some clones use unusual words, names or British and American spellings our dictionary doesn't include. Double-check your tile colors first; if they are right, the answer is probably outside our list.</p>",
    },
    {
      q: "Can I solve games with more or fewer letters?",
      a: `<p>Yes — use the <a href="/3-letter-wordle-solver/">3</a>, <a href="/4-letter-wordle-solver/">4</a>, <a href="/6-letter-wordle-solver/">6</a> or <a href="/7-letter-wordle-solver/">7 letter Wordle solver</a>.</p>`,
    },
  ]);
  return {
    path: "/wordle-unlimited-solver/",
    title: "Wordle Unlimited Solver — Find Any Wordle Unlimited Answer",
    description: "Solve Wordle Unlimited and practice games. Enter your green, yellow and gray letters to find the answer from the full dictionary of valid five-letter words.",
    priority: 0.6,
    breadcrumbs: [{ href: "/wordle-unlimited-solver/", label: "Wordle Unlimited Solver" }],
    scripts: ["/assets/js/solver-ui.js"],
    schema: [f.schema],
    body: `
<h1>Wordle Unlimited Solver</h1>
<p class="lead">Find the Wordle Unlimited answer in any practice or endless game. This solver searches all ${words[5].valid.length.toLocaleString()} valid five-letter words, not just the common ones.</p>
<section class="tool" aria-label="Wordle Unlimited solver">
${solverWidget({ length: 5, mode: "helper", list: "valid" })}
</section>
<h2>Why a separate solver for unlimited games?</h2>
<p>The daily Wordle picks its answers from a hand-curated set of everyday words, so our main <a href="/">Wordle Helper</a> searches common words first. Wordle Unlimited and similar practice sites usually pick answers at random from a far larger dictionary, so uncommon words like FJORD, NYMPH or KAZOO turn up more often. This page starts with <em>Include rare words</em> switched on so none of them are missed. Untick it to focus on everyday words.</p>
<p>The rest works exactly like the main helper: type a guess, tap each tile to match the color the game showed, and pick your next guess from the ranked list or the suggestions. Since you can play as many games as you like, it is also a great way to practice — try solving on your own, then check which guess the solver would have played.</p>
${helperCta("Playing today's official Wordle?")}
${f.html}
${related(pick("helper", "guesser", "six", "seven"))}
`,
  };
}

export default function solvers(ctx) {
  return [guesser(ctx), unlimited(ctx), ...[3, 4, 6, 7].map((n) => lengthSolver(n, ctx))];
}
