import { faq, helperCta, related } from "../lib/layout.mjs";
import { SITE, up } from "../lib/site.mjs";
import { pick } from "../lib/tools.mjs";
import { bestGuesses, letterStats, matchWords } from "../assets/js/engine.js";

const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

function article(page, buildDate) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: SITE.url + page.path,
    dateModified: buildDate,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url + "/" },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url + "/" },
  };
}

function guide(ctx, { slug, h1, title, description, lead, body, faqs = [], links }) {
  const path = `/guides/${slug}/`;
  const f = faqs.length ? faq(faqs) : null;
  const page = { path, h1, description };
  return {
    path,
    title,
    description,
    priority: 0.6,
    breadcrumbs: [
      { href: "/guides/", label: "Guides" },
      { href: path, label: h1 },
    ],
    schema: [article(page, ctx.buildDate), f && f.schema].filter(Boolean),
    body: `
<h1>${h1}</h1>
<p class="lead">${lead}</p>
${body}
${helperCta()}
${f ? f.html : ""}
${related(pick(...links))}
`,
  };
}

function startingWords(ctx) {
  const { openers, secondWords, words } = ctx;
  const total = words[5].answers.length;
  const rows = openers
    .slice(0, 20)
    .map(
      (o, i) =>
        `<tr><td>${i + 1}</td><td><strong>${up(o.word)}</strong></td><td>${o.bits.toFixed(2)}</td><td>${o.buckets}</td><td>~${Math.round(total / Math.pow(2, o.bits))}</td><td>${o.isAnswer ? "Yes" : "No"}</td></tr>`
    )
    .join("");
  const stats = letterStats(words[5].answers);
  const freq = ABC.map((c, i) => ({ c, pct: (100 * stats.overall[i]) / total })).sort((a, b) => b.pct - a.pct);
  const topLetters = freq.slice(0, 10);
  const positions = [0, 1, 2, 3, 4].map((p) => {
    const best = ABC.map((c, i) => ({ c, n: stats.positional[p][i] })).sort((a, b) => b.n - a.n).slice(0, 3);
    return `<tr><td>${p + 1}</td><td>${best.map((b) => `${up(b.c)} (${Math.round((100 * b.n) / total)}%)`).join(", ")}</td></tr>`;
  });
  const top = openers[0];
  const pairRows = Object.entries(secondWords)
    .map(([first, list]) => `<tr><td><strong>${up(first)}</strong></td><td>${list.slice(0, 3).map((s) => up(s.word)).join(", ")}</td><td>${list[0].bits.toFixed(2)}</td></tr>`)
    .join("");
  const bestTwo = secondWords[top.word][0];
  return guide(ctx, {
    slug: "best-wordle-starting-words",
    h1: "Best Wordle Starting Words",
    title: "Best Wordle Starting Words (Ranked by Data) + Best Second Word",
    description: `The best Wordle starting words ranked by how many answers they rule out. ${up(top.word)} tops our list — plus the best second words and the top letters in Wordle.`,
    lead: `We tested all ${words[5].valid.length.toLocaleString()} valid guesses against ${total.toLocaleString()} likely answers. These are the openers that reveal the most.`,
    links: ["helper", "guesser", "tips", "list"],
    faqs: [
      {
        q: "What is the best Wordle starting word?",
        a: `<p>By our measure, <strong>${up(top.word)}</strong>. It splits the possible answers into ${top.buckets} different color patterns and leaves about ${Math.round(total / Math.pow(2, top.bits))} words on average. ${openers
          .slice(1, 4)
          .map((o) => up(o.word))
          .join(", ")} are almost as good.</p>`,
      },
      {
        q: "What is the best second word in Wordle?",
        a: `<p>If you open with ${up(top.word)} and get mostly gray, ${up(bestTwo.word)} is the strongest follow-up: it uses five completely different common letters. If your first guess found letters, it is better to choose a second guess that uses them — the <a href="/wordle-guesser/">Wordle guesser</a> calculates this for you.</p>`,
      },
      {
        q: "What are the most common letters in Wordle?",
        a: `<p>Among likely answers the most common letters are ${topLetters.slice(0, 6).map((l) => up(l.c)).join(", ")}. E appears in roughly ${Math.round(freq.find((f) => f.c === "e").pct)}% of answers.</p>`,
      },
    ],
    body: `
<h2>Top 20 Wordle starting words</h2>
<p>For each possible first guess, we worked out the color pattern it would produce against every likely answer, then measured how evenly those patterns split the answers. The more groups and the more even the split, the fewer words you are left with. That is measured in <strong>bits</strong> of information — each extra bit roughly halves the words left.</p>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Word</th><th>Bits</th><th>Patterns</th><th>Words left (avg.)</th><th>Possible answer?</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="small">Calculated against our list of ${total.toLocaleString()} likely answers. Rankings against other lists — including the official one — differ slightly, but the same family of words always comes out on top.</p>

<h2>Why these words work</h2>
<p>The best openers share three traits:</p>
<ul>
  <li><strong>Five different letters.</strong> A repeated letter wastes a slot that could test something new.</li>
  <li><strong>Common letters.</strong> R, A, I, S, E, T, L and O appear in a large share of answers, so testing them gives a yellow or green most of the time.</li>
  <li><strong>Letters in their usual spots.</strong> S often starts a word, E often ends one. A green tells you far more than a yellow, so openers that place letters where they usually go score higher.</li>
</ul>
<p>Notice how many of the top words are anagrams of each other — ${openers
      .slice(0, 8)
      .map((o) => up(o.word))
      .join(", ")}. Most of the value comes from the letters themselves; the order adds the rest.</p>

<h2>Best second words</h2>
<p>If you always use the same opener, it can help to have a fixed second word for when the first guess comes back mostly gray. These pairs cover ten different letters and together split the answers into over a thousand patterns:</p>
<div class="table-wrap"><table><thead><tr><th>First word</th><th>Best second words</th><th>Bits together</th></tr></thead><tbody>${pairRows}</tbody></table></div>
<p>A fixed second word is a safety net, not a rule. If your first guess turned up a green or two yellows, a second guess that uses that information almost always does better. The <a href="/wordle-guesser/">Wordle guesser</a> shows the best choice for your exact situation.</p>

<h2>Top letters in Wordle</h2>
<p>How often each letter appears in at least one position across the likely answers:</p>
<div class="table-wrap"><table><thead><tr><th>Letter</th><th>Share of answers</th></tr></thead><tbody>${topLetters.map((l) => `<tr><td><strong>${up(l.c)}</strong></td><td>${l.pct.toFixed(1)}%</td></tr>`).join("")}</tbody></table></div>
<h3>Most common letters by position</h3>
<div class="table-wrap"><table><thead><tr><th>Position</th><th>Most common letters</th></tr></thead><tbody>${positions.join("")}</tbody></table></div>
<p>Ready to put a starting word to work? Enter it into the <a href="/">Wordle Helper</a> with your colors to see what's left.</p>
`,
  });
}

