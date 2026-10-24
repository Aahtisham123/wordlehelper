"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

const KEY = "cookie-consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function loadAnalytics() {
  if (!GA_ID || document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });
}

/**
 * Consent banner. Nothing optional (analytics) loads until the visitor
 * accepts. "Cookie settings" in the footer reopens it.
 */
export function CookieBanner() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(KEY);
    } catch {}
    if (choice === "accepted") loadAnalytics();
    if (!choice) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("wh:cookie-settings", reopen);
    return () => window.removeEventListener("wh:cookie-settings", reopen);
  }, []);
  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    setOpen(false);
    if (choice === "accepted") loadAnalytics();
    toast({ type: "success", title: choice === "accepted" ? "Thanks! Preferences saved" : "Got it — optional cookies are off", message: "You can change this any time from Cookie settings in the footer." });
  }
  if (!open) return null;
  return (
    <section className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-live="polite">
      <div className="cookie-icon">
        <Icon name="Cookie" size={22} />
      </div>
      <div className="cookie-text">
        <h2 id="cookie-title">We value your privacy</h2>
        <p>
          Our Wordle tools work without cookies. With your OK, we may use analytics cookies to see which pages help people most. Read our{" "}
          <Link href="/privacy/#cookies">privacy policy</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost" onClick={() => decide("declined")}>
          Decline
        </button>
        <button type="button" className="btn" onClick={() => decide("accepted")}>
          Accept
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsLink() {
  return (
    <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event("wh:cookie-settings"))}>
      Cookie settings
    </button>
  );
}
