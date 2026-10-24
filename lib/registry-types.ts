// Typed re-exports of the plain-JS registry for TypeScript components.
import * as reg from "./registry.mjs";

export type PageEntry = {
  path: string;
  title: string;
  description: string;
  heading: string;
  nav: string;
  section: "home" | "daily" | "solvers" | "words" | "lists" | "guides" | "site";
  icon: string;
  image?: string;
  imageAlt?: string;
  og: string;
  keywords: string[];
  updated: string;
  priority: number;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  noindex?: boolean;
};

export const PAGES = reg.PAGES as PageEntry[];
export const NAV_GROUPS = reg.NAV_GROUPS as { label: string; items: string[] }[];
export const FOOTER_GROUPS = reg.FOOTER_GROUPS as { label: string; items: string[] }[];
export const getPage = (path: string) => reg.getPage(path) as PageEntry;
export const listPage = reg.listPage as (slug: string, counts: { common: number; all: number }) => PageEntry;
export const listSlugs = reg.listSlugs as (valid: string[]) => { slug: string; kind: string; letter: string; count: number }[];
export const parseListSlug = reg.parseListSlug as (slug: string) => { kind: string; letter: string } | null;
export const LIST_KINDS = reg.LIST_KINDS as Record<string, { label: (L: string) => string; phrase: (L: string) => string; test: (c: string) => (w: string) => boolean }>;
