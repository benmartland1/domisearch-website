import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { GooglePartnerBadge } from "./ui/GooglePartnerBadge";
import { ShopifyPartnerBadge } from "./ui/ShopifyPartnerBadge";

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/5 bg-[color:var(--color-charcoal)]">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/brand/logo.png"
              alt="DomiSearch"
              width={203}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[color:var(--color-fog)]/80">
            Google Ads, SEO and AI Engine Optimisation - engineered to make your brand the
            answer AI recommends.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <GooglePartnerBadge className="w-[150px]! sm:w-[150px]!" />
            <ShopifyPartnerBadge className="w-[150px]! sm:w-[150px]!" />
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-[color:var(--color-glacier)]">Services</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/services/google-ads" className="hover:text-[color:var(--color-domigreen)]">Google Ads</Link></li>
            <li><Link href="/services/aeo" className="hover:text-[color:var(--color-domigreen)]">AI Search (AEO)</Link></li>
            <li><Link href="/scorecard" className="hover:text-[color:var(--color-domigreen)]">Scorecard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-[color:var(--color-glacier)]">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-[color:var(--color-domigreen)]">About</Link></li>
            <li><Link href="/blog" className="hover:text-[color:var(--color-domigreen)]">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-[color:var(--color-domigreen)]">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-[color:var(--color-domigreen)]">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-[color:var(--color-domigreen)]">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-[color:var(--color-domigreen)]">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-[color:var(--color-glacier)]">Reach us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a className="hover:text-[color:var(--color-domigreen)]" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="hover:text-[color:var(--color-domigreen)]" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>
            </li>
            <li className="text-[color:var(--color-fog)]/70">{site.city}, {site.country}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-[color:var(--color-fog)]/60 sm:flex-row sm:items-center lg:px-10">
          <span>© {new Date().getFullYear()} DomiSearch. All rights reserved.</span>
          <span>Built in Manchester. Delivered worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
