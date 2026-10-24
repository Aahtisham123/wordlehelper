import { SITE, NAV, FOOTER, esc } from "./site.mjs";

function navHtml(current) {
  const item = (l) => `<a href="${l.href}"${l.href === current ? ' aria-current="page"' : ""}>${esc(l.label)}</a>`;
  return NAV.map((n) =>
    n.children
      ? `<details class="nav-group"><summary>${esc(n.label)}</summary><div class="nav-menu">${n.children.map(item).join("")}</div></details>`
      : item(n)
  ).join("");
}

function footerHtml() {
  return FOOTER.map(
    (col) => `<div><h2>${esc(col.title)}</h2><ul>${col.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul></div>`
  ).join("");
}

export function breadcrumbs(trail) {
  if (!trail || trail.length === 0) return { html: "", schema: null };
  const all = [{ href: "/", label: "Wordle Helper" }, ...trail];
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${all
    .map((c, i) => (i === all.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`))
    .join("")}</ol></nav>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE.url + c.href })),
  };
  return { html, schema };
}

export function faq(items) {
  const html = `<section class="faq"><h2>Frequently asked questions</h2>${items
    .map((q) => `<details><summary>${esc(q.q)}</summary><div>${q.a}</div></details>`)
    .join("")}</section>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a.replace(/<[^>]+>/g, "") },
    })),
  };
  return { html, schema };
}

// The internal link every page carries back to the homepage tool.
export function helperCta(text = "Stuck on a puzzle?") {
  return `<aside class="cta"><p><strong>${esc(text)}</strong> Enter your guesses and colors into our <a href="/">Wordle Helper</a> to see every word that still fits, ranked by how likely it is.</p><a class="btn" href="/">Open the Wordle Helper</a></aside>`;
}

export function related(links) {
  return `<section class="related"><h2>More Wordle tools</h2><ul class="cards">${links
    .map((l) => `<li><a href="${l.href}"><strong>${esc(l.label)}</strong><span>${esc(l.text)}</span></a></li>`)
    .join("")}</ul></section>`;
}

export function wordGrid(words, { common, limit } = {}) {
  const list = limit ? words.slice(0, limit) : words;
  return `<ul class="word-grid">${list.map((w) => `<li${common && common.has(w) ? ' class="common"' : ""}>${w.toUpperCase()}</li>`).join("")}</ul>`;
}

// Placeholder markup for the interactive solver. solver-ui.js takes over.
export function solverWidget({ length = 5, mode = "helper", list = "answers", heading = true } = {}) {
  const rows = length >= 6 ? 7 : 6;
  return `<div class="solver" data-solver data-length="${length}" data-mode="${mode}" data-list="${list}" data-rows="${rows}">
  <form class="solver-entry" autocomplete="off">
    <label for="guess-${length}-${mode}">${heading ? `Type a ${length}-letter guess, then tap its tiles to set the colors` : "Your guess"}</label>
    <div class="entry-row">
      <input id="guess-${length}-${mode}" name="guess" inputmode="text" autocapitalize="characters" spellcheck="false" maxlength="${length}" pattern="[A-Za-z]{${length}}" placeholder="${"?".repeat(length)}" required>
      <button type="submit" class="btn">Add guess</button>
    </div>
    <p class="legend"><span class="tile-key gray">Gray</span> not in the word · <span class="tile-key yellow">Yellow</span> wrong spot · <span class="tile-key green">Green</span> right spot</p>
  </form>
  <div class="board" aria-live="polite"></div>
  <div class="solver-controls">
    <label><input type="checkbox" name="all-words"${list === "valid" ? " checked" : ""}> Include rare words (all ${length}-letter valid guesses)</label>
    <button type="button" class="btn ghost" data-reset>Clear board</button>
  </div>
  <div class="results">
    <noscript><p>The Wordle Helper needs JavaScript to filter words. You can still browse the <a href="/wordle-word-list/">full Wordle word list</a>.</p></noscript>
    <p class="status">Loading word list…</p>
  </div>
</div>`;
}

export function render(page, { css, buildDate }) {
  const canonical = SITE.url + page.path;
  const title = page.title.includes(SITE.name) || page.path === "/" ? page.title : `${page.title} | ${SITE.name}`;
  const crumbs = breadcrumbs(page.breadcrumbs);
  const schemas = [...(page.schema || []), crumbs.schema].filter(Boolean);
  const scripts = (page.scripts || []).map((s) => `<script type="module" src="${s}"></script>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add("js")</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#14806a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${css}">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/" aria-label="Wordle Helper home"><span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i></span>Wordle Helper</a>
    <button type="button" class="nav-button" aria-expanded="false" aria-controls="site-nav" hidden>Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">${navHtml(page.path)}</nav>
  </div>
</header>
<main id="main" class="wrap${page.wide ? " wide" : ""}">
${crumbs.html}
${page.body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-cols">${footerHtml()}</div>
    <p class="disclaimer"><strong>Not affiliated with The New York Times.</strong> Wordle is a trademark of The New York Times Company. ${SITE.name} (${SITE.domain}) is an independent fan-made tool and is not endorsed by, sponsored by or connected to The New York Times. See our <a href="/disclaimer/">disclaimer</a>.</p>
    <p class="small">© ${buildDate.slice(0, 4)} ${SITE.name}. Word lists based on <a href="http://wordlist.aspell.net/">SCOWL</a> by Kevin Atkinson (<a href="/LICENSE-SCOWL.txt">license</a>).</p>
  </div>
</footer>
<script>
(() => {
  const btn = document.querySelector(".nav-button");
  const nav = document.getElementById("site-nav");
  btn.hidden = false;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  // Close dropdown menus when clicking elsewhere.
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-group[open]").forEach((d) => d.contains(e.target) || d.removeAttribute("open"));
  });
})();
</script>
${scripts}
</body>
</html>
`;
}
