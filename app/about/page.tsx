import Link from "next/link";
import { HelperCta, IconList, PageHeader, Stats } from "@/components/Content";
import { getBenchmark, getWords } from "@/lib/data.mjs";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/about/");
export const metadata = metadataFor(page);

export default function About() {
  const bench = getBenchmark();
  const five = getWords(5);
  return (
    <>
      <PageHeader page={page} trail={[{ href: page.path, label: "About" }]} lead={`${SITE.name} is a free, independent set of tools for people who love Wordle and want to get better at it.`} />
      <Stats
        items={[
          { icon: "List", value: five.answers.length.toLocaleString(), label: "likely answers in our list" },
          { icon: "Gauge", value: String(bench.average), label: "average guesses in our tests" },
          { icon: "Lock", value: "0", label: "guesses sent to our servers" },
        ]}
      />
      <section className="prose">
        <h2>Why we built Wordle Helper</h2>
        <p>
          We built {SITE.domain} because we wanted Wordle tools that are fast, accurate and honest about how they work. Plenty of solvers simply list words. We wanted one that
          explains <em>why</em> a guess is smart, handles tricky double letters properly, and treats spoilers with care.
        </p>
        <p>
          The main <Link href="/">Wordle Helper</Link> gives you three ways to solve, the <Link href="/wordle-guesser/">Wordle guesser</Link> ranks your best next move, and our{" "}
          <Link href="/guides/">guides</Link> explain the strategy in plain English.
        </p>
        <h2>How we work</h2>
        <IconList
          icon="BadgeCheck"
          items={[
            <><strong>We test, then publish.</strong> Every claim about our solver comes from running it against every likely answer. The current results: {bench.average} guesses on average and {bench.solvedWithinSix}% solved within six.</>,
            <><strong>We show our sources.</strong> Our word lists come from SCOWL, an open English word list, and we explain <Link href="/guides/how-wordle-helper-works/">exactly how we use it</Link>.</>,
            <><strong>We protect your privacy.</strong> The tools run in your browser. Your guesses never leave your device.</>,
            <><strong>We respect spoilers.</strong> Answers are always hidden until you choose to reveal them.</>,
          ]}
        />
        <h2>Editorial policy</h2>
        <p>
          Our guides are written in simple English so anyone can follow them. We review each page when our word lists or tools change and show the &ldquo;last updated&rdquo; date at
          the top. If you spot a mistake, please <Link href="/contact/">contact us</Link> and we&apos;ll fix it.
        </p>
        <h2>Not affiliated with The New York Times</h2>
        <p>
          Wordle is a trademark of The New York Times Company. {SITE.name} is a fan-made site and isn&apos;t affiliated with, endorsed by or sponsored by The New York Times. Read our
          full <Link href="/disclaimer/">disclaimer</Link>.
        </p>
      </section>
      <HelperCta title="Ready to play?" />
    </>
  );
}
