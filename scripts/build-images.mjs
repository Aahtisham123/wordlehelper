// Generates every image on the site from SVG templates:
//   public/images/*.webp   hero illustrations (1200×630, compressed WebP)
//   public/og/*.jpg        social sharing images, one per page (1200×630)
//   public/icon*.png, favicon.ico, apple-touch-icon.png, icon.svg
//
//   npm run images
//
// Text is drawn with the Inter font via fontconfig; install Inter locally
// before running. The output is committed, so builds don't need this step.

import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { PAGES, listSlugs, listPage, LIST_KINDS } from "../lib/registry.mjs";
import { getWords } from "../lib/data.mjs";

const root = process.cwd();
const W = 1200;
const H = 630;
const C = { green: "#1f9d74", yellow: "#e0a13a", gray: "#6b7686", brand: "#10856d", ink: "#0f1b2a", muted: "#5d6b7e" };
const FONT = "Inter, 'Inter Display', sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---- Lucide icons as raw SVG ---------------------------------------------
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([a-z])([0-9])/g, "$1$2").toLowerCase();
const iconCache = {};
async function iconNodes(name) {
  if (!iconCache[name]) {
    const file = { Grid3x3: "grid-3x3", BookA: "book-a" }[name] ?? kebab(name);
    let mod = await import(`lucide-react/dist/esm/icons/${file}.mjs`);
    if (!mod.__iconData) {
      // Renamed icons are re-exported from their new file.
      const src = readFileSync(join(root, `node_modules/lucide-react/dist/esm/icons/${file}.mjs`), "utf8");
      mod = await import(`lucide-react/dist/esm/icons/${/from '\.\/(.+)\.mjs'/.exec(src)[1]}.mjs`);
    }
    iconCache[name] = mod.__iconData.node;
  }
  return iconCache[name];
}
async function icon(name, x, y, size, color, stroke = 2) {
  const nodes = await iconNodes(name);
  const inner = nodes
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")}/>`)
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
}

function tile(x, y, s, letter, color, opts = {}) {
  const r = s * 0.2;
  const shadow = `<rect x="${x}" y="${y + s * 0.06}" width="${s}" height="${s}" rx="${r}" fill="#000" opacity="0.12"/>`;
  const box = color === "empty"
    ? `<rect x="${x + 2}" y="${y + 2}" width="${s - 4}" height="${s - 4}" rx="${r}" fill="#ffffff" fill-opacity="0.7" stroke="#c4cfdc" stroke-width="3" stroke-dasharray="10 8"/>`
    : `${shadow}<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" fill="${C[color]}"/><rect x="${x}" y="${y}" width="${s}" height="${s * 0.5}" rx="${r}" fill="#fff" opacity="0.08"/>`;
  const text = letter && color !== "empty"
    ? `<text x="${x + s / 2}" y="${y + s * 0.67}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${s * 0.5}" fill="#fff">${esc(letter)}</text>`
    : letter
      ? `<text x="${x + s / 2}" y="${y + s * 0.67}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${s * 0.5}" fill="#9aa8b8">${esc(letter)}</text>`
      : "";
  return `<g${opts.rotate ? ` transform="rotate(${opts.rotate} ${x + s / 2} ${y + s / 2})"` : ""}${opts.opacity ? ` opacity="${opts.opacity}"` : ""}>${box}${text}</g>`;
}

const colorOf = { g: "green", y: "yellow", x: "gray", e: "empty" };
function tileRow(word, pattern, x, y, s, gap) {
  return Array.from(word)
    .map((ch, i) => tile(x + i * (s + gap), y, s, ch === "_" ? "" : ch, colorOf[pattern[i]] ?? "gray"))
    .join("");
}

function background(accent, seed) {
  const a = accent;
  const dots = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 211 + seed * 97) % W;
    const y = (i * 137 + seed * 53) % H;
    return `<circle cx="${x}" cy="${y}" r="${3 + ((i + seed) % 3)}" fill="${a}" opacity="0.18"/>`;
  }).join("");
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2fbf8"/><stop offset="0.55" stop-color="#ffffff"/><stop offset="1" stop-color="#fff6e8"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.1" r="0.6"><stop offset="0" stop-color="${a}" stop-opacity="0.22"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.55"><stop offset="0" stop-color="#e0a13a" stop-opacity="0.2"/><stop offset="1" stop-color="#e0a13a" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#0f1b2a" stroke-opacity="0.04" stroke-width="1"/></pattern>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#0f1b2a" flood-opacity="0.16"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  ${dots}`;
}

