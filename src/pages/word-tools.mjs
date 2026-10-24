import { faq, helperCta, related, wordGrid } from "../lib/layout.mjs";
import { pick } from "../lib/tools.mjs";

const ABC = "abcdefghijklmnopqrstuvwxyz".split("");

function finder({ words }) {
  const f = faq([
    {
      q: "How do I find a 5 letter word with certain letters?",
      a: "<p>Type the letters you know are in the word (your yellow letters) into <em>Contains these letters</em>. Add any green letters to the boxes in their positions, and put gray letters in <em>Leave out these letters</em>. The list updates as you type.</p>",
    },
    {
      q: "Can I search for words that start or end with certain letters?",
      a: `<p>Yes — use the <em>Starts with</em> and <em>Ends with</em> fields. You can also browse ready-made lists such as <a href="/5-letter-words/starting-with-s/">5 letter words starting with S</a> or <a href="/5-letter-words/ending-in-e/">ending in E</a>.</p>`,
    },
    {
      q: "Why don't I see very obscure words?",
      a: "<p>By default the finder searches common words, which are the realistic Wordle answers. Choose <em>All valid words</em> to include rare words as well.</p>",
    },
  ]);
  return {
    path: "/5-letter-word-finder/",
    title: "5 Letter Word Finder for Wordle — Search by Letters",
    description: "Find 5 letter words for Wordle by letters they contain, start with or end with. Add known positions and excluded letters to search instantly.",
    priority: 0.8,
    breadcrumbs: [{ href: "/5-letter-word-finder/", label: "5 Letter Word Finder" }],
    scripts: ["/assets/js/finder.js"],
    schema: [f.schema],
    body: `
<h1>5 Letter Word Finder for Wordle</h1>
<p class="lead">Search five-letter words by the letters they contain, start with or end with. Fill in what you know and the matching words appear instantly.</p>
<section class="tool" data-finder aria-label="5 letter word search">
  <form>
    <div class="field"><label>Known letter positions <small>(green letters)</small></label><div class="pattern"></div></div>
    <div class="fields" style="margin-top:12px">
      <div class="field"><label for="f-inc">Contains these letters <small>(yellow)</small></label><input id="f-inc" name="includes" placeholder="e.g. AR" autocomplete="off"></div>
      <div class="field"><label for="f-exc">Leave out these letters <small>(gray)</small></label><input id="f-exc" name="excludes" placeholder="e.g. TIN" autocomplete="off"></div>
      <div class="field"><label for="f-start">Starts with</label><input id="f-start" name="starts" autocomplete="off"></div>
      <div class="field"><label for="f-end">Ends with</label><input id="f-end" name="ends" autocomplete="off"></div>
      <div class="field"><label for="f-con">Contains the sequence</label><input id="f-con" name="contains" placeholder="e.g. CH" autocomplete="off"></div>
      <div class="field"><label for="f-len">Word length</label><select id="f-len" name="length">${[3, 4, 5, 6, 7].map((n) => `<option value="${n}"${n === 5 ? " selected" : ""}>${n} letters</option>`).join("")}</select></div>
      <div class="field"><label for="f-list">Words to search</label><select id="f-list" name="list"><option value="answers">Common words (likely answers)</option><option value="valid">All valid words</option></select></div>
    </div>
    <p><button class="btn ghost small" type="reset">Clear all</button></p>
  </form>
  <div class="results"><noscript><p>The word finder needs JavaScript. Browse our <a href="/5-letter-words/">5 letter word lists</a> instead.</p></noscript></div>
</section>
<h2>How to search for five-letter words</h2>
<p>This 5 letter word search is built for Wordle, but works for any word game. Each field narrows the list:</p>
<ul>
  <li><strong>Known letter positions</strong> — type a letter into a box when you know exactly where it goes (a green tile in Wordle).</li>
  <li><strong>Contains these letters</strong> — letters that must appear somewhere, in any order (your yellow tiles).</li>
  <li><strong>Leave out these letters</strong> — letters the word must not use (gray tiles).</li>
  <li><strong>Starts with / Ends with</strong> — handy when you know the beginning or ending, like words starting with ST or ending in -ER.</li>
  <li><strong>Contains the sequence</strong> — letters that must appear together, such as CH, OU or LL.</li>
</ul>
<p>Results are sorted with the most likely Wordle answers first, based on how common their letters are among the matching words. There are ${words[5].answers.length.toLocaleString()} common five-letter words and ${words[5].valid.length.toLocaleString()} valid ones in total.</p>
<p>The finder treats yellow letters as “somewhere in the word”. If you want the search to also use <em>where</em> a yellow letter isn't, and to handle repeated letters automatically, enter your guesses into the <a href="/">Wordle Helper</a> instead — it reads the full colored grid.</p>
<h2>Browse 5 letter words by letter</h2>
<p>Starting with: <span class="az-inline">${ABC.map((c) => `<a href="/5-letter-words/starting-with-${c}/">${c.toUpperCase()}</a>`).join(" ")}</span></p>
${helperCta()}
${f.html}
${related(pick("helper", "words", "dictionary", "unscrambler"))}
`,
  };
}

