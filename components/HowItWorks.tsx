import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { site } from "@/lib/site";

/*
 * Homepage "How it works". Four numbered stages, each with one illustration
 * built from recognisable things: an AI answer, website pages, an email, a
 * short Domi Studio note. The examples are illustrative throughout: no
 * performance figures, no named real businesses, no promised outcomes.
 */

/* ---------- small building blocks ---------- */

function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-[0.3em] bg-[color:var(--color-domigreen)]/20 px-[0.25em] py-[0.05em] text-[color:var(--color-glacier)]">
      {children}
    </mark>
  );
}

/** Browser-style window chrome used by the dark mock-ups. */
function Window({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center text-[11px] text-[color:var(--color-fog)]/55">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2.5l2.1 5.9 5.9 2.1-5.9 2.1L12 18.5l-2.1-5.9L4 10.5l5.9-2.1L12 2.5z"
        fill="currentColor"
      />
      <path d="M19 15l.9 2.4 2.4.9-2.4.9L19 21.6l-.9-2.4-2.4-.9 2.4-.9L19 15z" fill="currentColor" />
    </svg>
  );
}

/* ---------- stage 1: the AI answer ---------- */

function AiAnswerVisual() {
  const results = [
    { name: "Northgate Search", detail: "Senior sales hires · London" },
    { name: "Bridge & Hale", detail: "Commercial leadership · UK-wide" },
    { name: "Harbour Talent", detail: "Sales director placements · London" },
  ];
  return (
    <Window title="AI search">
      <div className="p-5 sm:p-6">
        {/* The question */}
        <div className="flex justify-end">
          <p className="max-w-[88%] rounded-2xl rounded-br-md bg-white/8 px-4 py-3 text-sm leading-relaxed text-[color:var(--color-glacier)]">
            Which recruitment agencies can help us hire a{" "}
            <Highlight>sales director</Highlight> in <Highlight>London</Highlight>?
          </p>
        </div>

        {/* The answer */}
        <div className="mt-5 flex gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-domigreen)]/15 text-[color:var(--color-domigreen)]">
            <SparkIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-[color:var(--color-fog)]/85">
              A few agencies specialise in senior sales appointments in London:
            </p>
            <ol className="mt-3 space-y-2">
              {results.map((r, i) => (
                <li
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                >
                  <span className="text-xs font-medium text-[color:var(--color-fog)]/45">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-[500] text-[color:var(--color-glacier)]">
                      {r.name}
                    </span>
                    <span className="block truncate text-xs text-[color:var(--color-fog)]/60">
                      {r.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fog)]/45">
                Sources
              </span>
              {["northgatesearch.co.uk", "industry guide", "client reviews"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[color:var(--color-fog)]/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

/* ---------- stage 2: becoming the answer ---------- */

function Connector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <svg width="24" height="44" viewBox="0 0 24 44" fill="none">
        <path
          d="M12 0v30"
          stroke="var(--color-domigreen)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        <path d="M6 28l6 8 6-8" stroke="var(--color-domigreen)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

function BecomeTheAnswerVisual() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1.25fr_1fr] sm:items-start">
        {/* Article */}
        <Window title="yourcompany.co.uk/insights">
          <article className="p-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
              Hiring guide
            </span>
            <h4 className="mt-2 text-base font-[600] leading-snug text-[color:var(--color-glacier)]">
              Hiring a sales director in London
            </h4>
            <p className="mt-1.5 text-[11px] text-[color:var(--color-fog)]/50">
              By the founder · 8 min read
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-fog)]/75">
              What a good sales director looks like at your stage, what to pay in London
              right now, and the questions that separate strong candidates from polished
              ones.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-fog)]/75">
              We have placed sales leaders in scale-ups and established firms, so this guide
              draws on real searches rather than theory.
            </p>
          </article>
        </Window>

        {/* Service page */}
        <Window title="yourcompany.co.uk/sales-director-recruitment">
          <div className="p-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-fog)]/50">
              Service
            </span>
            <h4 className="mt-2 text-base font-[600] leading-snug text-[color:var(--color-glacier)]">
              Sales director recruitment
            </h4>
            <ul className="mt-3 space-y-1.5 text-xs text-[color:var(--color-fog)]/75">
              <li>London and the South East</li>
              <li>Retained and exclusive search</li>
              <li>Shortlist within four weeks</li>
            </ul>
            <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.03] p-2.5 text-[11px] italic leading-snug text-[color:var(--color-fog)]/70">
              “They found us a sales director who hit the ground running.”
            </div>
          </div>
        </Window>
      </div>

      <Connector />

      {/* The AI answer that results */}
      <div className="mx-auto flex max-w-md gap-3 rounded-2xl border border-[color:var(--color-domigreen)]/30 bg-[color:var(--color-domigreen)]/[0.06] p-4">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-domigreen)]/15 text-[color:var(--color-domigreen)]">
          <SparkIcon className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-[color:var(--color-fog)]/85">
          For a sales director hire in London, <Highlight>Your company</Highlight> is worth a
          look. They run retained searches for senior sales roles and publish practical
          guidance on the hiring process.
        </p>
      </div>
    </div>
  );
}

