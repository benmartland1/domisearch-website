"use client";

import Link from "next/link";
import { useRef } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { GooglePartnerBadge } from "./ui/GooglePartnerBadge";
import { AIEnginesBadge } from "./ui/AIEnginesBadge";

const services = [
  {
    href: "/services/google-ads",
    title: "Google Ads",
    body:
      "Campaigns built to reduce wasted spend and scale ROAS. Full-funnel keyword, bidding and CRO strategy - run by Google Partners with £3M+ managed spend.",
    bullets: [
      "Account audit & restructure",
      "Search, PMax, Demand Gen",
      "Landing page CRO",
      "Transparent weekly reporting",
    ],
    badge: "google" as const,
  },
  {
    href: "/services/aeo",
    title: "AI Search",
    body:
      "Get your brand cited in ChatGPT, Gemini, Perplexity and Google AI Overviews. Entity optimisation, AI-ready content, schema, and monthly visibility reporting.",
    bullets: [
      "Entity & brand optimisation",
      "Content for LLM citation",
      "Schema & technical markup",
      "Monthly AI visibility reports",
    ],
    badge: "ai-engines" as const,
  },
];

function ServiceCard({
  service,
  idx,
}: {
  service: (typeof services)[number];
  idx: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <ScrollReveal delay={idx * 120}>
      <Link
        href={service.href}
        ref={ref}
        onMouseMove={onMouseMove}
        className="card spotlight group relative block h-full overflow-hidden p-10"
      >
        {/* Badge sits where the eyebrow tag used to live */}
        <div className="pointer-events-none">
          {service.badge === "google" ? (
            <GooglePartnerBadge className="w-[180px]! sm:w-[210px]!" />
          ) : (
            <AIEnginesBadge className="w-[240px]! sm:w-[280px]!" />
          )}
        </div>

        <h3 className="display mt-6 text-3xl sm:text-4xl">{service.title}</h3>
        <p className="mt-5 max-w-lg text-[color:var(--color-fog)]/85">{service.body}</p>
        <ul className="mt-8 space-y-2 text-sm text-[color:var(--color-fog)]/80">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-[color:var(--color-domigreen)]" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex items-center gap-2 text-sm font-medium text-[color:var(--color-domigreen)] transition-transform duration-300 group-hover:translate-x-1">
          Explore service →
        </div>
      </Link>
    </ScrollReveal>
  );
}

export function ServicesGrid() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="Our services"
        title="Google Ads and AI Search."
        description="Two services, one search strategy. Run either on its own - they compound when you run both."
      />
      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
        {services.map((service, idx) => (
          <ServiceCard key={service.href} service={service} idx={idx} />
        ))}
      </div>
    </section>
  );
}
