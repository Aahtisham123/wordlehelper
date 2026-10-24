import Link from "next/link";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <rect x="4" y="4" width="26" height="26" rx="7" fill="var(--tile-gray)" />
      <rect x="34" y="4" width="26" height="26" rx="7" fill="var(--tile-yellow)" />
      <rect x="4" y="34" width="26" height="26" rx="7" fill="var(--tile-green)" />
      <rect x="34" y="34" width="26" height="26" rx="7" fill="var(--brand)" />
      <path d="M41 47.5l4.5 4.5L54 42" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="logo" aria-label="Wordle Helper — go to the homepage" onClick={onClick}>
      <LogoMark />
      <span className="logo-text">
        Wordle<span>Helper</span>
      </span>
    </Link>
  );
}