function tips(ctx) {
  return guide(ctx, {
    slug: "wordle-tips-strategy",
    h1: "Wordle Tips & Strategy",
    title: "Wordle Tips & Strategy: 12 Ways to Win in Fewer Guesses",
    description: "Practical Wordle tips and strategy: how to pick openers, use every clue, avoid word traps, handle double letters and think like a Wordle solver algorithm.",
    lead: "Twelve habits that win more games in fewer guesses — and how the Wordle solver algorithm thinks about each one.",
    links: ["helper", "starters", "guesser", "finder"],
    faqs: [
      {
        q: "Is there a way to win Wordle every time?",
        a: "<p>No strategy guarantees a win every game, but a computer solver using the ideas in this guide solves almost every puzzle within six guesses, most of them in three or four. For people, the biggest gains come from a strong opener, using every clue and avoiding word traps.</p>",
      },
      {
        q: "Should I play in hard mode?",
        a: "<p>Hard mode forces you to reuse letters you've found, which makes word traps like _ATCH more dangerous. It's a fun challenge, but normal mode lets you use the filler-word technique below, which wins more games.</p>",
      },
    ],
    body: `
<h2>Before you guess</h2>
<h3>1. Use a strong, consistent opener</h3>
<p>Starting with the same strong word every day means you learn what its patterns look like. Pick one from our <a href="/guides/best-wordle-starting-words/">best Wordle starting words</a> — five different common letters, in the positions they usually appear.</p>
<h3>2. Know which letters are common</h3>
<p>E, A, R, O, T, L, I and S cover most answers. Rare letters like J, Q, X and Z are worth testing only once the common ones are ruled out.</p>

<h2>Reading the clues</h2>
<h3>3. Use every clue — including where yellows aren't</h3>
<p>A yellow letter tells you two things: the letter is in the word, and it's not in that spot. Many players forget the second half. Move yellow letters to a new position in your next guess.</p>
<h3>4. Gray means “no more copies”, not always “none”</h3>
<p>If you guess a word with two Es and one is yellow and the other gray, the answer has exactly one E. That gray doesn't mean E is absent — just that there's no second copy.</p>
<h3>5. Don't forget double letters</h3>
<p>Answers like SPOON, SKILL, ARRAY and EERIE catch people out because we tend to guess five different letters. If your options are running out, consider a repeated letter.</p>
<h3>6. Think about word structure</h3>
<p>Endings like -ER, -LY, -CH and -ED, and starts like ST-, SH- and TR- are common. If you have a green E in position four, think “-ER”; a Y in position five often means “-LY” or “-TY”.</p>

<h2>Choosing your next guess</h2>
<h3>7. Early on, explore; late, commit</h3>
<p>On guesses two and three, a word that tests new letters can be worth more than a word that might be right. Once you're down to two or three possibilities, just guess one of them.</p>
<h3>8. Watch for word traps</h3>
<p>Patterns like _ATCH, _IGHT, _OUND and _ASTE have many answers that differ by one letter. Guessing them one at a time can burn all six turns. Instead, play a <a href="/guides/wordle-filler-words/">filler word</a> that tests several of the possible first letters at once.</p>
<h3>9. Count what's left</h3>
<p>Before each guess, try to list the words still possible. If you can only think of one, double-check — there's usually another. The <a href="/">Wordle Helper</a> shows the exact count.</p>
<h3>10. Don't reuse gray letters</h3>
<p>Every gray letter in a guess is a wasted slot. Outside hard mode, choose words that avoid letters you've already ruled out.</p>

<h2>How the Wordle solver algorithm plays</h2>
<h3>11. Maximize information</h3>
<p>Computer solvers score each possible guess by how evenly it splits the remaining answers across color patterns — its <em>expected information</em>. A guess that could produce 50 different patterns is better than one that can only produce 10, even if neither is likely to be the answer. You can watch this in action with the <a href="/wordle-guesser/">Wordle guesser</a>.</p>
<h3>12. Learn from every game</h3>
<p>After you finish, enter your guesses into the <a href="/">Wordle Helper</a> to see how many words were left after each turn and which guess would have narrowed things down faster. It's the quickest way to improve.</p>
`,
  });
}

