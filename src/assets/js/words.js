// Fetches and caches the word lists published by the build in /assets/words/.
const cache = {};

export function loadWords(length, kind) {
  const key = `${length}-${kind}`;
  if (!cache[key]) {
    cache[key] = fetch(`/assets/words/${key}.txt`)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load ${key}`);
        return r.text();
      })
      .then((t) => t.trim().split("\n"));
  }
  return cache[key];
}
