"use client";

import { useEffect, useRef, useState } from "react";
import { DomiMark } from "@/components/landing/DomiMark";
import { site } from "@/lib/site";

/* ── data ───────────────────────────────────────────────────────────────── */

const SIGNALS = [
  { t: "Training data", d: "What the model has already learned about brands, categories and reputations from the open web. Slow to change, but it compounds over time." },
  { t: "Live retrieval", d: "Perplexity, Gemini and ChatGPT with browsing pull from current web sources in real time. What’s citable today shapes answers today." },
  { t: "Entity understanding", d: "Whether the model can clearly work out who you are, what you do, who you serve and how you differ. Ambiguity kills recommendations." },
  { t: "Third-party validation", d: "Mentions, comparisons, reviews, directories and authoritative coverage. AI trusts what others say about you more than what you say about yourself." },
  { t: "Content clarity", d: "Whether your own site answers buyer questions directly enough to be quoted, summarised or cited." },
];

const ENTITY_QS = ["Who are you?", "What category are you in?", "Who do you serve?", "What problems do you solve?", "Where are you based?", "What are you known for?", "Who do you compare with?", "What proof exists?"];

const PILLARS = [
  { n: "1", title: "Technical clarity", sub: "Help AI systems understand you.", items: ["Schema markup (Organisation, FAQ, Service, Review)", "Crawlability and indexability: AI can’t cite what it can’t read", "llms.txt and clean site structure", "Consistent entity signals: same name, category and description everywhere"], icon: <path d="M4 7l8-4 8 4v10l-8 4-8-4z M12 3v18 M4 7l8 4 8-4" /> },
  { n: "2", title: "Answer authority", sub: "Give AI systems useful answers to cite.", items: ["Answer-first content that addresses real buyer questions directly", "Buyer-intent pages: comparisons, alternatives, “best for” breakdowns", "Category guides and decision-support content", "FAQs that match how buyers actually phrase questions to AI"], icon: <path d="M4 5h16v11H9l-4 4z M8 9h8 M8 12.5h5" /> },
  { n: "3", title: "External trust", sub: "Prove you deserve to be recommended.", items: ["Reviews and ratings on platforms AI reads", "Presence in directories, roundups and comparison articles AI cites", "Mentions in industry publications and trade sources", "The community threads and forums AI models pull from"], icon: <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z" /> },
];

const PROMPTS = [
  "Who are the best [your service/category] companies for [your target customer] in the UK?",
  "What companies should I consider if I need help with [the problem you solve]?",
  "Compare the top [category] providers and explain who each is best for.",
  "What are the best alternatives to [your best-known competitor]?",
  "What does [your brand] do, and who is it best suited for?",
  "Compare [your brand] with [competitor].",
];

const SCORECARD: [string, string][] = [
  ["Category visibility", "Are you recommended for your service category?"],
  ["Competitor visibility", "Are competitors named when you’re not?"],
  ["Citation visibility", "Does AI cite your website, or third-party sources about you?"],
  ["Accuracy", "Does AI describe your business correctly?"],
  ["Position", "If you appear, are you the first name, mid-list, or an afterthought?"],
  ["Sentiment", "Are mentions positive, neutral or weak?"],
];

const MISTAKES = [
  { t: "They treat AEO as a content problem only.", d: "More blog posts won’t help if AI can’t understand, trust or cite the brand behind them. Content is one pillar of three." },
  { t: "They test only branded prompts.", d: "Asking AI “what is [my company]?” tells you whether AI knows your name. It tells you nothing about whether buyers discover you when they ask the questions that matter." },
  { t: "They ignore third-party sources.", d: "AI often trusts what others say about you more than what you say about yourself. If you’re absent from the directories, comparisons and communities AI cites, your own site can only take you so far." },
  { t: "They optimise for Google rankings, not AI recommendations.", d: "Traditional SEO still matters, but AEO needs different signals. Ranking #3 on Google and being absent from every AI answer is the norm now, not the exception." },
];

const PHASES = [
  { range: "Days 1–30", title: "Baseline and technical foundation", items: ["Run AI visibility testing across your core buyer prompts, on every major platform", "Identify which competitors are mentioned, and which sources AI cites for them", "Fix crawlability, schema and indexability issues", "Create or improve llms.txt", "Clarify homepage, service pages and entity signals: who you are, for whom, in what category", "Map the buyer-intent prompts you want to win"] },
  { range: "Days 31–60", title: "Content and answer assets", items: ["Build answer-first service pages for your priority prompts", "Create comparison and alternatives pages", "Publish category guides and decision-support content", "Add FAQs matching real buyer questions, marked up with schema", "Strengthen author, organisation and proof signals", "Internally link content around your core topics"] },
  { range: "Days 61–90", title: "Authority and citation building", items: ["Get listed in the sources AI already cites for your category", "Build digital PR around proof points and expertise", "Improve review profiles and third-party validation", "Earn mentions in comparison articles, directories and trade publications", "Track AI mentions, citations, sentiment and share of voice weekly", "Refresh content based on what AI platforms actually cite"] },
];

const MODULES = [
  { id: 1, title: "The shift: buyers are asking AI who to trust", summary: "Why buying decisions now start and finish inside AI, and what that means for you.", time: "2 min" },
  { id: 2, title: "How AI recommendations actually work", summary: "The signals that shape AI answers, and the entity clarity most brands miss.", time: "3 min" },
  { id: 3, title: "The Visibility Stack: the three pillars", summary: "The three things every recommended brand gets right.", time: "2 min" },
  { id: 4, title: "The self-audit: are you visible?", summary: "Test your own visibility right now, and score it properly.", time: "3 min" },
  { id: 5, title: "Why most companies stay invisible", summary: "The four mistakes that keep good businesses out of AI answers.", time: "2 min" },
  { id: 6, title: "The 90-day AI visibility roadmap", summary: "The exact phased system we run, day 1 to day 90.", time: "3 min" },
];

/* ── small bits ─────────────────────────────────────────────────────────── */

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
          <Check className="mt-[5px] h-[15px] w-[15px] shrink-0 text-[color:var(--color-pine)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-pretty text-[16px] leading-relaxed text-[color:var(--color-ink-2)]">{children}</p>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-10 text-[clamp(1.2rem,2.6vw,1.55rem)] font-bold tracking-tight text-[color:var(--color-ink)]">{children}</h3>;
}

