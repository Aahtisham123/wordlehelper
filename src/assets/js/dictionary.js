import { loadWords } from "./words.js";

const root = document.querySelector("[data-dictionary]");
const form = root.querySelector("form");
const input = form.querySelector("input");
const out = root.querySelector(".results");
let past = null;

async function check() {
  const word = input.value.toLowerCase().replace(/[^a-z]/g, "");
  out.replaceChildren();
  if (!word) return;
  const box = document.createElement("div");
  const W = word.toUpperCase();
  if (word.length < 3 || word.length > 7) {
    box.className = "verdict no";
    box.textContent = `${W} has ${word.length} letters. Classic Wordle uses 5-letter words; our dictionary covers 3 to 7 letters.`;
    out.append(box);
    return;
  }
  const [answers, valid] = await Promise.all([loadWords(word.length, "answers"), loadWords(word.length, "valid")]);
  if (!past) past = await fetch("/assets/words/past-answers.json").then((r) => (r.ok ? r.json() : [])).catch(() => []);
  const used = past.filter((p) => p[0] === word);
  const isFive = word.length === 5;
  const game = isFive ? "Wordle" : `${word.length}-letter Wordle-style games`;
  if (answers.includes(word)) {
    box.className = "verdict yes";
    box.innerHTML = `<strong>Yes — ${W} is a valid word</strong> and a common one, so it is a realistic answer in ${game}.`;
  } else if (valid.includes(word)) {
    box.className = "verdict maybe";
    box.innerHTML = `<strong>${W} is in our dictionary</strong> but it is rare, so it is unlikely to be an answer in ${game}. It may still be accepted as a guess.`;
  } else {
    box.className = "verdict no";
    box.innerHTML = `<strong>${W} is not in our word list.</strong> Check the spelling — plurals of shorter words, proper nouns and abbreviations are usually not accepted.`;
  }
  if (used.length) {
    const p = document.createElement("p");
    p.textContent = `${W} was already the Wordle answer for puzzle ${used.map((u) => `#${u[1]} (${u[2]})`).join(", ")}.`;
    box.append(p);
  }
  out.append(box);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  check();
});
