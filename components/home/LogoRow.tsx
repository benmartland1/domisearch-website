import Image from "next/image";
import { site } from "@/lib/site";

/** Static row of client logos. Replaces the moving marquee. */
export function LogoRow() {
  return (
    <section aria-label="Brands we have worked with" className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">
          Brands we&apos;ve worked with
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {site.clients.map((client) => (
            <li key={client.name} className="flex h-8 items-center" title={client.name}>
              <Image
                src={client.logo}
                alt={client.name}
                width={160}
                height={40}
                className="h-6 w-auto max-w-[120px] object-contain opacity-60 brightness-0 sm:h-7 sm:max-w-[150px]"
                sizes="150px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
