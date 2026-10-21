import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";

/**
 * The site footer, in the approved design. `note` adds a small-print line
 * above the copyright row (the sector pages use it for their illustration
 * disclaimer).
 */
export function Footer({ note }: { note?: string }) {
  return (
    <footer className="ds-footer ds-wrap" style={{ "--ds-logo-mask": "url(/brand/logo.png)" } as CSSProperties}>
      <div className="ds-footer-top">
        <div className="ds-footer-brand">
          <div className="ds-brand-lockup">
            <Image className="ds-logo ds-logo-light" src="/brand/logo.png" alt="DomiSearch" width={155} height={24} />
            <span className="ds-logo-solid" aria-hidden="true" />
          </div>
          <p>
            AI search visibility for service businesses.
            <br />
            Be the brand AI recommends.
          </p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <span>
            {site.city}, {site.country}
          </span>
        </div>
        <div className="ds-footer-links">
          <strong>Services</strong>
          <Link href="/services/aeo">AI Search Visibility</Link>
          <Link href="/services/google-ads">Google Ads Management</Link>
          <Link href="/#results">Client results</Link>
          <Link href="/#visibility-check">Get a visibility review ↗</Link>
        </div>
        <div className="ds-footer-links">
          <strong>Sectors</strong>
          {site.sectors.map((s) =>
            s.href.startsWith("http") ? (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label} ↗
              </a>
            ) : (
              <Link key={s.href} href={s.href}>
                {s.label}
              </Link>
            ),
          )}
        </div>
        <div className="ds-footer-links">
          <strong>Company</strong>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      {note ? <p className="ds-footer-note">{note}</p> : null}
      <div className="ds-footer-bottom">
        <span>© {new Date().getFullYear()} DomiSearch. Built in Manchester. Delivered worldwide.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