function fillerWords(ctx) {
  const { words } = ctx;
  const traps = ["?atch", "?ight", "?ound", "?aste", "?ill?"]
    .map((p) => {
      const cands = matchWords(words[5].answers, { pattern: p });
      if (cands.length < 4) return null;
      // Among equally good fillers, prefer everyday words people will recognise.
      const best = bestGuesses(cands, words[5].valid, { limit: 200, maxPool: words[5].valid.length })
        .sort((a, b) => b.bits - a.bits || words[5].answerSet.has(b.word) - words[5].answerSet.has(a.word))
        .slice(0, 3);
      return { p, cands, best };
    })
    .filter(Boolean);
  const examples = traps
    .map(
      (t) => `<h3>${up(t.p.replace(/\?/g, "_"))} — ${t.cands.length} possible answers</h3>
<p>${t.cands.map(up).join(", ")}</p>
<p>Best filler words: ${t.best.map((b) => `<strong>${up(b.word)}</strong> (${b.buckets} groups)`).join(", ")}. ${
        t.best[0].buckets === t.cands.length ? "The top pick leaves only one possible answer whichever colors come back." : `The top pick splits the ${t.cands.length} words into ${t.best[0].buckets} groups.`
      }</p>`
    )
    .join("\n");
  return guide(ctx, {
    slug: "wordle-filler-words",
    h1: "Wordle Filler Words",
    title: "Filler Words for Wordle: When and How to Use Them",
    description: "What filler words are in Wordle, when to use them to escape word traps like _ATCH and _IGHT, and the best filler words for common patterns.",
    lead: "A filler word is a guess you play knowing it isn't the answer — because it rules out more words than any guess that could be.",
    links: ["guesser", "helper", "tips", "finder"],
    faqs: [
      {
        q: "What are good filler words for Wordle?",
        a: "<p>Good filler words use five different letters you haven't tested yet, especially the letters that separate your remaining options. There's no single best list — the right filler depends on what's left, which is why the <a href=\"/wordle-guesser/\">Wordle guesser</a> calculates one for each situation.</p>",
      },
      {
        q: "Can I use filler words in hard mode?",
        a: "<p>No. Hard mode requires every guess to use the letters you've already found, so most filler words aren't allowed. That's what makes word traps so dangerous in hard mode.</p>",
      },
    ],
    body: `
<h2>When to use a filler word</h2>
<p>Filler words are the answer to <strong>word traps</strong>: situations where you know four letters but several words still fit. Imagine you have _ATCH with one guess spent. BATCH, CATCH, HATCH, LATCH, MATCH, PATCH and WATCH are all possible. Guess them one at a time and you could need seven more turns.</p>
<p>Instead, play a word that contains as many of the possible first letters as you can — B, C, H, L, M, P, W — even though it can't be the answer. Whichever letter lights up tells you exactly which word it is, and you win on the next turn.</p>
<p>Use a filler word when:</p>
<ul>
  <li>three or more words fit and they differ in the same position,</li>
  <li>you have enough guesses left to spend one (usually three or more), and</li>
  <li>you're not playing in hard mode.</li>
</ul>

<h2>Best filler words for common traps</h2>
<p>We ran each of these patterns through our solver against the full list of ${words[5].valid.length.toLocaleString()} valid guesses:</p>
${examples}
<p>The answer lists above come from our dictionary of likely answers; the real game may use a slightly different list, but the same filler words work.</p>

<h2>Filler words early in the game</h2>
<p>The same idea applies to your second guess. If your opener comes back all gray, don't try to guess the answer yet — play a second word with five fresh common letters (see <a href="/guides/best-wordle-starting-words/">best second words</a>). Together the two guesses test ten letters and usually leave only a few words.</p>
<p>Not sure if it's time for a filler? Enter your board into the <a href="/">Wordle Helper</a>. If the suggested next guess is marked as a word that can't be the answer, that's a filler word — and the solver thinks it's your best move.</p>
`,
  });
}