async function badge(iconName, cx, cy, r, accent) {
  return `<g filter="url(#soft)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r - 16}" fill="${accent}" opacity="0.12"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="4 10"/>
  ${await icon(iconName, cx - r * 0.5, cy - r * 0.5, r, accent, 1.8)}`;
}

function sparkle(x, y, s, color) {
  return `<path d="M${x} ${y - s}C${x + s * 0.15} ${y - s * 0.15} ${x + s * 0.15} ${y - s * 0.15} ${x + s} ${y}C${x + s * 0.15} ${y + s * 0.15} ${x + s * 0.15} ${y + s * 0.15} ${x} ${y + s}C${x - s * 0.15} ${y + s * 0.15} ${x - s * 0.15} ${y + s * 0.15} ${x - s} ${y}C${x - s * 0.15} ${y - s * 0.15} ${x - s * 0.15} ${y - s * 0.15} ${x} ${y - s}Z" fill="${color}"/>`;
}

// ---- Hero illustrations ------------------------------------------------------
// rows: [word, pattern] pairs drawn as a mini board (pattern g/y/x/e).
const ILLUSTRATIONS = {
  "home-hero": { icon: "WandSparkles", accent: C.brand, rows: [["RAISE", "xyxxg"], ["CLOUT", "xxyxx"], ["HELPS", "ggggg"]] },
  hint: { icon: "Lightbulb", accent: C.yellow, rows: [["C____", "geeee"], ["CR___", "ggeee"], ["?????", "eeeee"]] },
  answers: { icon: "Archive", accent: "#2f6fd6", rows: [["PLANT", "ggggg"], ["EERIE", "ggggg"], ["CRANE", "ggggg"]] },
  guesser: { icon: "Target", accent: "#c2413b", rows: [["SLATE", "xyxxy"], ["MOREL", "xyxyy"], ["LOVER", "ggggg"]] },
  unlimited: { icon: "Infinity", accent: "#7c4dcc", rows: [["NYMPH", "xxxxx"], ["FJORD", "xxggg"], ["CHORD", "ggggg"]] },
  "solver-3": { icon: "Grid3x3", accent: C.brand, rows: [["CAT", "xgg"], ["HAT", "xgg"], ["BAT", "ggg"]] },
  "solver-4": { icon: "Grid3x3", accent: "#2f6fd6", rows: [["RATE", "yxxy"], ["HERO", "xgyx"], ["BEER", "gggg"]] },
  "solver-6": { icon: "Grid3x3", accent: C.yellow, rows: [["SAILOR", "xyxxyx"], ["ORANGE", "yxgxxx"], ["COBALT", "gggggg"]] },
  "solver-7": { icon: "Grid3x3", accent: "#7c4dcc", rows: [["RAINBOW", "xyxxxxx"], ["CAPTAIN", "gyxxxxx"], ["CHAPTER", "ggggggg"]] },
  finder: { icon: "TextSearch", accent: C.brand, rows: [["C_A_E", "geyeg"], ["CRATE", "ggggg"], ["CRANE", "ggggg"]] },
  dictionary: { icon: "BookA", accent: "#2f6fd6", rows: [["VALID", "ggggg"], ["WORDS", "ggggg"]] },
  "word-list": { icon: "List", accent: C.brand, rows: [["ABOUT", "ggggg"], ["BRAVE", "xyxxx"], ["ZESTY", "xxxxx"]] },
  unscrambler: { icon: "Shuffle", accent: C.yellow, rows: [["RTACE", "yyyyy"], ["TRACE", "ggggg"]] },
  "word-lists": { icon: "LetterText", accent: C.brand, rows: [["ABCDE", "gyxgy"], ["VWXYZ", "xgyxg"]] },
  guides: { icon: "GraduationCap", accent: C.brand, rows: [["LEARN", "ggggg"], ["SMART", "ggggg"]] },
  "guide-starting-words": { icon: "Trophy", accent: C.yellow, rows: [["RAISE", "ggggg"], ["SLATE", "ggggg"], ["ARISE", "ggggg"]] },
  "guide-tips": { icon: "Brain", accent: "#7c4dcc", rows: [["THINK", "xyxxx"], ["PLANS", "yxgxx"], ["SMART", "ggggg"]] },
  "guide-filler": { icon: "Puzzle", accent: C.yellow, rows: [["?ATCH", "egggg"], ["BLIMP", "xxxyx"], ["MATCH", "ggggg"]] },
  "guide-cheating": { icon: "Scale", accent: "#2f6fd6", rows: [["FAIR?", "ggggx"], ["PLAYS", "ggggg"]] },
  "guide-how-it-works": { icon: "Microscope", accent: C.brand, rows: [["LOGIC", "yxyxg"], ["RULES", "ggggg"]] },
  about: { icon: "Users", accent: C.brand, rows: [["ABOUT", "ggggg"], ["TEAMS", "gygxy"]] },
};