function dictionary({ words, daily }) {
  const f = faq([
    {
      q: "Is my word a valid Wordle word?",
      a: "<p>Type it into the box above. Common words are realistic answers; rarer words in our list are usually accepted as guesses but are unlikely to be the answer. Words not in the list — such as proper nouns, abbreviations and most plurals of four-letter words — normally aren't accepted.</p>",
    },
    {
      q: "Are plurals allowed in Wordle?",
      a: "<p>Plurals are usually accepted as guesses, but Wordle almost never uses a simple plural (like CATS) as the answer. Words that only look plural, such as GLASS or BONUS, can be answers.</p>",
    },
    {
      q: "Is this the official Wordle dictionary?",
      a: "<p>No. The New York Times does not publish its word list, and it changes over time. Our Wordle dictionary is built from SCOWL, a widely used open English word list, and closely tracks the kinds of words Wordle accepts.</p>",
    },
  ]);
  return {
    path: "/wordle-dictionary/",
    title: "Wordle Dictionary — Is It a Valid Wordle Word?",
    description: "Wordle dictionary search: check whether a word is valid in Wordle, whether it's a likely answer, and whether it has been a past Wordle answer.",
    priority: 0.7,
    breadcrumbs: [{ href: "/wordle-dictionary/", label: "Wordle Dictionary" }],
    scripts: ["/assets/js/dictionary.js"],
    schema: [f.schema],
    body: `
<h1>Wordle Dictionary</h1>
<p class="lead">Is it a real Wordle word? Type any word to check whether it's valid, whether it's a likely answer, and whether it has already been used.</p>
<section class="tool" data-dictionary aria-label="Wordle dictionary search">
  <form class="entry-row" autocomplete="off">
    <input id="dict-word" name="word" maxlength="7" placeholder="Type a word" autocapitalize="characters" spellcheck="false" aria-label="Word to check" required>
    <button class="btn" type="submit">Check word</button>
  </form>
  <div class="results" aria-live="polite"><noscript><p>The dictionary search needs JavaScript. See the full <a href="/wordle-word-list/">Wordle word list</a>.</p></noscript></div>
</section>
<h2>What the results mean</h2>
<ul>
  <li><strong>Valid and common</strong> — the word is one of our ${words[5].answers.length.toLocaleString()} likely five-letter answers. It's accepted as a guess and could be a future answer.</li>
  <li><strong>In the dictionary but rare</strong> — one of the ${(words[5].valid.length - words[5].answers.length).toLocaleString()} extra words accepted as guesses. Unusual words like these are rarely chosen as answers.</li>
  <li><strong>Not in the list</strong> — the word is probably misspelled, a proper noun, an abbreviation or a slang term.</li>
</ul>
<p>${daily.length ? `If the word was already a Wordle answer, the dictionary tells you which puzzle and when — useful because ` : "Knowing which words have already been used is useful because "}Wordle rarely repeats a recent answer. The full history is in our <a href="/wordle-answers/">past Wordle answers</a> archive.</p>
<p>The dictionary also checks 3, 4, 6 and 7-letter words for Wordle variants. Once you know your word is valid, see how it fits your game with the <a href="/">Wordle Helper</a>.</p>
${helperCta()}
${f.html}
${related(pick("helper", "list", "finder", "answers"))}
`,
  };
}

