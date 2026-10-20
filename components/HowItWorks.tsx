import Link from "next/link";
import { AnswerCard, NotMentioned } from "./light/AnswerCard";
import { IllustratedSteps, type IllustratedStep } from "./light/IllustratedSteps";
import { Arrow, Mark, pillOutline, pillSolid, SectionIntro } from "./light/Primitives";
import { EnquiryVisual, ReportVisual, WebsiteVisual } from "./light/StepVisuals";
import { ScrollReveal } from "./ScrollReveal";
import { site } from "@/lib/site";

/*
 * Homepage "How it works". Four numbered steps, each paired with a familiar
 * illustration: an AI search, a website page, an enquiry email and a simple
 * report. The examples are illustrative throughout: no performance figures,
 * no named real businesses, no promised outcomes, and every mock-up is
 * tagged as an example. Domi Studio appears once, as a supporting detail in
 * the reporting step.
 */

const steps: IllustratedStep[] = [
  {
    title: "Find the questions your potential clients ask.",
    body: "We research what people type into AI tools when they are looking for a business like yours, then check who gets named today. That shows us where you are missing and where to focus first.",
    alt: "An AI search window answering “Which recruitment agencies can help us hire a sales director in London?” with three other businesses named, and a note that your company is not mentioned.",
    visual: (
      <AnswerCard
        query="Which recruitment agencies can help us hire a sales director in London?"
        lead="A few agencies specialise in senior sales hires in London:"
        rows={[
          { name: "A national generalist", meta: "Multi-sector · UK-wide" },
          { name: "A London search boutique", meta: "Executive search · London" },
          { name: "A job board", meta: "Listings · UK-wide" },
        ]}
        sources={["industry guide", "client reviews", "a directory"]}
        footer={<NotMentioned name="Your company" />}
      />
    ),
  },
  {
    title: "Improve your website and content to answer them.",
    body: "We make your services, locations, experience and client results clear on your website, and publish useful guides that answer the questions from step one. AI tools can then understand what you do and quote you with confidence.",
    alt: "A service page for sales director recruitment and a hiring guide on your website, leading to an AI answer that recommends your company.",
    visual: (
      <WebsiteVisual
        domain="yourcompany.co.uk"
        pageKicker="Service"
        pageTitle="Sales director recruitment"
        pageIntro="Retained search for senior sales leaders across London and the South East."
        bullets={[
          "Shortlist within four weeks",
          "Retained and exclusive search",
          "Placed sales leaders in scale-ups and established firms",
        ]}
        quote="They found us a sales director who hit the ground running."
        guideKicker="Hiring guide"
        guideTitle="Hiring a sales director in London"
        guideBlurb="What to pay right now, what a strong candidate looks like at your stage, and the questions that separate them from polished ones."
        answer={
          <>
            For a sales director hire in London, <Mark>Your company</Mark> is worth a look. They run
            retained searches for senior sales roles and publish practical guidance on the hiring
            process.
          </>
        }
      />
    ),
  },
  {
    title: "Make it easy for interested visitors to enquire.",
    body: "Once someone finds you, they need a reason to choose you and a simple way to get in touch. Clear service pages, convincing client stories and a short enquiry form turn a visit into a conversation.",
    alt: "A website enquiry form leading to an email that reads: “Hi, we’re looking to appoint a sales director in London and your name came up when we were researching. Are you available for a call this week?”",
    visual: (
      <EnquiryVisual
        name="James Mitchell"
        role="Operations Director"
        subject="Sales director appointment"
        body="Hi, we’re looking to appoint a sales director in London and your name came up when we were researching. Are you available for a call this week?"
        signoff="James"
        formLine="We need a sales director in London…"
      />
    ),
  },
  {
    title: "Track what changes and keep improving.",
    body: "We track the same questions every day, record each change we make and review what happened afterwards. Your monthly report shows what was published, where you appeared and what we will do next.",
    alt: "A simple monthly report showing what was published, where the business appeared and the next action, with a note that each change is dated in Domi Studio.",
    visual: (
      <ReportVisual
        company="Your company"
        period="This month"
        rows={[
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
            label: "Next",
            body: "Add a recent client story to the service page",
            note: "So the answer has a result to point to.",
          },
        ]}
      />
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto mt-20 max-w-6xl px-5 sm:px-6 lg:mt-28">
      <SectionIntro
        label="How it works"
        title="How we help turn AI searches into new clients."
        description="Four steps, each shown with an example. The screens below are illustrations of the kind of work we do, not real client results."
      />

      <div className="mt-14 lg:mt-20">
        <IllustratedSteps steps={steps} />
      </div>

      <ScrollReveal>
        <div className="mt-4 flex flex-col items-center gap-5 border-t border-black/[0.08] pt-14 text-center lg:pt-16">
          <p className="max-w-xl text-pretty text-[17px] text-[color:var(--color-ink-2)]">
            Want to see how this would work for your business?
          </p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a href={site.calendly} target="_blank" rel="noopener" className={pillSolid}>
              Book a call
              <Arrow />
            </a>
            <Link href="/#visibility-check" className={pillOutline}>
              Check my AI visibility
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
