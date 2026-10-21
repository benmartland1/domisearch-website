import Image from "next/image";
import { site } from "@/lib/site";
import type { TrustpilotReview } from "@/lib/trustpilot";
import { homeFaqs } from "./faqs";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { Ticker } from "./Ticker";
import { VisibilityReviewForm } from "./VisibilityReviewForm";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

/*
 * The approved homepage, built section for section from the supplied mockup
 * (components/home/approved.css carries its stylesheet). Copy, order and
 * layout follow the mockup; the one agreed departure is the reviews section,
 * which shows every Trustpilot review in full in a scrolling row.
 *
 * Imagery is the site's own: the phone hero, the client and AI platform
 * logos, Ben's photo and the Taxd founders' headshots.
 */

const ENGINES = [
  { name: "ChatGPT", icon: "/engines/openai.svg" },
  { name: "Gemini", icon: "/engines/gemini.svg" },
  { name: "Perplexity", icon: "/engines/perplexity.svg" },
  { name: "Claude", icon: "/engines/claude.svg" },
  { name: "Google AI\nOverviews", icon: "/engines/google.svg" },
];

/** Mockup order. Files are the site's existing client logos. */
const CLIENTS = [
  { name: "Taxd", logo: "/clients/taxd.png", w: 120, h: 44 },
  { name: "Rooftop Saunas", logo: "/clients/rooftop_saunas.png", w: 135, h: 31 },
  { name: "Fueled", logo: "/clients/fueled.png", w: 120, h: 28 },
  { name: "Netil360", logo: "/clients/netil360.png", w: 120, h: 23 },
  { name: "Garside Waddingham", logo: "/clients/garside_waddingham.png", w: 135, h: 52 },
  { name: "Mighty Student Living", logo: "/clients/mighty_student_living.png", w: 120, h: 44 },
  { name: "Lancashire Smiles", logo: "/clients/lancashire_smiles.png", w: 120, h: 44 },
  { name: "David Farrer", logo: "/clients/david_farrer.png", w: 120, h: 44 },
  { name: "The Birds Nest", logo: "/clients/birds_nest.png", w: 120, h: 44 },
  { name: "Typo", logo: "/clients/typo.png", w: 120, h: 44 },
];

const SECTORS = [
  { label: "Recruitment agencies", note: "Help employers find your specialist expertise.", href: "/recruitment" },
  { label: "Accountancy practices", note: "Answer the questions that lead to a client relationship.", href: "/accountants" },
  { label: "Clinics & healthcare", note: "Make services, experience and evidence clear.", href: "/healthcare" },
  { label: "Care homes", note: "Specialist support through DomiCare, our care brand.", href: "https://www.domicare.ai", external: true },
  { label: "Other service businesses", note: "Let’s look at how your potential clients search.", href: "#visibility-check" },
];

function Arrow({ children = "↗" }: { children?: string }) {
  return <span className="ds-arrow">{children}</span>;
}

function ExternalLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function ApprovedHome({ reviews, reviewCount }: { reviews: TrustpilotReview[]; reviewCount: number }) {
  return (
    <div className="ds-site" data-surface="paper">
      <div className="ds-page">
        <Ticker />
        <SiteNav />
      </div>

      {/* ===== Hero: "Search in the real world" ===== */}
      <div className="ds-approved-hero" aria-label="Homepage hero">
        <section aria-label="Search in the real world hero">
          <div className="ds-page ds-hero-stage">
            <div className="ds-wrap ds-hero-grid">
              <div className="ds-hero-copy">
                <span className="ds-eyebrow">AI search visibility for service businesses</span>
                <h1>
                  Be the brand{" "}
                  <br />
                  AI <span className="ds-underlined">recommends.</span>
                </h1>
                <p className="ds-lead">
                  Your next client is asking AI who to trust. We help your business become part of the
                  answer.
                </p>
                <div className="ds-actions">
                  <a className="ds-button" href="#visibility-check">
                    Request my AI visibility review <Arrow />
                  </a>
                </div>
                <p className="ds-hero-note">Free check across ChatGPT, Gemini &amp; Perplexity.</p>
                <a className="ds-text-link" style={{ marginTop: 17 }} href="#results">
                  See the Taxd result <span>↓</span>
                </a>
              </div>
              <figure className="ds-phones">
                <Image
                  src="/brand/hero.png"
                  alt="DomiSearch’s phone imagery showing ChatGPT and Google search"
                  width={700}
                  height={700}
                  priority
                  sizes="(max-width: 700px) 340px, (max-width: 1400px) 45vw, 640px"
                />
                <figcaption className="ds-photo-caption">
                  <span>A new way to search.</span>
                  <span>The same need for trust.</span>
                </figcaption>
              </figure>
            </div>
            <div className="ds-wrap">
              <div className="ds-engine-strip">
                <span>
                  Get found where{" "}
                  <br />
                  your clients are looking.
                </span>
                <div className="ds-engines">
                  {ENGINES.map((e) => (
                    <span key={e.name} className="ds-engine">
                      <Image src={e.icon} alt="" width={23} height={23} />
                      {e.name.includes("\n") ? (
                        <>
                          {e.name.split("\n")[0]}
                          <br />
                          {e.name.split("\n")[1]}
                        </>
                      ) : (
                        e.name
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="ds-page">
        {/* ===== Client strip ===== */}
        <section className="ds-client-strip ds-wrap" aria-label="Selected client brands">
          <span className="ds-eyebrow">Some of the businesses we’ve worked with</span>
          <div className="ds-client-logos">
            {CLIENTS.map((c) => (
              <Image key={c.name} src={c.logo} alt={c.name} width={c.w} height={c.h} sizes="160px" />
            ))}
          </div>
        </section>

        {/* ===== The evidence ===== */}
        <section id="results" className="ds-section ds-wrap">
          <div className="ds-case-intro">
            <div>
              <span className="ds-eyebrow">The evidence</span>
              <h2>
                A real business.
                <br />
                A measurable presence.
              </h2>
            </div>
            <p>For Taxd, we track whether the brand is appearing in the AI answers that matter to its market.</p>
          </div>
          <div className="ds-case">
            <div className="ds-case-result">
              <div className="ds-case-topline">
                <Image src="/clients/taxd.png" alt="Taxd" width={111} height={41} />
                <span>UK tax software</span>
              </div>
              <div className="ds-case-number">689</div>
              <p className="ds-case-number-caption">
                times Taxd was named{" "}
                <br />
                in tracked AI answers.
              </p>
              <div className="ds-case-scope">
                <span>
                  <b>1,080</b>AI answers checked
                </span>
                <span>
                  <b>3</b>AI platforms measured
                </span>
              </div>
            </div>
            <div className="ds-case-quote">
              <div>
                <div className="ds-quote-mark" aria-hidden="true">
                  “
                </div>
                <blockquote>
                  Taxd has grown a phenomenal customer base thanks to our fantastic search acquisition
                  strategy.
                </blockquote>
              </div>
              <div className="ds-mini-person">
                <Image src="/testimonials/eamon-shahir.png" alt="Eamon Shahir" width={64} height={64} />
                <p>
                  Eamon Shahir{" "}
                  <br />
                  <small>Co-Founder, Taxd</small>
                </p>
              </div>
            </div>
          </div>
          <div className="ds-case-footnote">
            <details className="ds-measurement">
              <summary>How to read these numbers</summary>
              <p>
                These figures describe the answers in the tracked set. They are not a count of all AI
                conversations, unique users, enquiries or revenue.
              </p>
            </details>
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section id="how-it-works" className="ds-journey ds-section ds-wrap">
          <div className="ds-journey-heading">
            <span className="ds-eyebrow">How it works</span>
            <h2>
              How we help turn AI searches{" "}
              <br />
              into <span className="ds-underlined">new clients.</span>
            </h2>
            <p>Helping the right people find your business, trust your expertise and get in touch.</p>
          </div>
          <div className="ds-journey-rail" aria-label="Four steps from AI research to ongoing improvement">
            <span>
              <b>01</b> Find the questions
            </span>
            <span>
              <b>02</b> Build the answer
            </span>
            <span>
              <b>03</b> Make contact easy
            </span>
            <span>
              <b>04</b> Keep improving
            </span>
          </div>
          <div className="ds-journey-scenario">Following a recruitment buyer’s journey</div>

          <article className="ds-journey-row">
            <div className="ds-journey-copy">
              <span className="ds-journey-number">01 / Research</span>
              <h3>
                We find the questions{" "}
                <br />
                your next client is asking.
              </h3>
              <p>
                We research the questions people ask when looking for services like yours, and see which
                businesses AI recommends. This helps us decide where to focus your strategy.
              </p>
              <span className="ds-journey-takeaway">Start with how your buyers actually search.</span>
            </div>
            <div className="ds-journey-art ds-art-search">
              <div className="ds-search-demo">
                <div className="ds-demo-brand">
                  <Image src="/engines/openai.svg" alt="" width={25} height={25} />
                  <strong>ChatGPT</strong>
                  <span>Buyer research</span>
                </div>
                <p className="ds-demo-question">
                  Which recruitment agencies can help us hire a sales director in London?
                </p>
                <div className="ds-research-notes">
                  <span>
                    <b>We examine</b>Which businesses appear
                  </span>
                  <span>
                    <b>We investigate</b>The sources behind the answer
                  </span>
                  <span>
                    <b>We identify</b>Where your business could fit
                  </span>
                </div>
              </div>
              <div className="ds-art-footer">
                <Image src="/engines/gemini.svg" alt="Gemini" width={20} height={20} />
                <Image src="/engines/perplexity.svg" alt="Perplexity" width={20} height={20} />
                <Image src="/engines/claude.svg" alt="Claude" width={20} height={20} />
                <Image src="/engines/google.svg" alt="Google" width={20} height={20} />
                <span>Research across the engines your clients use.</span>
              </div>
            </div>
          </article>

          <article className="ds-journey-row ds-journey-reverse">
            <div className="ds-journey-copy">
              <span className="ds-journey-number">02 / Content &amp; website</span>
              <h3>
                We help your business{" "}
                <br />
                become the answer.
              </h3>
              <p>
                We improve your website and create useful content that answers those questions. Your
                services, experience and client results become easier for AI to understand and potential
                clients to trust.
              </p>
              <span className="ds-journey-takeaway">Make your expertise clear, useful and credible.</span>
            </div>
            <div className="ds-journey-art ds-art-content">
              <div className="ds-website-demo">
                <div className="ds-browser-line">
                  <span className="ds-browser-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>yourcompany.co.uk</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="ds-demo-content">
                  <span className="ds-demo-kicker">Expert insight · Hiring guide</span>
                  <h4>
                    Hiring a sales{" "}
                    <br />
                    director in London
                  </h4>
                  <p>What to look for, what to pay and the questions to ask.</p>
                  <div className="ds-demo-byline">
                    <span className="ds-initials" aria-hidden="true">
                      Y
                    </span>
                    <span>
                      By your team{" "}
                      <br />
                      <small>Built on your real experience</small>
                    </span>
                  </div>
                  <div className="ds-demo-service">
                    <span>Specialist service page</span>
                    <strong>
                      Sales director recruitment <span>↗</span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="ds-journey-row">
            <div className="ds-journey-copy">
              <span className="ds-journey-number">03 / Enquiries</span>
              <h3>We make it easier for interested buyers to get in touch.</h3>
              <p>
                Once someone discovers your business, they need to understand why you’re a good fit. Clear
                service pages, convincing client stories and a simple enquiry process help them take the
                next step.
              </p>
              <span className="ds-journey-takeaway">Give interested people a clear next step.</span>
            </div>
            <div className="ds-journey-art ds-art-enquiry">
              <div className="ds-email-demo">
                <div className="ds-demo-brand ds-gmail-brand">
                  <Image src="/engines/gmail.svg" alt="" width={28} height={22} />
                  <strong>Gmail</strong>
                  <span>Inbox</span>
                </div>
                <div className="ds-email-content">
                  <h4>Sales director appointment</h4>
                  <div className="ds-email-sender">
                    <span className="ds-initials">JM</span>
                    <div>
                      <strong>James Mitchell</strong>
                      <small>Operations Director · to you</small>
                    </div>
                  </div>
                  <p>Hi, we’re looking to appoint a sales director in London. Are you available for a call this week?</p>
                  <p>
                    Thanks,{" "}
                    <br />
                    James
                  </p>
                  <div className="ds-email-actions" aria-hidden="true">
                    <span>↩ &nbsp; Reply</span>
                    <span>↪ &nbsp; Forward</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="ds-journey-row ds-journey-reverse">
            <div className="ds-journey-copy">
              <span className="ds-journey-number">04 / Measure &amp; improve</span>
              <h3>
                We track what changes{" "}
                <br />
                and keep improving.
              </h3>
              <p>
                We monitor where your business gets mentioned, review the work we’ve completed and use what
                we learn to decide what to do next.
              </p>
              <p>
                Domi Studio connects completed work with visibility data, so your monthly review can focus
                on what changed and the next priorities.
              </p>
              <span className="ds-journey-takeaway">A clear record of the work and what follows.</span>
            </div>
            <div className="ds-journey-art ds-art-report">
              <div className="ds-report-demo">
                <div className="ds-report-header">
                  <strong>
                    Domi <span>Studio</span>
                  </strong>
                  <span>This month</span>
                </div>
                <div className="ds-report-company">
                  Your company <span>Work &amp; visibility</span>
                </div>
                <div className="ds-report-entry">
                  <span className="ds-report-dot" />
                  <div>
                    <b>Published</b>
                    <h4>Hiring a sales director in London</h4>
                    <p>Guide published. Service page updated to match.</p>
                  </div>
                </div>
                <div className="ds-report-entry">
                  <span className="ds-report-dot ds-dot-outline" />
                  <div>
                    <b>Tracking</b>
                    <h4>Where your company appears</h4>
                    <p>Mentions, citations and competitor appearances across the agreed questions.</p>
                  </div>
                </div>
                <div className="ds-report-entry">
                  <span className="ds-report-dot ds-dot-next" />
                  <div>
                    <b>Next action</b>
                    <h4>Add a recent client story</h4>
                    <p>Give the service page a result to point to.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="ds-journey-cta">
            <p>Want to see how this would work for your business?</p>
            <ExternalLink className="ds-button" href={site.calendly}>
              Book a call <Arrow />
            </ExternalLink>
          </div>
        </section>

        {/* ===== First 90 days ===== */}
        <section className="ds-plan ds-wrap" id="programme">
          <div className="ds-plan-header">
            <div>
              <span className="ds-eyebrow">Your first 90 days</span>
              <h2>
                A plan with work{" "}
                <br />
                behind it.
              </h2>
            </div>
            <p className="ds-lead">
              A focused initial programme to establish your starting point, put the right work in place
              and review what the evidence shows.
            </p>
          </div>
          <div className="ds-timeline">
            <article className="ds-month">
              <span className="ds-eyebrow">Month one</span>
              <h3>Research &amp; foundations</h3>
              <p>Map the questions, audit your website and agree the content and technical priorities.</p>
            </article>
            <article className="ds-month">
              <span className="ds-eyebrow">Month two</span>
              <h3>Publish &amp; improve</h3>
              <p>Build out useful answers and improve the pages that explain your expertise and services.</p>
            </article>
            <article className="ds-month">
              <span className="ds-eyebrow">Month three</span>
              <h3>Measure &amp; refine</h3>
              <p>Review the tracked answers, look at the changes and set the next priorities together.</p>
            </article>
          </div>
          <div className="ds-plan-bottom">
            <p>
              We track progress throughout. The first 90 days give us a defined period to deliver and
              review; they aren’t a deadline for a guaranteed recommendation.
            </p>
            <a className="ds-text-link" href="#visibility-check">
              Find your starting point <span>↗</span>
            </a>
          </div>
        </section>

        {/* ===== Who we work with ===== */}
        <section className="ds-sector ds-section ds-wrap">
          <div>
            <span className="ds-eyebrow">Who we work with</span>
            <h2>
              For businesses{" "}
              <br />
              chosen on trust.
            </h2>
            <p className="ds-lead">When clients compare expertise before they get in touch, the recommendation matters.</p>
          </div>
          <div className="ds-sector-list">
            {SECTORS.map((s) =>
              s.external ? (
                <ExternalLink key={s.label} href={s.href}>
                  <span>
                    {s.label}
                    <small>{s.note}</small>
                  </span>
                  <Arrow />
                </ExternalLink>
              ) : (
                <a key={s.label} href={s.href}>
                  <span>
                    {s.label}
                    <small>{s.note}</small>
                  </span>
                  <Arrow />
                </a>
              ),
            )}
          </div>
        </section>

        {/* ===== Meet the founder ===== */}
        <section className="ds-people" id="about">
          <figure className="ds-founder-photo">
            <Image
              src="/brand/founder.png"
              alt="Ben Martland, founder of DomiSearch"
              width={550}
              height={550}
              sizes="(max-width: 700px) 100vw, 46vw"
            />
            <figcaption className="ds-founder-caption">
              Ben Martland
              <small>Founder, DomiSearch · Manchester, UK</small>
            </figcaption>
          </figure>
          <div className="ds-founder-copy">
            <span className="ds-eyebrow">Meet the founder</span>
            <h2>
              Hi, I’m Ben.{" "}
              <br />
              Let’s make your{" "}
              <br />
              expertise visible.
            </h2>
            <p>
              I founded DomiSearch in 2023, after five years in search marketing, running paid search for
              e-commerce and service businesses in-house and agency-side.
            </p>
            <p>
              Today I lead our AI search research and delivery, and personally review every client
              account. We start by looking at why one firm gets named in AI answers and another doesn’t.
            </p>
            <p>We work with UK service businesses, with recruitment agencies a core focus.</p>
            <div className="ds-founder-facts">
              <span>
                <b>2023</b> DomiSearch founded
              </span>
              <span>
                <b>Every account</b> personally reviewed
              </span>
            </div>
            <div className="ds-actions">
              <ExternalLink className="ds-text-link" href={site.calendly}>
                Book a call with us <span>↗</span>
              </ExternalLink>
              <a className="ds-text-link" href="/about">
                More about the agency <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== Reviews: every Trustpilot review, in full ===== */}
        <section id="reviews" className="ds-reviews ds-section ds-wrap" aria-labelledby="reviews-heading">
          <div className="ds-voices-header">
            <div>
              <span className="ds-eyebrow">In our clients’ words</span>
              <h2 id="reviews-heading">
                What our{" "}
                <br />
                clients say.
              </h2>
              <p className="ds-reviews-intro">Every review on Trustpilot, shown in full.</p>
            </div>
            <ExternalLink className="ds-review-source" href={site.trustpilot}>
              <strong>
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </strong>
              <span>Read them on Trustpilot ↗</span>
            </ExternalLink>
          </div>
          <ReviewsCarousel reviews={reviews} />
        </section>

        {/* ===== FAQ ===== */}
        <section className="ds-faq ds-section ds-wrap">
          <div className="ds-faq-intro">
            <span className="ds-eyebrow">Before we talk</span>
            <h2>
              Common{" "}
              <br />
              questions.
            </h2>
            <p>What the work involves, how we measure it and what you can expect.</p>
          </div>
          <div className="ds-faq-list">
            {homeFaqs.map((f, i) => (
              <details key={f.question} open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== Visibility review form ===== */}
        <section className="ds-review ds-section ds-wrap" id="visibility-check">
          <div className="ds-review-copy">
            <span className="ds-eyebrow">Start with the evidence</span>
            <h2>
              Find out where{" "}
              <br />
              <span>you stand.</span>
            </h2>
            <p>Get a free AI visibility review for your business. See what potential clients might find, and where we’d focus first.</p>
            <ul className="ds-review-checks">
              <li>Where your business appears today</li>
              <li>Who is being recommended instead</li>
              <li>The gaps we’d work on first</li>
            </ul>
            <p className="ds-talk-option">
              Prefer to talk first?{" "}
              <ExternalLink href={site.calendly}>Book a 30-minute call ↗</ExternalLink>
            </p>
          </div>
          <VisibilityReviewForm />
        </section>

      </main>
      <Footer />
    </div>
  );
}