/* ---------- stage 3: the enquiry ---------- */

function EnquiryVisual() {
  return (
    <div className="relative">
      {/* Enquiry form, deliberately quieter */}
      <div className="w-[78%] max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-5 opacity-80 sm:w-[64%]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-fog)]/50">
          Enquiry
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[color:var(--color-fog)]/70">
            James Mitchell
          </div>
          <div className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[color:var(--color-fog)]/70">
            Operations Director
          </div>
          <div className="rounded-lg border border-white/10 px-3 py-2 text-xs leading-snug text-[color:var(--color-fog)]/70">
            We need a sales director in London…
          </div>
        </div>
        <span className="mt-3 inline-flex rounded-full bg-[color:var(--color-domigreen)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--color-charcoal)]">
          Send enquiry
        </span>
      </div>

      {/* Arrow between the two */}
      <svg
        className="absolute left-[50%] top-[30%] hidden h-16 w-24 text-[color:var(--color-domigreen)] sm:block"
        viewBox="0 0 96 64"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 6c30 0 50 10 74 46"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.75"
        />
        <path d="M70 46l8 8 2-11" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Gmail-style message: the focal point */}
      <div className="relative -mt-3 ml-auto w-[94%] max-w-md rounded-2xl bg-white p-5 text-[color:var(--color-ink)] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] sm:-mt-2 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-[600] leading-snug sm:text-lg">
            Sales director appointment
          </h4>
          <span className="shrink-0 rounded-md bg-[color:var(--color-paper-2)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-ink-3)]">
            Inbox
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1E40FF] text-xs font-[600] text-white">
            JM
          </span>
          <div className="min-w-0 text-xs leading-snug">
            <p className="font-[600] text-[color:var(--color-ink)]">James Mitchell</p>
            <p className="text-[color:var(--color-ink-3)]">to you · Just now</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-ink-2)]">
          Hi, we’re looking to appoint a sales director in London. Are you available for a call
          this week?
        </p>
        <p className="mt-3 text-sm text-[color:var(--color-ink-2)]">
          Thanks,
          <br />
          James
        </p>
        <div className="mt-5 flex gap-2">
          <span className="rounded-full border border-[color:var(--color-ink)]/15 px-3.5 py-1.5 text-xs font-medium text-[color:var(--color-ink)]">
            Reply
          </span>
          <span className="rounded-full border border-[color:var(--color-ink)]/15 px-3.5 py-1.5 text-xs font-medium text-[color:var(--color-ink)]">
            Forward
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- stage 4: tracking ---------- */

