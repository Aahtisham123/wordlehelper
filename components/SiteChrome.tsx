"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { SearchButton } from "./Search";
import { ThemeToggle } from "./ThemeToggle";

export type NavItem = { href: string; label: string; icon: string };
export type NavGroup = { label: string; items: NavItem[] };

function Sidebar({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className="sidebar-head">
        <Logo onClick={onNavigate} />
      </div>
      <div className="sidebar-search">
        <SearchButton />
      </div>
      <nav className="sidebar-nav" aria-label="Main">
        {groups.map((g) => (
          <div key={g.label} className="nav-group">
            <p className="nav-label">{g.label}</p>
            <ul>
              {g.items.map((it) => {
                const active = pathname === it.href;
                return (
                  <li key={it.href}>
                    <Link href={it.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} onClick={onNavigate}>
                      <Icon name={it.icon} size={18} />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <Link href="/about/" onClick={onNavigate}>About</Link>
        <Link href="/contact/" onClick={onNavigate}>Contact</Link>
        <Link href="/privacy/" onClick={onNavigate}>Privacy</Link>
      </div>
    </>
  );
}

export function SiteChrome({ groups, children }: { groups: NavGroup[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const first = drawer.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      // Keep focus inside the open drawer.
      if (e.key === "Tab" && drawer.current) {
        const els = drawer.current.querySelectorAll<HTMLElement>("a, button");
        const firstEl = els[0], lastEl = els[els.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Site navigation">
        <Sidebar groups={groups} />
      </aside>

      <div className={`drawer-backdrop${open ? " show" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside ref={drawer} id="mobile-menu" className={`drawer${open ? " open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open} inert={!open}>
        <button type="button" className="icon-btn drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <Icon name="X" size={20} />
        </button>
        <Sidebar groups={groups} onNavigate={() => setOpen(false)} />
      </aside>

      <div className="content-col">
        <header className="topbar">
          <button ref={menuButton} type="button" className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu">
            <Icon name="Menu" size={22} />
          </button>
          <div className="topbar-logo">
            <Logo />
          </div>
          <div className="topbar-search">
            <SearchButton />
          </div>
          <div className="topbar-actions">
            <span className="mobile-only">
              <SearchButton compact />
            </span>
            <Link href="/wordle-hint-today/" className="btn btn-sm topbar-cta">
              <Icon name="Lightbulb" size={16} />
              <span>Today&apos;s hint</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