/* ── per-module content ─────────────────────────────────────────────────── */

function ModuleBody({ id }: { id: number }) {
  if (id === 1)
    return (
      <>
        <P>More and more buying decisions now start, and finish, inside ChatGPT, Perplexity and Google’s AI. Not a page of blue links. A single answer, with a handful of names in it.</P>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["Who’s the best accountant for freelancers in the UK?", "Compare the top project management tools for small agencies.", "Which clinic should I trust for skin treatments near me?"].map((q) => (
            <div key={q} className="rounded-xl border border-black/[0.08] bg-white p-4 text-[14px] italic leading-snug text-[color:var(--color-ink-2)]">“{q}”</div>
          ))}
        </div>
        <P>The AI answers those questions with specific recommendations. The brands named get the click, the enquiry, the booking. The brands not named don’t lose the comparison. They were never in it.</P>
        <P>Traditional search gave you ten chances on page one. AI search often gives you three names. The maths of visibility just changed, and most businesses haven’t noticed yet.</P>
      </>
    );
  if (id === 2)
    return (
      <>
        <P>There’s no single ranking algorithm behind an AI recommendation, but it isn’t random either. AI answers are shaped by a blend of signals, and each one can be influenced.</P>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SIGNALS.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[color:var(--color-pine)]/[0.1] text-[11px] font-bold text-[color:var(--color-pine)]">{i + 1}</span>
                <h4 className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">{s.t}</h4>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border-l-[3px] border-[color:var(--color-pine)] bg-white p-5 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
          <strong className="text-[color:var(--color-ink)]">Not all AI platforms work the same way.</strong> Some lean on live web citations (Perplexity), some on model memory (ChatGPT without browsing), and some blend both (Gemini, Google AI Mode). A brand can be visible on one platform and absent on another, which is why visibility has to be measured across all of them, not spot-checked on one.
        </div>
        <H3>Entity clarity: the concept most businesses have never heard of</H3>
        <P>AI systems need to understand your business as an <em>entity</em>: a clearly defined thing with attributes it can classify.</P>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ENTITY_QS.map((q) => (
            <div key={q} className="rounded-xl border border-black/[0.07] bg-white px-3.5 py-3 text-[13px] font-medium text-[color:var(--color-ink)]">{q}</div>
          ))}
        </div>
        <P>If AI systems cannot clearly classify your business, they are less likely to recommend you confidently. A confusing homepage, inconsistent descriptions across the web, or a category nobody else uses all make you harder to recommend, no matter how good you are.</P>
      </>
    );
  if (id === 3)
    return (
      <>
        <P>Everything that influences whether AI recommends you falls into three pillars. This is the framework we run for every client.</P>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.n} className="flex flex-col rounded-2xl border border-black/[0.08] bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--color-pine)]/[0.08] text-[color:var(--color-pine)]">
                  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{p.icon}</svg>
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">Pillar {p.n}</span>
              </div>
              <h4 className="mt-4 text-[19px] font-bold tracking-tight text-[color:var(--color-ink)]">{p.title}</h4>
              <p className="mt-1 text-[14px] italic text-[color:var(--color-pine)]">{p.sub}</p>
              <Bullets items={p.items} />
            </div>
          ))}
        </div>
        <P>Most businesses over-invest in one pillar (usually content) and ignore the others. AI recommendations require all three: a technically invisible site can’t be cited, brilliant content on an unclassifiable brand won’t be trusted, and a clear site nobody else mentions won’t be recommended.</P>
      </>
    );
  if (id === 4)
    return (
      <>
        <P>Don’t take our word for any of this. Test it yourself, right now.</P>
        <H3>Run these prompts</H3>
        <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">Open ChatGPT, Gemini and Perplexity and ask questions the way your buyers would.</p>
        <ol className="mt-5 space-y-2.5">
          {PROMPTS.map((q, i) => (
            <li key={q} className="flex items-start gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)] text-[12px] font-bold leading-none text-[color:var(--color-paper)]"><span className="translate-y-[0.5px]">{i + 1}</span></span>
              <span className="text-[14.5px] italic leading-snug text-[color:var(--color-ink-2)]">“{q}”</span>
            </li>
          ))}
        </ol>
        <P>The last two matter as much as the first four: they test whether AI <em>understands</em> you, not just whether it <em>discovers</em> you.</P>
        <H3>Score yourself</H3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
          {SCORECARD.map(([check, look], i) => (
            <div key={check} className={`grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[minmax(160px,220px)_1fr] sm:gap-5 ${i !== 0 ? "border-t border-black/[0.06]" : ""}`}>
              <div className="text-[14px] font-bold text-[color:var(--color-ink)]">{check}</div>
              <div className="text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{look}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.06] p-6">
          <h4 className="flex items-center gap-2 text-[16px] font-bold text-[color:var(--color-ink)]"><span aria-hidden>⚠️</span> One mention does not mean you’re visible</h4>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[color:var(--color-ink-2)]">The most common mistake: testing one prompt, seeing your name once, and concluding you’re fine. AI visibility is not binary. What actually matters:</p>
          <Bullets items={["How often you appear across many prompts", "Which platforms mention you (visible on one ≠ visible on all)", "Whether competitors appear more often than you", "Whether you’re cited with links or vaguely mentioned", "Whether descriptions of you are accurate", "Whether you appear for buyer-intent prompts, not just searches for your own name"]} />
          <p className="mt-4 text-[14.5px] leading-relaxed text-[color:var(--color-ink-2)]">Real visibility is measured across dozens of prompts, on every platform, over time, which is exactly why serious brands track it continuously rather than spot-checking.</p>
        </div>
      </>
    );
  if (id === 5)
    return (
      <>
        <P>Four mistakes keep good businesses out of AI answers.</P>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {MISTAKES.map((m, i) => (
            <div key={m.t} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <span className="text-[13px] font-bold text-[color:var(--color-pine)]">0{i + 1}</span>
              <h4 className="mt-2 text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">{m.t}</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{m.d}</p>
            </div>
          ))}
        </div>
      </>
    );
  // id === 6
  return (
    <>
      <P>This is the phased system we run. Every action here is real: the difference between reading it and results is execution.</P>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PHASES.map((ph) => (
          <div key={ph.range} className="flex flex-col rounded-2xl border border-black/[0.08] bg-white p-6">
            <span className="inline-flex w-fit rounded-full bg-[color:var(--color-pine)] px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-[color:var(--color-paper)]">{ph.range}</span>
            <h4 className="mt-4 text-[18px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">{ph.title}</h4>
            <Bullets items={ph.items} />
          </div>
        ))}
      </div>
      <P>Read that list honestly. It’s not complicated, but it’s a lot of coordinated work across technical, content and outreach, sustained for a quarter. That’s the real barrier, and it’s why most businesses that <em>know</em> about AEO still don’t act on it.</P>
    </>
  );
}

/* ── audit CTA (reused) ─────────────────────────────────────────────────── */

function AuditCta({ heading }: { heading: string }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white/[0.04] p-6 text-left sm:p-7">
      <h3 className="text-center text-[15px] font-bold text-[color:var(--color-paper)]">{heading}</h3>
      <ul className="mt-4 space-y-2.5">
        {["Test your brand across real buyer-intent AI prompts", "Show you where competitors are being recommended instead of you", "Identify the sources AI is already citing in your category", "Map your fastest route to more mentions, citations and recommendations"].map((it) => (
          <li key={it} className="flex gap-3 text-[14.5px] leading-relaxed text-[color:var(--color-paper)]/80">
            <Check className="mt-[4px] h-[15px] w-[15px] shrink-0 text-[color:var(--color-sage)]" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <a href={site.calendly} target="_blank" rel="noopener" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-domigreen)] px-7 py-4 text-base font-semibold text-[color:var(--color-charcoal)] transition-transform hover:-translate-y-0.5">
        Book your AI Visibility Audit
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

/* ── main ───────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "domi-playbook-progress";

export function PlaybookCourse() {
  const [done, setDone] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // hydrate progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: number[]) {
    setDone(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  // when a module opens: mark complete, lock scroll, reset overlay scroll, esc to close
  useEffect(() => {
    if (open === null) return;
    if (!done.includes(open)) persist([...done, open]);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.scrollTo(0, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const completedCount = done.length;
  const allDone = completedCount >= MODULES.length;
  const current = open ? MODULES.find((m) => m.id === open) : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--color-paper)] pb-24 text-[color:var(--color-ink-2)]">
      {/* Brand bar */}
      <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-6 py-6">
        <DomiMark className="h-7 w-7" />
        <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">DomiSearch</span>
      </div>

      {/* ===== HERO / HUB HEADER ===== */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-4 text-center sm:pt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.07] px-3.5 py-1.5 text-[13px] font-semibold text-[color:var(--color-pine)]">
            <Check className="h-4 w-4" /> Access unlocked
          </span>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">The AI Visibility Playbook</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance text-[clamp(2rem,5.4vw,3.2rem)] font-bold leading-[1.07] tracking-tight text-[color:var(--color-ink)]">
            How to become the brand <span className="text-[color:var(--color-pine)]">AI recommends</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
            The exact framework we use for our clients, in six short modules. Work through them at your own pace.
          </p>

          {/* progress */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[color:var(--color-ink-2)]">
              <span>{allDone ? "Playbook complete" : "Your progress"}</span>
              <span>{completedCount} of {MODULES.length} modules</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/[0.08]">
              <div className="h-full rounded-full bg-[color:var(--color-pine)] transition-[width] duration-500" style={{ width: `${(completedCount / MODULES.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* completion banner */}
      {allDone && (
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.07] px-6 py-6 text-center sm:flex-row sm:text-left">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)] text-[color:var(--color-paper)]"><Check className="h-6 w-6" /></span>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-[color:var(--color-ink)]">You’ve completed the playbook.</p>
              <p className="text-[14px] text-[color:var(--color-ink-2)]">You now have the full framework. See exactly where your brand stands with a free audit.</p>
            </div>
            <a href={site.calendly} target="_blank" rel="noopener" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-3 text-[14px] font-semibold text-[color:var(--color-paper)] transition-transform hover:-translate-y-0.5">
              Book your audit <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}

      {/* ===== MODULE GRID ===== */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {MODULES.map((m) => {
            const isDone = done.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => setOpen(m.id)}
                className="group flex flex-col rounded-2xl border border-black/[0.08] bg-white p-6 text-left shadow-[0_16px_44px_-30px_rgba(20,17,13,0.4)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-[14px] font-bold leading-none ${isDone ? "bg-[color:var(--color-pine)] text-[color:var(--color-paper)]" : "bg-[color:var(--color-pine)]/[0.1] text-[color:var(--color-pine)]"}`}>
                    {isDone ? <Check className="h-4 w-4" /> : <span className="translate-y-[0.5px]">{m.id}</span>}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${isDone ? "text-[color:var(--color-pine)]" : "text-[color:var(--color-ink-3)]"}`}>
                    {isDone ? "Completed" : `Module ${m.id}`}
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">{m.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{m.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] text-[color:var(--color-ink-3)]">{m.time} read</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-pine)]">
                    {isDone ? "Review" : "Start"}
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== PROOF (reward) ===== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">Proof</p>
          <h2 className="mt-3 text-balance text-[clamp(1.6rem,3.6vw,2.35rem)] font-bold leading-[1.12] tracking-tight text-[color:var(--color-ink)]">Taxd: from 0 to 200+ weekly AI mentions</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              {[
                ["Before", "Taxd, a UK tax platform, had no meaningful AI visibility across the commercial prompts that mattered. When people asked AI for tax help, competitors were named. Taxd wasn’t."],
                ["The work", "Technical foundation. Entity clarity. Answer-led content mapped to real buyer questions. Citation building in the sources AI trusts. Continuous visibility tracking across every major platform."],
                ["After", "200+ AI mentions every week, and climbing. Taxd now appears when buyers ask ChatGPT, Gemini and Perplexity for help with UK tax."],
              ].map(([label, body]) => (
                <div key={label} className="border-l-2 border-[color:var(--color-pine)]/30 pl-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-pine)]">{label}</div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">{body}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_18px_44px_-30px_rgba(20,17,13,0.4)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[2.4rem] font-bold leading-none tracking-tight text-[color:var(--color-ink)]">200+<span className="text-base font-semibold text-[color:var(--color-ink-3)]"> /week</span></div>
                  <div className="mt-1.5 text-[12px] font-semibold text-[color:var(--color-pine)]">▲ from 0 in 90 days</div>
                </div>
                <span className="rounded-full bg-[color:var(--color-pine)]/[0.1] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[color:var(--color-pine)]">Live</span>
              </div>
              <svg viewBox="0 0 200 80" className="mt-6 h-[150px] w-full" preserveAspectRatio="none" aria-hidden>
                <defs><linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#01634c" stopOpacity="0.2" /><stop offset="100%" stopColor="#01634c" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 75 L28 72 L56 66 L84 56 L112 45 L140 31 L168 18 L200 6 L200 80 L0 80 Z" fill="url(#pcFill)" />
                <path d="M0 75 L28 72 L56 66 L84 56 L112 45 L140 31 L168 18 L200 6" fill="none" stroke="#01634c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2 flex justify-between text-[11px] text-[color:var(--color-ink-3)]"><span>Week 1</span><span>Week 12</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-sage)]">Your move</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-[clamp(1.8rem,4.6vw,2.7rem)] font-bold leading-[1.1] tracking-tight">Build it yourself, or shortcut the process</h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-paper)]/70">
            You now have the full framework. You could run this playbook yourself over the next 90 days. Or let the team that took Taxd from 0 to 200+ weekly AI mentions show you exactly where your brand stands today.
          </p>
          <div className="mt-9"><AuditCta heading="On your AI Visibility Audit, we’ll:" /></div>
          <p className="mt-10 text-[13px] text-[color:var(--color-paper)]/50">DomiSearch, the Search Growth Partner behind Taxd’s AI visibility.</p>
        </div>
      </section>

      {/* ===== STICKY CTA (hub only) ===== */}
      {open === null && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.08] bg-[color:var(--color-paper)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
            <span className="hidden text-[13px] font-medium text-[color:var(--color-ink-2)] sm:block">
              {allDone ? "Playbook complete — ready for your audit?" : `Playbook · ${completedCount}/${MODULES.length} complete`}
            </span>
            <a href={site.calendly} target="_blank" rel="noopener" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-3 text-[14px] font-semibold text-[color:var(--color-paper)] transition-transform hover:-translate-y-0.5 sm:flex-none">
              Book your AI Visibility Audit <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}

      {/* ===== MODULE OVERLAY ===== */}
      {current && (
        <div ref={overlayRef} className="fixed inset-0 z-[100] overflow-y-auto bg-[color:var(--color-paper)]" role="dialog" aria-modal="true" aria-label={current.title}>
          {/* sticky overlay header */}
          <div className="sticky top-0 z-10 border-b border-black/[0.08] bg-[color:var(--color-paper)]/95 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-pine)]">Module {current.id} of {MODULES.length}</div>
                <div className="truncate text-[14px] font-bold text-[color:var(--color-ink)]">{current.title}</div>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Back to playbook" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.12] px-3.5 py-2 text-[13px] font-semibold text-[color:var(--color-ink-2)] transition-colors hover:bg-black/[0.04] hover:text-[color:var(--color-ink)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
                Close
              </button>
            </div>
            <div className="h-1 w-full bg-black/[0.06]"><div className="h-full bg-[color:var(--color-pine)]" style={{ width: `${(current.id / MODULES.length) * 100}%` }} /></div>
          </div>

          {/* module content */}
          <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-pine)]/[0.09] px-3 py-1 text-[12px] font-semibold text-[color:var(--color-pine)]">
              <Check className="h-3.5 w-3.5" /> Marked complete
            </span>
            <h2 className="mt-5 text-balance text-[clamp(1.7rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--color-ink)]">{current.title}</h2>
            <ModuleBody id={current.id} />

            {/* module nav */}
            <div className="mt-12 flex items-center justify-between gap-3 border-t border-black/[0.08] pt-6">
              {current.id > 1 ? (
                <button onClick={() => setOpen(current.id - 1)} className="inline-flex items-center gap-2 rounded-full border border-black/[0.12] px-5 py-3 text-[14px] font-semibold text-[color:var(--color-ink-2)] transition-colors hover:bg-black/[0.04] hover:text-[color:var(--color-ink)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
                  Previous
                </button>
              ) : (
                <span />
              )}
              {current.id < MODULES.length ? (
                <button onClick={() => setOpen(current.id + 1)} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-6 py-3 text-[14px] font-semibold text-[color:var(--color-paper)] transition-transform hover:-translate-y-0.5">
                  Next module
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              ) : (
                <button onClick={() => setOpen(null)} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-pine)] px-6 py-3 text-[14px] font-semibold text-[color:var(--color-paper)] transition-transform hover:-translate-y-0.5">
                  Finish playbook
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* in-module CTA (always reachable) */}
            <div className="mt-10 rounded-2xl bg-[color:var(--color-ink)] p-6 text-center sm:p-8">
              <AuditCta heading="Want us to run this for your brand?" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