function cheating(ctx) {
  return guide(ctx, {
    slug: "how-to-cheat-at-wordle",
    h1: "Is Using a Wordle Helper Cheating?",
    title: "How to Cheat at Wordle? Is Using a Wordle Helper Cheating?",
    description: "Is using a Wordle helper or solver cheating? An honest look at Wordle hacks and cheats, what counts as fair play, and how to use a helper to actually get better.",
    lead: "People search for Wordle cheats and hacks every day. Here's an honest look at what they are, whether using them counts as cheating, and how to use a helper without spoiling the fun.",
    links: ["helper", "hint", "tips", "guesser"],
    faqs: [
      {
        q: "Can you get banned for using a Wordle solver?",
        a: "<p>No. Wordle has no accounts to ban for using outside tools — the solver runs entirely on this site and never touches the game. Your stats only record your guesses.</p>",
      },
      {
        q: "Is looking at today's Wordle hint cheating?",
        a: `<p>Most players don't think so, especially for the gentle hints like the number of vowels. Our <a href="/wordle-hint-today/">daily hint page</a> reveals clues one at a time so you can take as little help as you need.</p>`,
      },
    ],
    body: `
<h2>What people mean by “Wordle cheats”</h2>
<p>The so-called Wordle hacks fall into three groups:</p>
<ul>
  <li><strong>Looking up the answer.</strong> Answer sites and social posts give away the word. It works, but it isn't really playing.</li>
  <li><strong>Hints.</strong> Clues such as the first letter or the number of vowels, like our <a href="/wordle-hint-today/">today's Wordle hint</a> page.</li>
  <li><strong>Solvers and helpers.</strong> Tools like the <a href="/">Wordle Helper</a> that take <em>your</em> guesses and colors and list the words that still fit. You still have to guess, and the clues still come from your own play.</li>
</ul>

<h2>So, is using a Wordle helper cheating?</h2>
<p>Wordle is a free puzzle with no prizes, no leaderboards and no rules about outside help. In that sense there is nobody to cheat — except yourself and the people you compare scores with.</p>
<p>A reasonable rule of thumb:</p>
<ul>
  <li>If you're <strong>playing for yourself</strong>, use whatever makes the game fun. A helper that keeps a long streak alive on a tough day, or teaches you a word you'd never have thought of, is doing its job.</li>
  <li>If you're <strong>competing with friends or family</strong>, agree on the rules — or just say when you had help. Posting a two-guess win you looked up isn't fair to people playing straight.</li>
  <li>If you want to <strong>get better</strong>, use the helper after you finish, not during. Seeing how many words were left after each of your guesses is the fastest way to learn.</li>
</ul>

<h2>How to use a helper without spoiling the puzzle</h2>
<ol>
  <li>Play your first two or three guesses on your own.</li>
  <li>If you're stuck, try a gentle hint first, such as the number of vowels.</li>
  <li>Still stuck? Enter your board into the <a href="/">Wordle Helper</a> and look only at the number of words left — that alone is often enough to get you thinking.</li>
  <li>If you need more, browse the list of possible answers and pick one yourself.</li>
  <li>After the game, check which guess the <a href="/wordle-guesser/">Wordle guesser</a> would have played.</li>
</ol>

<h2>The legitimate “hack”: better strategy</h2>
<p>The real way to win more often isn't a trick — it's strategy. A strong starting word, using every clue and avoiding word traps will do more for your average than any shortcut. Our <a href="/guides/wordle-tips-strategy/">Wordle tips and strategy guide</a> covers the habits that make the biggest difference.</p>
`,
  });
}

