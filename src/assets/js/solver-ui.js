import { filterCandidates, rankByFrequency, bestGuesses } from "./engine.js";
import { loadWords } from "./words.js";

const COLORS = ["gray", "yellow", "green"];
const el = (tag, attrs = {}, text) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else node.setAttribute(k, v);
  }
  if (text != null) node.textContent = text;
  return node;
};

function storageGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the board just won't be remembered */
  }
}

function initSolver(root) {
  const length = Number(root.dataset.length);
  const mode = root.dataset.mode;
  const maxRows = Number(root.dataset.rows);
  const storeKey = `wh-board-${length}-${mode}`;
  const form = root.querySelector(".solver-entry");
  const input = form.querySelector("input");
  const board = root.querySelector(".board");
  const results = root.querySelector(".results");
  const allWords = root.querySelector('input[name="all-words"]');
  board.dataset.length = length;

  let rows = storageGet(storeKey) || [];
  let answers = [];
  let valid = [];
  let showAll = false;
  let timer = 0;

  function knownGreens() {
    const greens = {};
    for (const r of rows) r.marks.forEach((m, i) => m === 2 && (greens[i] = r.word[i]));
    return greens;
  }

  function addGuess(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length !== length) {
      input.setCustomValidity(`Enter exactly ${length} letters.`);
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    if (rows.length >= maxRows) rows.shift();
    // Letters already confirmed green in that spot start out green.
    const greens = knownGreens();
    rows.push({ word, marks: Array.from(word, (c, i) => (greens[i] === c ? 2 : 0)) });
    input.value = "";
    showAll = false;
    update();
  }

  function drawBoard() {
    // Keep keyboard focus on the same tile across redraws.
    const focused = board.contains(document.activeElement) ? document.activeElement.dataset.pos : null;
    board.replaceChildren();
    rows.forEach((row, r) => {
      const line = el("div", { class: "board-row" });
      Array.from(row.word).forEach((ch, i) => {
        const tile = el("button", { type: "button", class: `tile ${COLORS[row.marks[i]]}`, "data-pos": `${r}-${i}` }, ch);
        tile.setAttribute("aria-label", `${ch.toUpperCase()}, position ${i + 1}: ${COLORS[row.marks[i]]}. Tap to change color.`);
        tile.addEventListener("click", () => {
          row.marks[i] = (row.marks[i] + 1) % 3;
          update();
        });
        line.append(tile);
      });
      const remove = el("button", { type: "button", class: "row-remove", "aria-label": `Remove guess ${row.word.toUpperCase()}` }, "×");
      remove.addEventListener("click", () => {
        rows.splice(r, 1);
        update();
      });
      line.append(remove);
      board.append(line);
    });
    if (focused) board.querySelector(`[data-pos="${focused}"]`)?.focus();
    if (rows.length === 0) {
      const line = el("div", { class: "board-row", "aria-hidden": "true" });
      for (let i = 0; i < length; i++) line.append(el("span", { class: "tile empty" }));
      board.append(line);
    }
  }

  function wordButton(w) {
    const li = el("li");
    const b = el("button", { type: "button", title: "Use this word as your next guess" }, w.toUpperCase());
    b.addEventListener("click", () => {
      input.value = w.toUpperCase();
      input.focus();
    });
    li.append(b);
    return li;
  }

  function drawResults() {
    const pool = allWords.checked ? valid : answers;
    const candidates = filterCandidates(pool, rows);
    const ranked = rankByFrequency(candidates).map((x) => x.word);
    results.replaceChildren();

    const status = el("p", { class: "status" });
    if (candidates.length === 0) {
      status.innerHTML = "<strong>0</strong> words match. Double-check the tile colors";
      status.append(allWords.checked ? "." : ", or tick “Include rare words” above.");
      results.append(status);
      return;
    }
    const strong = el("strong", {}, candidates.length.toLocaleString());
    status.append(strong, ` possible ${candidates.length === 1 ? "word" : "words"} ${rows.length ? "left" : "to start with"}`);
    if (candidates.length === 1) status.append(` — the answer is ${candidates[0].toUpperCase()}!`);
    results.append(status);

    if (candidates.length > 1) {
      const best = el("div", { class: "best" });
      best.append(el("h3", {}, mode === "guesser" ? "Best next guesses (by information gained)" : "Suggested next guess"));
      const note = el("p", { class: "meta" }, "Calculating…");
      best.append(note);
      results.append(best);
      clearTimeout(timer);
      timer = setTimeout(() => {
        const limit = mode === "guesser" ? 10 : 5;
        const top = bestGuesses(candidates, valid, { limit, maxPool: mode === "guesser" ? 600 : 300 });
        const ol = el("ol");
        for (const g of top) {
          const li = el("li");
          li.append(el("span", { class: "word" }, g.word.toUpperCase()), " ");
          if (g.isCandidate) li.append(el("span", { class: "pill" }, "could be the answer"), " ");
          const avg = candidates.length / Math.pow(2, g.bits);
          li.append(el("span", { class: "meta" }, `${g.bits.toFixed(2)} bits · splits into ${g.buckets} groups · ~${Math.max(1, Math.round(avg))} left on average`));
          li.addEventListener("click", () => {
            input.value = g.word.toUpperCase();
            input.focus();
          });
          ol.append(li);
        }
        note.replaceWith(ol);
      }, 20);
    }

    const heading = el("h3", {}, candidates.length > 1 ? "Possible answers, most likely first" : "Answer");
    const grid = el("ul", { class: "word-grid" });
    const limit = showAll ? ranked.length : 120;
    for (const w of ranked.slice(0, limit)) grid.append(wordButton(w));
    results.append(heading, grid);
    if (ranked.length > limit) {
      const more = el("button", { type: "button", class: "btn ghost small" }, `Show all ${ranked.length.toLocaleString()} words`);
      more.addEventListener("click", () => {
        showAll = true;
        drawResults();
      });
      results.append(more);
    }
  }

  function update() {
    storageSet(storeKey, rows);
    drawBoard();
    if (valid.length) drawResults();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addGuess(input.value);
  });
  input.addEventListener("input", () => input.setCustomValidity(""));
  allWords.addEventListener("change", () => {
    showAll = false;
    drawResults();
  });
  root.querySelector("[data-reset]").addEventListener("click", () => {
    rows = [];
    update();
    input.focus();
  });

  drawBoard();
  Promise.all([loadWords(length, "answers"), loadWords(length, "valid")])
    .then(([a, v]) => {
      answers = a;
      valid = v;
      rows = rows.filter((r) => r && r.word && r.word.length === length);
      drawResults();
    })
    .catch(() => {
      results.querySelector(".status").textContent = "Sorry, the word list could not be loaded. Please refresh the page.";
    });
}

document.querySelectorAll("[data-solver]").forEach(initSolver);
