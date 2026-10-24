import { matchWords, rankByFrequency } from "./engine.js";
import { loadWords } from "./words.js";

const root = document.querySelector("[data-finder]");
const form = root.querySelector("form");
const out = root.querySelector(".results");
const patternBox = root.querySelector(".pattern");

function drawPattern(n) {
  const old = Array.from(patternBox.querySelectorAll("input")).map((i) => i.value);
  patternBox.replaceChildren();
  for (let i = 0; i < n; i++) {
    const box = document.createElement("input");
    box.maxLength = 1;
    box.placeholder = " ";
    box.value = old[i] || "";
    box.setAttribute("aria-label", `Letter ${i + 1} (green)`);
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^a-z]/gi, "").slice(-1);
      if (box.value && box.nextElementSibling) box.nextElementSibling.focus();
      run();
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && box.previousElementSibling) box.previousElementSibling.focus();
    });
    patternBox.append(box);
  }
}

async function run() {
  const data = new FormData(form);
  const n = Number(data.get("length") || 5);
  const list = await loadWords(n, data.get("list") === "valid" ? "valid" : "answers");
  const pattern = Array.from(patternBox.querySelectorAll("input"), (i) => i.value.toLowerCase() || "?").join("");
  const found = matchWords(list, {
    pattern,
    starts: data.get("starts"),
    ends: data.get("ends"),
    contains: data.get("contains"),
    includes: data.get("includes"),
    excludes: data.get("excludes"),
  });
  const ranked = rankByFrequency(found).map((x) => x.word);
  out.replaceChildren();
  const status = document.createElement("p");
  status.className = "status";
  status.innerHTML = `<strong>${ranked.length.toLocaleString()}</strong> ${n}-letter ${ranked.length === 1 ? "word" : "words"} found`;
  const grid = document.createElement("ul");
  grid.className = "word-grid";
  for (const w of ranked.slice(0, 400)) {
    const li = document.createElement("li");
    li.textContent = w.toUpperCase();
    grid.append(li);
  }
  out.append(status, grid);
  if (ranked.length > 400) {
    const p = document.createElement("p");
    p.className = "small";
    p.textContent = `Showing the 400 most likely of ${ranked.length.toLocaleString()} words. Add more letters to narrow it down.`;
    out.append(p);
  }
}

form.addEventListener("input", (e) => {
  if (e.target.name === "length") drawPattern(Number(e.target.value));
  run();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  run();
});
form.addEventListener("reset", () => setTimeout(() => {
  drawPattern(5);
  run();
}));
drawPattern(Number(new FormData(form).get("length") || 5));
run();
