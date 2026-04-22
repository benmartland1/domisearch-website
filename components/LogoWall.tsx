import Image from "next/image";
import { site } from "@/lib/site";
import { ScrollReveal } from "./ScrollReveal";

export function LogoWall() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <ScrollReveal>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-[color:var(--color-domigreen)]/70" />
          <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-fog)]/70">
            Trusted by founders at
          </span>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-5">
        {site.clients.map((client, i) => (
          <ScrollReveal
            key={client.name}
            delay={(i % 5) * 60}
            className="flex h-28 items-center justify-center bg-[color:var(--color-charcoal)] transition-colors hover:bg-white/[0.03]"
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={160}
              height={48}
              className="h-10 w-auto max-w-[70%] object-contain opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100"
              sizes="160px"
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
