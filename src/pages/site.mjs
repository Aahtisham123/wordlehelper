import { SITE } from "../lib/site.mjs";
import { helperCta } from "../lib/layout.mjs";

const page = (path, label, title, description, body) => ({
  path,
  title,
  description,
  priority: 0.2,
  changefreq: "yearly",
  breadcrumbs: [{ href: path, label }],
  body: `<h1>${label}</h1>\n${body}`,
});

export default function sitePages({ buildDate }) {
  const updated = `<p class="small">Last updated: ${buildDate}</p>`;
  return [
    page(
      "/about/",
      "About Wordle Helper",
      "About Wordle Helper",
      `About ${SITE.name}: a free, independent set of Wordle tools — a Wordle solver, word finder, daily hints and guides.`,
      `<p class="lead">${SITE.name} is a free, independent toolkit for Wordle players.</p>
<p>We built ${SITE.domain} because we love Wordle and wanted tools that are fast, accurate and honest about how they work. The main <a href="/">Wordle Helper</a> filters possible answers from your guesses using Wordle's own scoring rules, and the <a href="/wordle-guesser/">Wordle guesser</a> suggests the guess that teaches you the most.</p>
<p>Alongside the solvers you'll find <a href="/wordle-hint-today/">daily hints</a> that reveal as little or as much as you want, an <a href="/wordle-answers/">archive of past answers</a>, <a href="/5-letter-words/">word lists</a> and <a href="/guides/">strategy guides</a>.</p>
<h2>Our principles</h2>
<ul>
  <li><strong>Free and fast.</strong> No sign-up. Everything runs in your browser.</li>
  <li><strong>Private.</strong> Your guesses never leave your device.</li>
  <li><strong>Transparent.</strong> We explain <a href="/guides/how-wordle-helper-works/">how the helper works</a>, including where our word lists come from.</li>
  <li><strong>Spoiler-aware.</strong> Answers are always hidden until you choose to reveal them.</li>
</ul>
<h2>Not affiliated with The New York Times</h2>
<p>Wordle is a trademark of The New York Times Company. ${SITE.name} is a fan-made site and is not affiliated with, endorsed by or sponsored by The New York Times. Read our full <a href="/disclaimer/">disclaimer</a>.</p>
${helperCta("Ready to play?")}`
    ),
    page(
      "/contact/",
      "Contact",
      "Contact Wordle Helper",
      `How to contact ${SITE.name} with questions, feedback, word list corrections or bug reports.`,
      `<p class="lead">Questions, feedback, a word we're missing or a bug to report? We'd love to hear from you.</p>
<p>Email us at <a href="mailto:${SITE.email}">${SITE.email}</a>. We read every message and reply to most within a few days.</p>
<h2>Helpful details to include</h2>
<ul>
  <li><strong>Word list corrections</strong> — the word, and the game you saw it in.</li>
  <li><strong>Bug reports</strong> — the page, your device and browser, and the guesses and colors you entered.</li>
  <li><strong>Hint corrections</strong> — the puzzle number and date.</li>
</ul>
<p>Please don't email us asking for an advance copy of tomorrow's answer — we only publish hints once a puzzle is live. Stuck on today's puzzle? The <a href="/">Wordle Helper</a> can get you there.</p>`
    ),
    page(
      "/privacy/",
      "Privacy Policy",
      "Privacy Policy",
      `Privacy policy for ${SITE.domain}: what data we collect, how the Wordle Helper stores your board locally, and your choices.`,
      `${updated}
<p>This policy explains what information ${SITE.name} (“we”, “us”) collects when you use ${SITE.domain} (the “Site”).</p>
<h2>Information you enter into our tools</h2>
<p>The guesses, letters and words you type into the <a href="/">Wordle Helper</a> and other tools are processed entirely in your web browser. They are not sent to us. To keep your board when you reload the page, the Wordle Helper saves it in your browser's local storage on your own device. You can clear it at any time with the “Clear board” button or by clearing your browser's site data.</p>
<h2>Server logs</h2>
<p>Like most websites, the servers that host the Site may automatically record standard request information such as your IP address, browser type, the page requested and the time of the request. This is used to keep the Site secure and running and is not used to identify you.</p>
<h2>Cookies, analytics and advertising</h2>
<p>The Site does not currently set its own cookies. If we add analytics or advertising services in the future, those services may use cookies or similar technologies, and we will update this policy to describe them and any choices available to you before they are enabled.</p>
<h2>Email</h2>
<p>If you email us, we use your email address and message only to reply to you and to improve the Site. We do not sell or share it.</p>
<h2>Children</h2>
<p>The Site is suitable for a general audience and does not knowingly collect personal information from children.</p>
<h2>Changes and contact</h2>
<p>We may update this policy from time to time; the date above shows the latest version. Questions? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>`
    ),
    page(
      "/terms/",
      "Terms of Use",
      "Terms of Use",
      `Terms of use for ${SITE.domain} and the Wordle Helper tools.`,
      `${updated}
<p>By using ${SITE.domain} (the “Site”) you agree to these terms.</p>
<h2>Use of the Site</h2>
<p>The Site and its tools, including the <a href="/">Wordle Helper</a>, are provided free for personal, non-commercial use. You may not copy or republish substantial parts of the Site, scrape it in a way that burdens our servers, or use it for any unlawful purpose.</p>
<h2>Accuracy</h2>
<p>We work hard to keep our word lists, hints and answers accurate, but the Site is provided “as is”, without warranties of any kind. Word games may use different dictionaries from ours, and we cannot guarantee that a suggested word is the answer to any particular puzzle.</p>
<h2>Intellectual property</h2>
<p>The Site's design, text and code belong to ${SITE.name}. Word lists are derived from SCOWL, copyright Kevin Atkinson and contributors, and used under its license. Wordle is a trademark of The New York Times Company; see our <a href="/disclaimer/">disclaimer</a>.</p>
<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, ${SITE.name} is not liable for any loss arising from your use of the Site — including broken streaks.</p>
<h2>Changes</h2>
<p>We may update these terms at any time. Continued use of the Site means you accept the updated terms. Questions? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>`
    ),
    page(
      "/disclaimer/",
      "Disclaimer",
      "Disclaimer — Not Affiliated with The New York Times",
      `${SITE.name} is an independent fan site and is not affiliated with, endorsed by or sponsored by The New York Times.`,
      `<p class="lead"><strong>${SITE.name} is not affiliated with The New York Times.</strong></p>
<p>Wordle® is a registered trademark of The New York Times Company. ${SITE.name} (${SITE.domain}) is an independent, fan-made website that provides tools, hints and guides for players. It is not affiliated with, endorsed by, sponsored by or otherwise connected to The New York Times Company or the creator of Wordle.</p>
<p>We use the name “Wordle” only to describe the game our tools help with. We do not use The New York Times' logos, and our tools do not reproduce the game itself.</p>
<p>Hints and answers on this site are published for players who want them, and are always hidden behind a reveal so you don't see them by accident. Our word lists are our own and are not the official Wordle word list.</p>
<p>To play the official game, visit The New York Times website. To get help with it, use our <a href="/">Wordle Helper</a>.</p>`
    ),
  ];
}
