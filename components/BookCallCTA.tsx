import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  label?: string;
  eyebrow?: string;
  className?: string;
};

/** A compact inline booking link with Ben's headshot, dropped between sections. */
export function BookCallCTA({ label = "Book a call", eyebrow = "Meet Ben", className = "mt-24" }: Props) {
  return (
    <ScrollReveal className={`relative mx-auto flex justify-center px-6 lg:px-10 ${className}`}>
      <Link
        href={site.calendly}
        target="_blank"
        rel="noopener"
        className="group relative flex items-center gap-4 rounded-[4px] border border-[color:var(--color-line)] bg-white py-2 pl-2 pr-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-ink)] sm:pr-4"
      >
        <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
          <Image src="/brand/founder-cta.png" alt="Ben Martland" fill sizes="48px" className="object-cover" style={{ objectPosition: "center 15%" }} />
        </span>
        <span className="flex flex-col pr-1">
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[color:var(--color-forest)]">{eyebrow}</span>
          <span className="text-sm font-[500] text-[color:var(--color-ink)] sm:text-[15px]">{label}</span>
        </span>
        <span aria-hidden className="ml-1 grid h-8 w-8 place-items-center rounded-[3px] bg-[color:var(--color-ink)] text-white transition-transform duration-300 group-hover:translate-x-0.5 sm:ml-2">
          ↗
        </span>
      </Link>
    </ScrollReveal>
  );
}
