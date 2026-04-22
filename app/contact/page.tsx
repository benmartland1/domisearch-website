import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { contactPageSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact - Talk to DomiSearch",
  description:
    "Reach out to DomiSearch. Email, phone, or book a free 30-minute audit call with our founder Ben.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Contact", url: `${site.url}/contact` },
          ]),
        ]}
      />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">Get in touch</ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)]">
              Let's talk about what
              <br />
              <span className="text-[color:var(--color-domigreen)]">search can do for you.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85">
              Send us a message, email, or book a free 30-minute call with Ben. We reply to every
              enquiry within one working day.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ScrollReveal>
            <ContactForm />
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <div className="flex flex-col gap-6">
              <div className="card p-8">
                <div className="eyebrow">Straight to Ben</div>
                <p className="mt-4 text-[color:var(--color-fog)]/85">
                  Prefer to skip the form? Book a free 30-minute audit call.
                </p>
                <Link
                  href={site.calendly}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary mt-6"
                >
                  Book a call
                  <span aria-hidden>→</span>
                </Link>
              </div>

              <div className="card p-8">
                <div className="eyebrow">Direct</div>
                <dl className="mt-5 space-y-4 text-[color:var(--color-fog)]/85">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/60">Email</dt>
                    <dd className="mt-1">
                      <a className="text-[color:var(--color-glacier)] hover:text-[color:var(--color-domigreen)]" href={`mailto:${site.email}`}>
                        {site.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/60">Phone</dt>
                    <dd className="mt-1">
                      <a className="text-[color:var(--color-glacier)] hover:text-[color:var(--color-domigreen)]" href={`tel:${site.phoneHref}`}>
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/60">Where</dt>
                    <dd className="mt-1">{site.city}, {site.country}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="pb-32" />
    </>
  );
}