function howItWorks(ctx) {
  const { words, openers } = ctx;
  return guide(ctx, {
    slug: "how-wordle-helper-works",
    h1: "How the Wordle Helper Works",
    title: "How the Wordle Helper Works: Word Lists, Filtering & Ranking",
    description: "How our Wordle Helper works under the hood: where the word lists come from, how clues are matched with Wordle's duplicate-letter rules, and how guesses are ranked.",
    lead: "A plain-English tour of what happens when you enter your guesses: the word lists, the filtering and the ranking.",
    links: ["helper", "guesser", "list", "starters"],
    body: `
<h2>1. The word lists</h2>
<p>The helper starts from two lists of five-letter words, built from <a href="http://wordlist.aspell.net/">SCOWL</a>, a widely used open-source English word list that sorts words by how common they are.</p>
<ul>
  <li><strong>Likely answers (${words[5].answers.length.toLocaleString()} words)</strong> — common words, with plurals, regular past tenses and offensive words removed, since Wordle rarely or never uses those as answers.</li>
  <li><strong>Valid guesses (${words[5].valid.length.toLocaleString()} words)</strong> — the common words plus rarer ones that you can play as guesses.</li>
</ul>
<p>The New York Times doesn't publish its own answer list and edits it over time, so no outside list is a perfect match. Ours is designed to contain almost every word Wordle is likely to use. You can browse it on the <a href="/wordle-word-list/">Wordle word list</a> page.</p>

<h2>2. Matching your clues</h2>
<p>Every time you change a tile, the helper goes through the word list and, for each word, asks: <em>if this were the answer, would my guesses have produced exactly these colors?</em> It scores the guess against the word using Wordle's rules:</p>
<ol>
  <li>Letters in the right spot are marked green first.</li>
  <li>Then, from left to right, a letter is marked yellow if the answer still has an unmatched copy of it.</li>
  <li>Everything else is gray.</li>
</ol>
<p>If the colors match what you entered, for every guess, the word stays. This “simulate the game” approach handles repeated letters perfectly. Guess LLAMA against HELLO, for example, and you get yellow-yellow-gray-gray-gray: the answer has two Ls, but not in positions one or two. A simpler “letter is gray, so it's not in the word” rule would wrongly throw away the right answer.</p>

<h2>3. Ranking the possible answers</h2>
<p>The words that survive are sorted by a letter-frequency score. For the remaining candidates, the helper counts how often each letter appears, and how often it appears in each position. Each word scores points for its letters — more for common ones, and more again when they sit in their most common spot. Words made of typical letters in typical places rise to the top, which in practice puts the most likely answers first.</p>

<h2>4. Suggesting the best next guess</h2>
<p>For suggestions the helper uses <strong>information theory</strong>. For each candidate guess it calculates the color pattern it would produce against every remaining word and groups the words by pattern. The more evenly the words spread across groups, the more the guess will tell you. This is measured as entropy, in bits.</p>
<p>To keep things fast on phones, the helper first shortlists a few hundred promising guesses by letter frequency, then scores each one exactly. Words that could themselves be the answer get a small bonus, because they might win on the spot. Before any guesses, the best openers by this measure are ${openers
      .slice(0, 3)
      .map((o) => up(o.word))
      .join(", ")}.</p>

<h2>5. Privacy</h2>
<p>All of this runs in your browser. Your guesses are never sent to our servers; the board is saved only in your own browser's storage so it's still there if you reload the page. See our <a href="/privacy/">privacy policy</a>.</p>
`,
  });
}

function index(ctx, list) {
  return {
    path: "/guides/",
    title: "Wordle Guides — Strategy, Starting Words & More",
    description: "Wordle guides: the best starting words, tips and strategy, filler words, whether using a helper is cheating, and how our Wordle solver works.",
    priority: 0.5,
    breadcrumbs: [{ href: "/guides/", label: "Guides" }],
    body: `
<h1>Wordle Guides</h1>
<p class="lead">Everything we've learned about solving Wordle, backed by the same data that powers the <a href="/">Wordle Helper</a>.</p>
<ul class="cards">${list.map((g) => `<li><a href="${g.path}"><strong>${g.breadcrumbs[1].label}</strong><span>${g.description}</span></a></li>`).join("")}</ul>
${helperCta()}
`,
  };
}

export default function guides(ctx) {
  const list = [startingWords(ctx), tips(ctx), fillerWords(ctx), cheating(ctx), howItWorks(ctx)];
  return [index(ctx, list), ...list];
}
