import Link from "next/link";
import { PageHeader } from "@/components/Content";
import { CookieSettingsLink } from "@/components/CookieBanner";
import { getPage } from "@/lib/registry-types";
import { metadataFor } from "@/lib/seo";
import { SITE } from "@/lib/site.mjs";

const page = getPage("/privacy/");
export const metadata = metadataFor(page);

export default function Privacy() {
  return (
    <>
      <PageHeader page={page} trail={[{ href: page.path, label: "Privacy Policy" }]} showImage={false} lead={`How ${SITE.domain} handles your information, in plain English.`} />
      <section className="prose">
        <p>
          This policy explains what information {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use {SITE.domain} (the &ldquo;Site&rdquo;).
        </p>
        <h2>What you type into our tools</h2>
        <p>
          The guesses, letters and words you enter into the <Link href="/">Wordle Helper</Link> and our other tools are processed entirely in your web browser. They are not sent to us.
          To keep your board when you reload, the Wordle Helper saves it in your browser&apos;s local storage on your own device. You can clear it any time with the &ldquo;Clear
          board&rdquo; button or by clearing your browser&apos;s site data. We also remember your light or dark theme choice and your cookie choice the same way.
        </p>
        <h2>Server logs</h2>
        <p>
          Like most websites, the servers that host the Site may record standard request details such as your IP address, browser type, the page requested and the time. These are
          used to keep the Site secure and working, not to identify you.
        </p>
        <h2 id="cookies">Cookies and analytics</h2>
        <p>
          Our tools work without cookies. When you first visit, we ask whether you&apos;re happy for us to use optional analytics cookies, which help us see which pages are useful. If
          you decline, no analytics scripts load. If you accept and analytics is enabled on the Site, we use Google Analytics with IP anonymisation. You can change your choice at any
          time: <CookieSettingsLink />.
        </p>
        <p>If we add advertising in the future, we&apos;ll update this policy and ask for your consent before any advertising cookies are used.</p>
        <h2>Email</h2>
        <p>If you email us, we use your address and message only to reply and to improve the Site. We never sell or share it.</p>
        <h2>Children</h2>
        <p>The Site is suitable for a general audience and does not knowingly collect personal information from children.</p>
        <h2>Changes and contact</h2>
        <p>
          We may update this policy; the date at the top shows the latest version. Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </>
  );
}
