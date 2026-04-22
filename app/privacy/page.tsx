import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DomiSearch collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <ScrollReveal as="span" className="eyebrow">Legal</ScrollReveal>
      <ScrollReveal delay={60}>
        <h1 className="display mt-4 text-4xl sm:text-5xl">Privacy Policy</h1>
      </ScrollReveal>
      <ScrollReveal delay={140}>
        <div className="prose-dsrc mt-10">
          <p>
            This policy explains how DomiSearch collects and uses personal data. We take
            your privacy seriously and only collect what we need to respond to enquiries,
            deliver our services and run our website.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>Information you submit via our contact form (name, email, company, message).</li>
            <li>Basic analytics data (pages visited, device type, referrer) via Vercel Analytics. We do not use third-party tracking cookies.</li>
            <li>Information exchanged during client engagements, held securely in our internal systems.</li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To respond to enquiries and provide proposals.</li>
            <li>To deliver services contracted between us and our clients.</li>
            <li>To improve our website and understand how visitors use it (in aggregate).</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            We use Resend to deliver contact-form emails and Vercel to host our site. These
            providers process limited data on our behalf under their own privacy terms. We do
            not sell personal data.
          </p>

          <h2>Your rights</h2>
          <p>
            Under UK GDPR, you can request a copy of any personal data we hold about you, ask us
            to correct or delete it, or object to our processing. Email {site.email} and we'll
            respond within 30 days.
          </p>

          <h2>Retention</h2>
          <p>
            We keep contact-form enquiries for 24 months, or longer if they lead to an ongoing
            client relationship. Client records are kept for as long as legally required.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy? Email {site.email} or write to DomiSearch, Manchester,
            United Kingdom.
          </p>

          <p className="text-sm opacity-70">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