function wordList({ words }) {
  const { answers, valid, answerSet } = words[5];
  const rare = valid.filter((w) => !answerSet.has(w));
  const byLetter = ABC.map((c) => ({ c, list: answers.filter((w) => w[0] === c) })).filter((g) => g.list.length);
  const combos = (26 ** 5).toLocaleString();
  const f = faq([
    {
      q: "How many possible Wordle words are there?",
      a: `<p>Our list has ${answers.length.toLocaleString()} common five-letter words that make realistic answers, and ${valid.length.toLocaleString()} words in total that are valid guesses. That is a tiny fraction of the ${combos} possible five-letter letter combinations.</p>`,
    },
    {
      q: "Is this the official list of Wordle answers?",
      a: "<p>No. The New York Times curates its own answer list and does not publish it. Ours is an independent list of common English words, filtered to match the kinds of words Wordle uses as answers.</p>",
    },
    {
      q: "Can I download the word list?",
      a: `<p>Yes, as plain text: <a href="/assets/words/5-answers.txt">likely answers</a> and <a href="/assets/words/5-valid.txt">all valid guesses</a>.</p>`,
    },
  ]);
  return {
    path: "/wordle-word-list/",
    title: "Wordle Word List — All Possible Wordle Words (A–Z)",
    description: `The complete Wordle word list: ${answers.length.toLocaleString()} likely answers and ${valid.length.toLocaleString()} valid five-letter guesses, sorted A to Z. Free to browse and download.`,
    priority: 0.7,
    wide: true,
    breadcrumbs: [{ href: "/wordle-word-list/", label: "Wordle Word List" }],
    schema: [f.schema],
    body: `
<h1>Wordle Word List</h1>
<p class="lead">Every likely Wordle answer — ${answers.length.toLocaleString()} common five-letter words — sorted A to Z, plus ${rare.length.toLocaleString()} rarer words that are valid guesses.</p>
<ul class="az">${byLetter.map((g) => `<li><a href="#letter-${g.c}">${g.c.toUpperCase()}</a></li>`).join("")}</ul>
<h2>How this list is built</h2>
<p>Wordle accepts many more words as guesses than it uses as answers. Answers are everyday words; guesses can be almost any real five-letter word. This list mirrors that split. The <strong>likely answers</strong> are common English words with plurals (CATS), regular past tenses (ASKED) and offensive words removed, since Wordle avoids those. The <strong>valid guesses</strong> add rarer words such as AALII or ZOOID that you can play but will probably never see as an answer.</p>
<p>Use the list to plan openers, check spellings, or just browse. To filter it by your actual clues, use the <a href="/">Wordle Helper</a>; to search by letters, use the <a href="/5-letter-word-finder/">5 letter word finder</a>.</p>
${helperCta()}
<h2>Likely Wordle answers (${answers.length.toLocaleString()})</h2>
${byLetter.map((g) => `<h3 id="letter-${g.c}">${g.c.toUpperCase()} — ${g.list.length} words</h3>${wordGrid(g.list)}<p class="small"><a href="/5-letter-words/starting-with-${g.c}/">More 5 letter words starting with ${g.c.toUpperCase()} →</a></p>`).join("\n")}
<h2>Other valid guesses (${rare.length.toLocaleString()})</h2>
<details class="notice"><summary>Show all ${rare.length.toLocaleString()} rare valid words</summary>${wordGrid(rare)}</details>
<p>Download: <a href="/assets/words/5-answers.txt">likely answers (.txt)</a> · <a href="/assets/words/5-valid.txt">all valid words (.txt)</a></p>
${f.html}
${related(pick("helper", "dictionary", "finder", "words"))}
`,
  };
}

function unscrambler() {
  const f = faq([
    {
      q: "How does the Wordle unscrambler work?",
      a: "<p>It checks every word in our 3 to 7-letter dictionaries and keeps the ones that can be spelled using only your letters, each letter used no more often than you entered it. Results are grouped by length and sorted with the most common words first.</p>",
    },
    {
      q: "Can I use blank tiles or unknown letters?",
      a: "<p>Yes — type a question mark (?) for each unknown letter and it will stand in for any letter.</p>",
    },
    {
      q: "How does this help with Wordle?",
      a: `<p>Late in a Wordle game you often know which letters are in the word but not their order. Enter those letters plus a ? for each unknown one to see real words you can make. For the full picture, including which positions are ruled out, use the <a href="/">Wordle Helper</a>.</p>`,
    },
  ]);
  return {
    path: "/wordle-unscrambler/",
    title: "Wordle Unscrambler — What Words Can I Make With These Letters?",
    description: "Wordle unscrambler and scramble solver: enter your letters (use ? for blanks) to find every 3 to 7 letter word you can make, most common first.",
    priority: 0.6,
    breadcrumbs: [{ href: "/wordle-unscrambler/", label: "Wordle Unscrambler" }],
    scripts: ["/assets/js/unscrambler.js"],
    schema: [f.schema],
    body: `
<h1>Wordle Unscrambler</h1>
<p class="lead">What words can you make with these letters? Enter up to 12 letters — use ? for an unknown letter — and see every word you can spell.</p>
<section class="tool" data-unscrambler aria-label="Word unscrambler">
  <form autocomplete="off">
    <div class="entry-row">
      <input name="letters" maxlength="12" placeholder="e.g. RTAEC?" autocapitalize="characters" spellcheck="false" aria-label="Your letters" required>
      <button class="btn" type="submit">Unscramble</button>
    </div>
    <p class="small"><label><input type="checkbox" name="rare"> Include rare words</label></p>
  </form>
  <div class="results" aria-live="polite"><noscript><p>The unscrambler needs JavaScript.</p></noscript></div>
</section>
<h2>Using the scramble solver for Wordle</h2>
<p>When you have found most of the letters in a Wordle puzzle but can't see how they fit together, an unscrambler can jog your memory. Say you know the answer contains R, A, E and C: enter <code>RAEC?</code> and you will see CRANE, REACH, CRATE, TRACE, CARVE and more. Then use the colors you have already seen to pick between them — or let the <a href="/">Wordle Helper</a> do that part for you.</p>
<p>The unscrambler is also handy for anagram puzzles, Scrabble-style games and word jumbles. It searches 3 to 7-letter words and puts the most common words first; tick <em>Include rare words</em> to see the full dictionary.</p>
${helperCta()}
${f.html}
${related(pick("helper", "finder", "dictionary", "three"))}
`,
  };
}

export default function wordTools(ctx) {
  return [finder(ctx), dictionary(ctx), wordList(ctx), unscrambler(ctx)];
}