async function illustration(key, spec, seed) {
  const n = spec.rows[0][0].length;
  const s = n >= 7 ? 74 : n === 6 ? 84 : n === 3 ? 108 : 96;
  const gap = 14;
  const boardW = n * s + (n - 1) * gap;
  const boardH = spec.rows.length * s + (spec.rows.length - 1) * gap;
  const bx = 560 + (560 - boardW) / 2;
  const by = (H - boardH) / 2;
  const board = spec.rows.map(([w, p], i) => tileRow(w, p, bx, by + i * (s + gap), s, gap)).join("");
  const panel = `<g filter="url(#soft)"><rect x="${bx - 30}" y="${by - 30}" width="${boardW + 60}" height="${boardH + 60}" rx="34" fill="#fff" fill-opacity="0.75"/></g>`;
  const floaters = [
    tile(80, 70, 54, "W", "green", { rotate: -12, opacity: 0.9 }),
    tile(120, 480, 46, "?", "yellow", { rotate: 10, opacity: 0.85 }),
    tile(470, 540, 38, "", "gray", { rotate: -8, opacity: 0.5 }),
    tile(1110, 60, 40, "", "yellow", { rotate: 14, opacity: 0.55 }),
  ].join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${background(spec.accent, seed)}
  ${floaters}
  ${await badge(spec.icon, 300, 315, 150, spec.accent)}
  ${sparkle(470, 160, 22, spec.accent)}${sparkle(190, 150, 12, C.yellow)}${sparkle(1130, 560, 18, C.green)}
  ${panel}${board}
</svg>`;
  return svg;
}

// ---- Social images ---------------------------------------------------------
function wrap(text, max) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line += " " + w;
  }
  lines.push(line.trim());
  return lines;
}

const SECTION_LABEL = { home: "FREE WORDLE SOLVER", daily: "DAILY PUZZLE", solvers: "WORDLE SOLVER", words: "WORD TOOL", lists: "WORD LIST", guides: "WORDLE GUIDE", site: "WORDLE HELPER" };

async function ogImage(page, seed) {
  const accent = { daily: C.yellow, guides: "#7c4dcc", lists: "#2f6fd6", site: C.gray }[page.section] ?? C.brand;
  const title = page.heading;
  const lines = wrap(title, title.length > 34 ? 20 : 17).slice(0, 3);
  const size = lines.length >= 3 ? 64 : 74;
  const pillY = 148;
  const tY = pillY + 34 + 28 + size * 0.78;
  const titleSvg = lines.map((l, i) => `<text x="80" y="${tY + i * size * 1.12}" font-family="${FONT}" font-weight="800" font-size="${size}" fill="${C.ink}" letter-spacing="-1.5">${esc(l)}</text>`).join("");
  const sub = wrap(page.description, 52).slice(0, 2);
  const subY = tY + lines.length * size * 1.12 + 22;
  const subSvg = sub.map((l, i) => `<text x="80" y="${subY + i * 36}" font-family="${FONT}" font-weight="500" font-size="26" fill="${C.muted}">${esc(l)}${i === 1 && sub.length === 2 && page.description.length > 104 ? "…" : ""}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${background(accent, seed)}
  <g transform="translate(80 64)">
    <rect width="26" height="26" rx="7" fill="${C.gray}"/><rect x="30" width="26" height="26" rx="7" fill="${C.yellow}"/>
    <rect y="30" width="26" height="26" rx="7" fill="${C.green}"/><rect x="30" y="30" width="26" height="26" rx="7" fill="${C.brand}"/>
    <path d="M37 43.5l4.5 4.5L50 38" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="74" y="38" font-family="${FONT}" font-weight="800" font-size="30" fill="${C.ink}">Wordle<tspan fill="${C.brand}">Helper</tspan></text>
  </g>
  <g transform="translate(80 ${pillY})"><rect width="${SECTION_LABEL[page.section].length * 11.5 + 36}" height="34" rx="17" fill="${accent}" fill-opacity="0.14"/>
  <text x="18" y="23" font-family="${FONT}" font-weight="800" font-size="16" letter-spacing="1.5" fill="${accent}">${SECTION_LABEL[page.section]}</text></g>
  ${titleSvg}
  ${subSvg}
  <text x="80" y="574" font-family="${FONT}" font-weight="700" font-size="24" fill="${C.brand}">wordlehelp.co</text>
  ${await badge(page.icon, 1000, 300, 118, accent)}
  ${tile(905, 460, 58, "", "green", { rotate: -8 })}${tile(975, 478, 58, "", "yellow", { rotate: 6 })}${tile(1045, 458, 58, "", "gray", { rotate: -4 })}
  ${sparkle(880, 150, 18, accent)}${sparkle(1120, 170, 12, C.yellow)}
</svg>`;
  return svg;
}

// ---- App icons ---------------------------------------------------------------
function logoSvg(size, { padding = 0, bg = null, radius = 0 } = {}) {
  const inner = size - padding * 2;
  const k = inner / 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` : ""}
  <g transform="translate(${padding} ${padding}) scale(${k})">
    <rect x="4" y="4" width="26" height="26" rx="7" fill="${C.gray}"/>
    <rect x="34" y="4" width="26" height="26" rx="7" fill="${C.yellow}"/>
    <rect x="4" y="34" width="26" height="26" rx="7" fill="${C.green}"/>
    <rect x="34" y="34" width="26" height="26" rx="7" fill="${C.brand}"/>
    <path d="M41 47.5l4.5 4.5L54 42" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

