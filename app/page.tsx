import Link from "next/link";
import { AuthorBox, Faq, HeroImage, IconList, PageHeader, RelatedCards, Stats, Steps, Testimonials, type QA } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { HomeMethods } from "@/components/tools/HomeMethods";
import { getBenchmark, getOpeners, getTestimonials, getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/");
export const metadata = metadataFor(page);

export default function Home() {
  const five = getWords(5);
  const openers = getOpeners();
  const bench = getBenchmark();
  const top = openers[0];
  const answers = five.answers.length.toLocaleString();
  const valid = five.valid.length.toLocaleString();
  const afterTop = Math.round(five.answers.length / Math.pow(2, top.bits));
  const T = (w: string) => w.toUpperCase();
  const dist = Object.entries(bench.distribution as Record<string, number>).sort((a, b) => Number(a[0]) - Number(b[0]));

  const faqs: QA[] = [
    {
      q: "Is using a Wordle helper cheating?",
      text: "It depends on how you use it. Wordle has no prizes, so you can only cheat yourself or friends you compare scores with. Many players use a helper after they finish, or when they are stuck and want to learn.",
      a: (
        <p>
          It depends on how you use it. Wordle has no prizes and no rules about tools, so the only people you could cheat are yourself and the friends you compare scores with.
          Lots of players open a helper after they finish, or when they&apos;re truly stuck and would rather learn a new word than lose a streak. If you share results, just be
          honest about it. We cover this in more depth in <Link href="/guides/how-to-cheat-at-wordle/">is using a Wordle helper cheating?</Link>
        </p>
      ),
    },
    {
      q: "How many Wordle words are left after my guesses?",
      text: `The big number above the word list shows how many words still fit every clue you entered. Before any guess there are ${answers} likely answers. A strong opener such as ${T(top.word)} leaves about ${afterTop} on average.`,
      a: (
        <p>
          The big number above the word list shows exactly how many words still fit every clue you entered. Before your first guess there are {answers} likely answers. A strong
          opener like {T(top.word)} cuts that to about {afterTop} on average, and a good second guess usually leaves fewer than five.
        </p>
      ),
    },
    {
      q: "Which of the three methods should I use?",
      text: "Use Guess Grid if you want to copy your board exactly. Use Letter Clues if you only remember which letters are green, yellow or gray. Use Guided Solve if you want the helper to choose every guess for you.",
      a: (
        <IconList
          items={[
            <><strong>Guess Grid</strong> if you want to copy your board exactly. It&apos;s the most accurate because it knows where every yellow letter <em>isn&apos;t</em>.</>,
            <><strong>Letter Clues</strong> if you only remember which letters are green, yellow or gray. It&apos;s quick and simple.</>,
            <><strong>Guided Solve</strong> if you want the helper to pick every guess for you, one turn at a time.</>,
          ]}
        />
      ),
    },
    {
      q: "What is the best first word to use?",
      text: `Our tests rank ${openers.slice(0, 3).map((o: { word: string }) => T(o.word)).join(", ")} as the strongest openers against our answer list.`,
      a: (
        <p>
          Our tests rank {openers.slice(0, 3).map((o: { word: string }) => T(o.word)).join(", ")} as the strongest openers, because they split the possible answers into the most groups.
          See the full ranking in <Link href="/guides/best-wordle-starting-words/">best Wordle starting words</Link>.
        </p>
      ),
    },
    {
      q: "Does the Wordle solver handle double letters?",
      text: "Yes. It scores every word exactly the way Wordle does, so repeated letters are handled correctly.",
      a: (
        <p>
          Yes. It scores every word exactly the way Wordle does. Greens are matched first, then yellows from left to right. So if you guess SPEED and only one E turns yellow, the
          helper knows the answer has exactly one E.
        </p>
      ),
    },
    {
      q: "Does it work for hard mode and other word lengths?",
      text: "Yes. Picking from the possible answers list always keeps you hard-mode legal. For other lengths, use our 3, 4, 6 and 7 letter Wordle solvers.",
      a: (
        <p>
          Yes. Any word from the &ldquo;possible answers&rdquo; list follows hard-mode rules. For practice games use the <Link href="/wordle-unlimited-solver/">Wordle Unlimited solver</Link>,
          and for other lengths try the <Link href="/4-letter-wordle-solver/">4</Link>, <Link href="/6-letter-wordle-solver/">6</Link> or{" "}
          <Link href="/7-letter-wordle-solver/">7 letter Wordle solver</Link>.
        </p>
      ),
    },
    {
      q: "Is Wordle Helper free, and is it linked to the New York Times?",
      text: "It's completely free, needs no sign-up and runs in your browser. It is an independent fan site and is not affiliated with The New York Times.",
      a: (
        <p>
          It&apos;s completely free, needs no sign-up, and every calculation runs inside your own browser. {SITE.name} is an independent fan site; it isn&apos;t affiliated with or
          endorsed by The New York Times, which owns the Wordle trademark.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        page={page}
        showImage={false}
        lead={
          <>
            Pick the way you like to play: copy your board, type the letters you know, or let us guide every guess. Our Wordle solver shows every word that still fits and the
            smartest next move.
          </>
        }
      />

      <section className="card tool-card" aria-label="Wordle solver" id="solver">
        <HomeMethods opener={top.word} />
      </section>

      <Stats
        items={[
          { icon: "List", value: answers, label: "likely Wordle answers" },
          { icon: "BookA", value: valid, label: "valid guesses checked" },
          { icon: "Gauge", value: String(bench.average), label: "average guesses to win" },
          { icon: "Trophy", value: `${bench.solvedWithinSix}%`, label: "of puzzles solved in 6" },
        ]}
      />

      <section className="prose">
        <h2 id="three-ways">Three easy ways to solve today&apos;s Wordle</h2>
        <p>
          Everybody plays a little differently, so our Wordle helper gives you three methods. They all use the same word list and the same scoring rules, and you can switch
          between them at any time using the tabs above.
        </p>
        <ul className="cards">
          <li>
            <a href="#grid">
              <span className="card-icon"><Icon name="Grid3x3" /></span>
              <strong>1. Guess Grid</strong>
              <span className="desc">Type each word you played and tap its tiles to match your colors. Best when you want the most exact result.</span>
            </a>
          </li>
          <li>
            <a href="#clues">
              <span className="card-icon"><Icon name="TextSearch" /></span>
              <strong>2. Letter Clues</strong>
              <span className="desc">Fill in the green letters by position, then list your yellow and gray letters. Perfect for a quick check.</span>
            </a>
          </li>
          <li>
            <a href="#guided">
              <span className="card-icon"><Icon name="Route" /></span>
              <strong>3. Guided Solve</strong>
              <span className="desc">We pick each guess, you report the colors back. Great when you&apos;re out of ideas or want to learn.</span>
            </a>
          </li>
        </ul>

        <h2 id="how-to-use">How to use the Wordle Helper</h2>
        <p>The Guess Grid is the most popular method, and it only takes a few seconds:</p>
        <Steps
          items={[
            <><strong>Type the word you guessed</strong> and press <em>Add guess</em>. All of its tiles start gray.</>,
            <><strong>Tap each tile to match your game.</strong> One tap makes it yellow, two taps make it green, and a third tap turns it back to gray.</>,
            <><strong>Read your results.</strong> The count shows how many Wordle words remain, and the list shows them with the most likely first.</>,
            <><strong>Choose your next guess.</strong> Tap any word to drop it into the box, or take one of our suggested guesses.</>,
            <><strong>Repeat after each turn.</strong> Your board is saved in your browser, so you can close the tab and come back later today.</>,
          ]}
        />

        <HeroImage
          name="home-hero"
          alt={page.imageAlt ?? ""}
          caption="A Wordle board as our helper sees it: each row of colors rules out more words until only one answer is left."
        />

        <h2 id="how-it-works">How our Wordle solver works</h2>
        <p>
          Every colored tile is a small fact about the answer. A green R in the second spot means the answer has an R right there. A yellow A means there&apos;s an A somewhere else.
          A gray T usually means there&apos;s no T at all.
        </p>
        <p>
          Rather than juggling those rules one by one, our Wordle calculator asks a simple question about every word in its list: <em>&ldquo;If this were the answer, would my
          guesses have shown exactly these colors?&rdquo;</em> If the answer is yes, the word stays. If not, it&apos;s gone. Because we score words with Wordle&apos;s own rules,
          tricky cases with double letters come out right every time.
        </p>
        <p>
          Next, the helper ranks what&apos;s left. Words made of letters that are common among the remaining options, in the spots where those letters usually sit, move to the top.
          Finally, it looks for the guess that will teach you the most. A word that splits the remaining answers into many small groups is a better guess than one that leaves
          most of them together. You can read the full details in <Link href="/guides/how-wordle-helper-works/">how the Wordle Helper works</Link>.
        </p>

        <h2 id="tested">We tested it on every answer</h2>
        <p>
          A helper is only worth using if it actually works, so we let our solver play all {bench.games.toLocaleString()} likely answers by itself. It opened with{" "}
          {T(bench.opener)} every time and then always took its own top suggestion. Here&apos;s how it did:
        </p>
        <div className="table-wrap">
          <table>
            <caption className="visually-hidden">Number of guesses our solver needed across {bench.games} test games</caption>
            <thead>
              <tr>
                <th scope="col">Guesses needed</th>
                <th scope="col">Games</th>
                <th scope="col">Share</th>
              </tr>
            </thead>
            <tbody>
              {dist.map(([turns, games]) => (
                <tr key={turns}>
                  <td>{turns}</td>
                  <td>{games.toLocaleString()}</td>
                  <td>{((100 * games) / bench.games).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          On average it needed <strong>{bench.average} guesses</strong>, finished {bench.solvedWithinFour}% of games in four guesses or fewer, and solved {bench.solvedWithinSix}%
          within Wordle&apos;s six-guess limit. The hardest word for it was {T(bench.worst.word)}, a classic &ldquo;word trap&rdquo; where many answers differ by one letter. That&apos;s
          exactly why the suggestions sometimes include a helper word that can&apos;t be the answer: it&apos;s there to break a trap like that.
        </p>

        <h2 id="words-left">How many words are left in Wordle?</h2>
        <p>
          Our list holds <strong>{answers} likely answers</strong>. These are everyday five-letter words, without simple plurals like CATS or past tenses like ASKED, because Wordle
          almost never picks those. Another {(five.valid.length - five.answers.length).toLocaleString()} rarer words count as valid guesses. Tick <em>Include rare words</em> to search
          all {valid}, which helps with Wordle clones that use a bigger dictionary.
        </p>
        <p>
          The list shrinks fast. {T(top.word)} alone splits the answers into {top.buckets} different color patterns. After two good guesses, most games are down to a handful of
          words, and that&apos;s when the remaining-words count really helps.
        </p>

        <h2 id="tips">Quick tips for better results</h2>
        <IconList
          icon="Lightbulb"
          tone="amber"
          items={[
            <><strong>Try a guess or two on your own first.</strong> Then open the helper if you get stuck. You&apos;ll learn more and the win still feels like yours.</>,
            <><strong>If no words match, check your colors.</strong> One tile set to the wrong color is the usual cause.</>,
            <><strong>Watch for word traps.</strong> When many words share four letters, a <Link href="/guides/wordle-filler-words/">filler word</Link> can save your streak.</>,
            <><strong>Start strong.</strong> Openers built from R, A, I, S, E, T and L give the solver the most to work with.</>,
          ]}
        />
      </section>

      <Testimonials items={getTestimonials()} />

      <RelatedCards
        paths={["/wordle-hint-today/", "/wordle-guesser/", "/5-letter-word-finder/", "/wordle-dictionary/", "/wordle-word-list/", "/wordle-unscrambler/", "/wordle-answers/", "/guides/best-wordle-starting-words/", "/6-letter-wordle-solver/"]}
        title="More free Wordle tools"
      />

      <Faq items={faqs} />
      <AuthorBox />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE.name,
          url: `${SITE.url}/`,
          applicationCategory: "GameApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: page.description,
          image: `${SITE.url}/og/home.jpg`,
          publisher: { "@id": `${SITE.url}/#organization` },
          dateModified: page.updated,
          featureList: ["Guess Grid solver", "Letter Clues word finder", "Guided Solve", "Best next guess suggestions", "Hard mode friendly"],
        }}
      />
    </>
  );
}
