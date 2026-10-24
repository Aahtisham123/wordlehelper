import { getWords } from "./data.mjs";
import { LIST_KINDS, PAGES, listPage, listSlugs, type PageEntry } from "./registry-types";

/** Every page on the site, including the programmatic word lists. */
export function allPages(): PageEntry[] {
  const five = getWords(5);
  const lists = listSlugs(five.valid).map(({ slug, kind, letter }) => {
    const all = five.valid.filter(LIST_KINDS[kind].test(letter));
    return listPage(slug, { all: all.length, common: all.filter((w: string) => five.answerSet.has(w)).length });
  });
  return [...PAGES, ...lists];
}
