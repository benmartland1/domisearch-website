import Link from "next/link";
import Image from "next/image";
import type { Author } from "@/lib/authors";
import { site } from "@/lib/site";

type Props = {
  author: Author;
  variant?: "dark" | "paper";
};

export function AuthorBio({ author, variant = "dark" }: Props) {
  const isPaper = variant === "paper";
  return (
    <aside
      className={`mt-16 rounded-2xl border p-6 sm:p-8 ${
        isPaper
          ? "border-black/10 bg-[color:var(--color-paper-2)]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Image
          src={author.image}
          alt={author.name}
          width={72}
          height={72}
          className={`h-16 w-16 shrink-0 rounded-full object-cover object-center ring-1 sm:h-[72px] sm:w-[72px] ${
            isPaper ? "ring-black/10" : "ring-white/10"
          }`}
        />
        <div className="min-w-0">
          <div
            className={`text-[10px] font-medium uppercase tracking-[0.24em] ${
              isPaper ? "text-[color:var(--color-ink-2)]" : "text-[color:var(--color-domigreen)]"
            }`}
          >
            About the author
          </div>
          <h3
            className={`mt-2 text-lg font-[600] ${
              isPaper ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-glacier)]"
            }`}
          >
            {author.name}
          </h3>
          <div
            className={`text-xs uppercase tracking-[0.14em] ${
              isPaper ? "text-[color:var(--color-ink-3)]" : "text-[color:var(--color-fog)]/60"
            }`}
          >
            {author.role}
          </div>
          <p
            className={`mt-4 text-sm leading-relaxed ${
              isPaper ? "text-[color:var(--color-ink-2)]" : "text-[color:var(--color-fog)]/85"
            }`}
          >
            {author.bio}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.2em]">
            <Link
              href="/about"
              className={
                isPaper
                  ? "text-[color:var(--color-pine)] hover:text-[color:var(--color-ink)]"
                  : "text-[color:var(--color-domigreen)] hover:text-[color:var(--color-glacier)]"
              }
            >
              About →
            </Link>
            <Link
              href={site.calendly}
              target="_blank"
              rel="noopener"
              className={
                isPaper
                  ? "text-[color:var(--color-pine)] hover:text-[color:var(--color-ink)]"
                  : "text-[color:var(--color-domigreen)] hover:text-[color:var(--color-glacier)]"
              }
            >
              Book a call →
            </Link>
            {author.sameAs[0] && (
              <Link
                href={author.sameAs[0]}
                target="_blank"
                rel="noopener"
                className={
                  isPaper
                    ? "text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-fog)]/60 hover:text-[color:var(--color-glacier)]"
                }
              >
                LinkedIn →
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