// Minimal ICO container holding PNG images.
function ico(pngs) {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

// ---- Run -----------------------------------------------------------------------
const pub = join(root, "public");
for (const d of ["images", "og"]) {
  rmSync(join(pub, d), { recursive: true, force: true });
  mkdirSync(join(pub, d), { recursive: true });
}

let total = 0;
let seed = 1;
for (const [key, spec] of Object.entries(ILLUSTRATIONS)) {
  const buf = await sharp(Buffer.from(await illustration(key, spec, seed++))).webp({ quality: 74, effort: 6, smartSubsample: true }).toBuffer();
  writeFileSync(join(pub, "images", `${key}.webp`), buf);
  total += buf.length;
}
console.log(`Illustrations: ${Object.keys(ILLUSTRATIONS).length} WebP files, ${(total / 1024).toFixed(0)} KB total`);

const five = getWords(5);
const lists = listSlugs(five.valid).map(({ slug, kind, letter }) => {
  const all = five.valid.filter(LIST_KINDS[kind].test(letter));
  return listPage(slug, { all: all.length, common: all.filter((w) => five.answerSet.has(w)).length });
});
total = 0;
for (const page of [...PAGES, ...lists]) {
  const buf = await sharp(Buffer.from(await ogImage(page, seed++))).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  writeFileSync(join(pub, "og", `${page.og}.jpg`), buf);
  total += buf.length;
}
console.log(`Social images: ${PAGES.length + lists.length} JPEG files, ${(total / 1024).toFixed(0)} KB total`);

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(join(pub, "icon.svg"), logoSvg(64));
writeFileSync(join(pub, "icon-192.png"), await png(logoSvg(512, { padding: 40 }), 192));
writeFileSync(join(pub, "icon-512.png"), await png(logoSvg(512, { padding: 40 }), 512));
writeFileSync(join(pub, "icon-maskable-512.png"), await png(logoSvg(512, { padding: 96, bg: "#ffffff" }), 512));
writeFileSync(join(pub, "apple-touch-icon.png"), await png(logoSvg(180, { padding: 22, bg: "#ffffff" }), 180));
const icoPngs = [];
for (const size of [16, 32, 48]) icoPngs.push({ size, data: await png(logoSvg(64, { padding: size <= 16 ? 0 : 2 }), size) });
writeFileSync(join(pub, "favicon.ico"), ico(icoPngs));
console.log("App icons: favicon.ico, icon.svg, icon-192/512, maskable, apple-touch-icon");
