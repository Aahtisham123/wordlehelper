// Wordle releases at local midnight, so warn visitors whose local puzzle
// differs from the one this page was built for.
const box = document.querySelector("[data-daily]");
if (box) {
  const shown = Number(box.dataset.number);
  const now = new Date();
  const local = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const current = Math.round((local - Date.UTC(2021, 5, 19)) / 86400000);
  const notice = box.querySelector("[data-stale]");
  if (current > shown) {
    notice.textContent = `Wordle #${current} is already out in your time zone. Hints for it are coming soon — the hints below are for #${shown}.`;
    notice.hidden = false;
  } else if (current < shown) {
    notice.innerHTML = `Heads up: these hints are for Wordle #${shown}, which reaches your time zone at midnight. Your current puzzle is #${current} — its answer is in the <a href="/wordle-answers/">answers archive</a>.`;
    notice.hidden = false;
  }
}