function TrackingVisual() {
  const rows = [
    {
      label: "Published",
      body: "Hiring a sales director in London",
      note: "Guide, with the service page updated to match.",
    },
    {
      label: "Appeared in",
      body: "ChatGPT and Perplexity",
      note: "Named when asked about sales director recruitment in London.",
    },
    {
      label: "Next action",
      body: "Add a recent client story to the service page",
      note: "So the answer has a result to point to.",
    },
  ];
  return (
    <Window title="Domi Studio">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-[500] text-[color:var(--color-glacier)]">Your company</p>
          <p className="text-[11px] text-[color:var(--color-fog)]/50">This month</p>
        </div>
        <ul className="mt-4 divide-y divide-white/8">
          {rows.map((r) => (
            <li key={r.label} className="grid gap-1 py-3.5 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-domigreen)] sm:pt-1">
                {r.label}
              </span>
              <span>
                <span className="block text-sm font-[500] text-[color:var(--color-glacier)]">
                  {r.body}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-[color:var(--color-fog)]/60">
                  {r.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

/* ---------- the section ---------- */

const stages = [
  {
    n: "1",
    title: "We find the questions your next client is asking.",
    body: "We research the questions people ask when looking for services like yours, and see which businesses AI recommends. This helps us decide where to focus your strategy.",
    alt: "An AI search window answering the question “Which recruitment agencies can help us hire a sales director in London?”, listing three recommended agencies and the sources it used.",
    visual: <AiAnswerVisual />,
  },
  {
    n: "2",
    title: "We help your business become the answer.",
    body: "We improve your website and create useful content that answers those questions. Your services, experience and client results become easier for AI to understand and potential clients to trust.",
    alt: "A website article titled “Hiring a sales director in London” and a sales director recruitment service page, leading to an AI answer that mentions your company.",
    visual: <BecomeTheAnswerVisual />,
  },
  {
    n: "3",
    title: "We make it easier for interested buyers to get in touch.",
    body: "Once someone discovers your business, they need to understand why you’re a good fit. Clear service pages, convincing client stories and a simple enquiry process help them take the next step.",
    alt: "A website enquiry form leading to an email that reads: “Hi, we’re looking to appoint a sales director in London. Are you available for a call this week?”",
    visual: <EnquiryVisual />,
  },
  {
    n: "4",
    title: "We track what changes and keep improving.",
    body: "We monitor where your business gets mentioned, review the work we’ve completed and use what we learn to decide what to do next.",
    alt: "A simple Domi Studio view showing what was published, where the business appeared and the next action.",
    visual: <TrackingVisual />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="How it works"
        title="How we help turn AI searches into new clients."
        description="Helping the right people find your business, trust your expertise and get in touch."
      />

      <ol className="mt-20 lg:mt-28">
        {stages.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <li
              key={s.n}
              className={`grid items-center gap-10 border-t border-white/10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24 ${
                i === 0 ? "border-t-0 pt-0 lg:pt-0" : ""
              }`}
            >
              <ScrollReveal className={flip ? "lg:order-2" : ""}>
                <div className="max-w-lg">
                  <span className="display block text-[4.5rem] leading-none text-[color:var(--color-domigreen)] sm:text-[5.5rem]">
                    {s.n}
                  </span>
                  <h3 className="display mt-6 text-balance text-[1.75rem] leading-[1.1] sm:text-[2.25rem]">
                    {s.title}
                  </h3>
                  <p className="mt-5 text-pretty text-base leading-relaxed text-[color:var(--color-fog)]/85 sm:text-lg">
                    {s.body}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120} className={flip ? "lg:order-1" : ""}>
                <figure role="img" aria-label={s.alt} className="mx-auto w-full max-w-xl">
                  {s.visual}
                </figure>
              </ScrollReveal>
            </li>
          );
        })}
      </ol>

      <ScrollReveal>
        <div className="mt-6 flex flex-col items-center gap-5 border-t border-white/10 pt-16 text-center lg:pt-20">
          <p className="max-w-xl text-pretty text-lg text-[color:var(--color-fog)]/85">
            Want to see how this would work for your business?
          </p>
          <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
            Book a call
            <span aria-hidden>→</span>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
