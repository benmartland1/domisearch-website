import Image from "next/image";
import { site } from "@/lib/site";

export function ClientMarquee() {
  const logos = [...site.clients, ...site.clients];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-[color:var(--color-charcoal)] py-10">
      <div className="marquee-track items-center">
        {logos.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="group flex h-10 shrink-0 items-center"
            title={client.name}
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={160}
              height={40}
              className="h-10 w-auto max-w-[180px] object-contain opacity-55 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100"
              sizes="180px"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[color:var(--color-charcoal)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[color:var(--color-charcoal)] to-transparent" />
    </div>
  );
}
