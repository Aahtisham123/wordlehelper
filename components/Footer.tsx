import Link from "next/link";
import { FOOTER_GROUPS, getPage } from "@/lib/registry-types";
import { SITE } from "@/lib/site.mjs";
import { CookieSettingsLink } from "./CookieBanner";
import { Logo } from "./Logo";
import { Year } from "./Year";

export function Footer({ buildYear }: { buildYear: number }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Free, fast and private Wordle tools. Solve today&apos;s puzzle, learn smarter strategy and keep your streak alive.</p>
        </div>
        {FOOTER_GROUPS.map((g) => (
          <div key={g.label} className="footer-col">
            <h2>{g.label}</h2>
            <ul>
              {g.items.map((href) => (
                <li key={href}>
                  <Link href={href}>{getPage(href).nav}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">
          <strong>Not affiliated with The New York Times.</strong> Wordle is a trademark of The New York Times Company. {SITE.name} is an independent fan-made
          site. See our <Link href="/disclaimer/">disclaimer</Link>.
        </p>
        <p className="footer-legal">
          © <Year fallback={buildYear} /> {SITE.name} · Word lists based on <a href="http://wordlist.aspell.net/" rel="noopener">SCOWL</a> (
          <a href="/LICENSE-SCOWL.txt">license</a>) · <CookieSettingsLink />
        </p>
      </div>
    </footer>
  );
}
