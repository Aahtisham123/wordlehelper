import { faq, solverWidget, related } from "../lib/layout.mjs";
import { SITE } from "../lib/site.mjs";
import { pick } from "../lib/tools.mjs";

export default function home({ words, openers }) {
  const answers = words[5].answers.length.toLocaleString();
  const valid = words[5].valid.length.toLocaleString();
  const top = openers[0];
  const afterTop = Math.round(words[5].answers.length / Math.pow(2, top.bits));
  const questions = [
    {
      q: "Is using a Wordle helper cheating?",
      a: `<p>It depends on how you use it. Wordle has no prize and no official rules about tools, so the only person you can “cheat” is yourself — and anyone you compare streaks with. Many players use a Wordle helper after they finish to see what they could have played, or when they are completely stuck and would rather learn something than lose a streak. If you share scores with friends, the fair thing is to tell them. We wrote a longer answer in <a href="/guides/how-to-cheat-at-wordle/">Is using a Wordle helper cheating?</a></p>`,
    },
    {
      q: "How many words are left after my guesses?",
      a: `<p>The number at the top of the results is the count of words still possible after every clue you entered. Before any guess there are ${answers} likely answers in our list. A strong first guess such as ${top.word.toUpperCase()} leaves about ${afterTop} on average, and most games are down to a handful of words after the second guess.</p>`,
    },
    {
      q: "What is the best first word to use with the Wordle solver?",
      a: `<p>By our calculation, ${openers.slice(0, 5).map((o) => o.word.toUpperCase()).join(", ")} are the strongest openers against our answer list, because they split the possible answers into the most groups. See the full ranking in <a href="/guides/best-wordle-starting-words/">best Wordle starting words</a>.</p>`,
    },
    {
      q: "Which word list does the Wordle Helper use?",
      a: `<p>The default list holds ${answers} common five-letter words that are realistic Wordle answers. Tick “Include rare words” to search all ${valid} words that are accepted as guesses. The lists come from SCOWL, a long-standing open English word list, filtered to remove plurals, past tenses and offensive words that Wordle does not use as answers. They are not the official New York Times list, which changes over time.</p>`,
    },
    {
      q: "Does the Wordle Helper handle repeated letters?",
      a: `<p>Yes. It scores every word the same way Wordle does: greens are matched first, then yellows from left to right, and a gray copy of a letter means the answer has no further copies of it. So if you guess SPEED and only one E turns yellow, the helper knows the answer has exactly one E.</p>`,
    },
    {
      q: "Does it work for hard mode, Wordle Unlimited and other word lengths?",
      a: `<p>Yes. The suggested guesses always fit your clues when you pick one from the “possible answers” list, which keeps you hard-mode legal. For unlimited and practice games use the <a href="/wordle-unlimited-solver/">Wordle Unlimited solver</a>, and for other lengths try the <a href="/3-letter-wordle-solver/">3</a>, <a href="/4-letter-wordle-solver/">4</a>, <a href="/6-letter-wordle-solver/">6</a> and <a href="/7-letter-wordle-solver/">7 letter Wordle solvers</a>.</p>`,
    },
    {
      q: "Is Wordle Helper affiliated with the New York Times?",
      a: `<p>No. ${SITE.name} is an independent, free fan tool. Wordle is a trademark of The New York Times Company, which does not endorse or sponsor this site.</p>`,
    },
  ];
  const f = faq(questions);
  return {
    path: "/",
    title: "Wordle Helper — Free Wordle Solver & Word Finder",
    description: `Free Wordle Helper: enter your green, yellow and gray letters to see every possible answer ranked by likelihood, plus the best next guess. Works with hard mode.`,
    priority: 1.0,
    changefreq: "weekly",
    scripts: ["/assets/js/solver-ui.js"],
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url + "/",
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: SITE.name,
        url: SITE.url + "/",
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: "A Wordle solver that filters possible answers from your clues and suggests the best next guess.",
      },
      f.schema,
    ],
    body: `
<h1>Wordle Helper</h1>
<p class="lead">Type each guess, tap the tiles until they match the colors you got, and the Wordle solver shows every word that is still possible — most likely first — plus the guess that narrows things down fastest.</p>
<section class="tool" aria-label="Wordle solver">
${solverWidget({ length: 5, mode: "helper" })}
</section>
<p class="small">Want spoiler-free clues instead? See <a href="/wordle-hint-today/">today's Wordle hint</a>.</p>

<h2>How to use the Wordle Helper</h2>
<ol>
  <li><strong>Enter the word you guessed</strong> in the box and press <em>Add guess</em>. All of its tiles start gray.</li>
  <li><strong>Tap each tile to set its color.</strong> One tap makes it yellow (the letter is in the word but in a different spot), a second tap makes it green (right letter, right spot), and a third tap returns it to gray (the letter is not in the word).</li>
  <li><strong>Read the results.</strong> The helper instantly lists every word that matches all of your clues and tells you how many words remain.</li>
  <li><strong>Pick your next guess.</strong> Tap any word to drop it into the input box. The <em>Suggested next guess</em> box shows the words that will rule out the most possibilities.</li>
  <li><strong>Repeat</strong> after each turn. Your board is saved in your browser, so you can come back to it later today.</li>
</ol>
<p>If a letter you already confirmed as green appears in the same spot in your next guess, the helper sets it to green for you. Made a mistake? Tap the tile again, or remove the whole row with the × button.</p>

<h2>How this Wordle solver works</h2>
<p>Every Wordle clue is a rule about the answer. A green R in the second spot means the answer has an R there. A yellow A in the third spot means the answer contains an A, but not in that position. A gray T means there is no T at all — or, if you guessed two Ts and only one was colored, that the answer has exactly one.</p>
<p>Instead of turning those clues into a checklist, the Wordle Helper does something simpler and more reliable: for every word in its dictionary, it asks <em>“if this were the answer, would my guesses have produced exactly these colors?”</em> Words that pass every check stay on the list; everything else is removed. Because the colors are calculated with Wordle's own rules for repeated letters, tricky cases like guessing EERIE or LLAMA are handled correctly.</p>
<p>The remaining words are then <strong>ranked</strong>. Words built from letters that are common among the remaining candidates — in the positions where those letters usually appear — are listed first, because they are more likely to be the answer. You can read the full explanation in <a href="/guides/how-wordle-helper-works/">how the Wordle Helper works</a>.</p>

<h3>The best next guess</h3>
<p>The most likely answer is not always the best next guess. When ten words are left that differ only by their first letter (think HATCH, BATCH, CATCH, LATCH, MATCH, PATCH…), guessing them one by one can cost you the game. A guess that tests several of those first letters at once may not be the answer, but it can guarantee you solve the puzzle on the following turn.</p>
<p>The <em>Suggested next guess</em> box measures this as <strong>information</strong>. For each candidate guess, the solver works out every color pattern it could produce against the remaining words, and how evenly it splits them into groups. A guess that splits 100 words into 60 small groups is far more useful than one that leaves 80 of them in the same group. The score is shown in bits: every extra bit roughly halves the number of words left. Guesses marked <span class="pill">could be the answer</span> also give you a chance to win right away. For a deeper ranking, use the <a href="/wordle-guesser/">Wordle guesser</a>.</p>

<h2>How many Wordle words are left?</h2>
<p>Our default list has <strong>${answers} likely answers</strong> — common five-letter words that are not plurals or simple past tenses, because Wordle almost never uses those as solutions. Another ${(words[5].valid.length - words[5].answers.length).toLocaleString()} rarer words are accepted as guesses; tick <em>Include rare words</em> to search all ${valid} of them, which is useful for Wordle clones that pick from a wider list.</p>
<p>The count shrinks quickly. A first guess like ${top.word.toUpperCase()} splits the answers into ${top.buckets} different color patterns and leaves about ${afterTop} words on average. After a second well-chosen guess, most games are down to fewer than five possibilities — that is why the solver usually finds the answer within four turns.</p>

<h2>Tips for getting the most out of the Wordle Helper</h2>
<ul>
  <li><strong>Try solving first.</strong> Make your first two guesses on your own, then open the helper only if you are stuck. You will improve faster and the win still feels like yours.</li>
  <li><strong>Double-check your colors.</strong> If the helper says no words match, one tile is almost always set to the wrong color.</li>
  <li><strong>Use a filler word when many words remain.</strong> If the list shows lots of words with the same pattern, a guess that tests several of the differing letters at once is often smarter. Our guide to <a href="/guides/wordle-filler-words/">Wordle filler words</a> explains when.</li>
  <li><strong>Start strong.</strong> Openers that use common letters such as R, A, I, S, E, T and L give the solver the most to work with. See the <a href="/guides/best-wordle-starting-words/">best Wordle starting words</a>.</li>
</ul>
${related(pick("guesser", "finder", "dictionary", "list", "unscrambler", "unlimited", "four", "six", "seven", "hint", "answers", "words"))}
${f.html}
`,
  };
}
