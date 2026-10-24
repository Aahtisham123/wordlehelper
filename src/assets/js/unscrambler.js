import { unscramble, rankByFrequency } from "./engine.js";
import { loadWords } from "./words.js";

const root = document.querySelector("[data-unscrambler]");
const form = root.querySelector("form");
const out = root.querySelector(".results");

async function run() {
  const data = new FormData(form);
  const letters = String(data.get("letters") || "").toLowerCase().replace(/[^a-z?]/g, "");
  const rare = data.get("rare") === "on";
  out.replaceChildren();
  if (letters.length < 3) return;
  const lengths = [7, 6, 5, 4, 3].filter((n) => n <= letters.length);
  const lists = await Promise.all(lengths.map((n) => loadWords(n, rare ? "valid" : "answers")));
  let total = 0;
  lengths.forEach((n, i) => {
    const found = rankByFrequency(unscramble(lists[i], letters)).map((x) => x.word);
    if (!found.length) return;
    total += found.length;
    const h = document.createElement("h3");
    h.textContent = `${n}-letter words (${found.length})`;
    const grid = document.createElement("ul");
    grid.className = "word-grid";
    for (const w of found) {
      const li = document.createElement("li");
      li.textContent = w.toUpperCase();
      grid.append(li);
    }
    out.append(h, grid);
  });
  const status = document.createElement("p");
  status.className = "status";
  status.innerHTML = `<strong>${total.toLocaleString()}</strong> words can be made from ${letters.toUpperCase()}`;
  out.prepend(status);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  run();
});
form.addEventListener("change", run);
