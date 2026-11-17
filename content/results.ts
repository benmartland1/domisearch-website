/**
 * "Real results from AI search": the case studies shown as photo cards on the
 * homepage, each with its own detail page at /case-studies/<slug>.
 *
 * The card says the result once: headline plus one short scope line. Fuller
 * evidence and methodology live in `detail` and appear only on the detail page.
 * Before editing a figure, read the ACCURACY note on its entry.
 *
 * ANONYMITY: the recruitment client is never named. Its real name, domain,
 * logo and identifying details, AND the exact wording of the tracked buyer
 * question, must stay out of everything in this file: it feeds rendered copy,
 * routes, image filenames, alt text, metadata, structured data, the sitemap
 * and llms.txt. "International recruitment firm" is the only public label and
 * "one priority buyer question" the only public description of the question.
 *
 * PLACEMENT: each card appears on exactly one page (`showOn`). Taxd is on the
 * homepage only; the recruitment firm is on /recruitment only. The detail
 * page's back link returns to that page.
 *
 * Never name the measurement tool or platform the figures come from anywhere
 * in public copy.
 *
 * Image records (keep these in step with what is in /public):
 *  - /brand/taxd-founders.png: Taxd's own photograph of its two co-founders,
 *    already approved and in use on /taxd-case-study.
 *  - /case-studies/recruitment-office.webp: AI-generated, photorealistic
 *    illustrative image supplied by Ben (2026-11-17), cropped closer to the
 *    people. It does not show the client's people or premises and must never
 *    be described as if it does.
 */

export type ResultImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position for the crop inside the card's photo panel. */
  position?: string;
  /** Shown as a small caption on the detail page. */
  caption?: string;
};

export type ResultCaseStudy = {
  slug: string;
  /** The one page that shows this card. Also where the detail page links back to. */
  showOn: { page: "home" | "recruitment"; href: string; label: string };
  /** Overlaid bottom-left on the photo. A logo replaces the text when set. */
  overlay: { text: string; logo?: { src: string; width: number; height: number } };
  /** Client name when it may be shown; omitted for anonymous clients. */
  client?: string;
  sector: string;
  headline: string;
  /** One short line carrying the essential measurement scope. */
  summary: string;
  image: ResultImage;
  detail: {
    metaTitle: string;
    metaDescription: string;
    /** Source and sample line, shown under the divider in the page header. */
    source: string;
    /**
     * "booking": the page hero is the listing card itself (the same look as on
     * the page that shows it, headline as the h1) with a Book a call button in
     * place of Read case study.
     */
    heroCta?: "booking";
    /**
     * Long-form body: a Markdown file under content/results/. When set it
     * replaces the short overview / result / reading sections.
     */
    article?: string;
    faqs?: { question: string; answer: string }[];
    /** Small print after the body. */
    note?: string;
    /** Closing call to action; the button is always the booking link. */
    cta?: { heading: string; sub: string };
    overview?: string;
    /** The measured result, stated plainly with its scope. */
    resultPoints?: { label: string; value: string }[];
    /** What the figure is and is not. Rendered under "How to read this result". */
    reading?: string[];
    /** Further approved, verified context. Optional. */
    context?: { heading: string; body: string; link?: { label: string; href: string } };
  };
};

export const RESULTS: ResultCaseStudy[] = [
  {
    slug: "taxd-ai-search",
    showOn: { page: "home", href: "/#results", label: "Home" },
    overlay: {
      text: "Taxd",
      logo: { src: "/clients/taxd-white.png", width: 500, height: 184 },
    },
    client: "Taxd",
    sector: "UK digital tax platform",
    // ACCURACY: 52 = new PAYING CUSTOMERS attributed to AI search, confirmed by
    // the client. Not leads, visitors or mentions. The 12-month window's exact
    // start and end dates have not been supplied; do not add any.
    headline: "52 new paying customers through AI search",
    summary: "Recorded by Taxd over a 12-month reporting period.",
    image: {
      src: "/brand/taxd-founders.png",
      width: 1748,
      height: 1240,
      alt: "Taxd’s two co-founders sitting on a leather sofa",
      position: "50% 40%",
    },
    detail: {
      // Copy supplied by Ben (2026-11-17), with every mention of the tracking
      // tool replaced: the site never names it. The Perplexity figures cover
      // 18 October–16 November 2026; the 52 covers a separate 12-month window.
      metaTitle: "How Taxd Gained 52 New Clients Through AI Search | DomiSearch",
      metaDescription:
        "Taxd, a UK digital tax filing platform, recorded 52 new paying customers attributed to AI search over a 12-month reporting period. See the AEO, website and content work, and the Perplexity visibility behind it.",
      source: "Client-confirmed attribution · 12-month reporting period",
      heroCta: "booking",
      article: "taxd-ai-search.md",
      faqs: [
        {
          question: "How many new customers did Taxd gain through AI search?",
          answer:
            "Taxd recorded 52 new paying customers attributed to AI search over a 12-month reporting period. This is the customer acquisition figure used in this case study.",
        },
        {
          question: "What did DomiSearch work on for Taxd?",
          answer:
            "Our work covered AI search optimisation, technical foundations, service pages, content and landing page copy. It formed part of our wider work on Taxd’s search acquisition.",
        },
        {
          question: "Which AI platform supports the visibility examples?",
          answer:
            "The examples shown here come from Perplexity answers tracked between 18 October and 16 November 2026. Taxd appeared in 15 of 30 answers for one software-comparison question and 14 of 30 for a deadline-related software question.",
        },
        {
          question: "Does 50% visibility mean Taxd appeared in half of all AI searches?",
          answer:
            "No. It means Taxd appeared in half of the 30 monitored Perplexity answers to that particular comparison question during the stated period.",
        },
        {
          question: "Are the 52 customers calculated from AI mentions?",
          answer:
            "No. The customer figure comes from the reported commercial result, while our tracking measures appearances in monitored AI answers. An appearance in an answer is not counted as a customer.",
        },
      ],
      note: "Measurement note: The 52-customer result covers a 12-month reporting period. The supporting visibility examples cover 18 October–16 November 2026 and describe selected monitored answers, not all AI conversations or individual customer journeys.",
      cta: {
        heading: "Could AI search bring your business more clients?",
        sub: "Start with the questions your potential customers ask before choosing a provider. Find out which businesses appear, what information supports those recommendations and whether your website gives people a clear reason to choose you. DomiSearch helps businesses research those questions, improve their websites and content, and track their presence in AI answers.",
      },
    },
  },
  {
    slug: "international-recruitment-firm",
    showOn: { page: "recruitment", href: "/recruitment#proof", label: "Recruitment" },
    overlay: { text: "International recruitment firm" },
    sector: "International recruitment firm",
    // ACCURACY: all figures cover 17 Oct–15 Nov 2026 across five monitored
    // engines (ChatGPT, Perplexity, Google AI Overviews, Copilot, Gemini).
    // 372 = mentions from NON-BRANDED questions only (part of the 799 total).
    // "29 of 30" = daily ChatGPT checks for ONE question: always say "one
    // priority (recruitment|buyer) question". "Shortlist" in the headline rests
    // on that one question; the intro states the scope straight after it.
    headline: "How we got an international recruitment firm onto ChatGPT’s shortlist",
    summary: "When a potential client asks AI which recruitment agency to use, you want your firm in the answer.",
    image: {
      src: "/case-studies/recruitment-office.webp",
      width: 924,
      height: 646,
      alt: "Illustrative image: colleagues talking around a table in a bright, modern office",
      position: "50% 40%",
    },
    detail: {
      // COPY: Ben's second brief of 2026-11-17: outcome-led headline, 372 /
      // 29-of-30 / 6 cards up top, challenge, three steps, proof, 799 / 338 as
      // supporting evidence only. The Perplexity "fivefold" section was cut
      // from the story on purpose; the figure below stays verified if needed.
      // Do not reintroduce FAQs, caveat blocks or the engine table. The
      // "never name the tool" rule above still applies to the captions.
      // ACCURACY (verified against the tracking data on 2026-11-17): Perplexity 2 -> 10
      // appearances (the "fivefold") on the same 49 non-branded questions,
      // 8–14 Oct vs 3–9 Nov 2026. "Six new articles used as sources (by 10 Nov)",
      // "four previously uncovered questions" and the "7 of 7 daily Perplexity
      // checks" example come from the 11 November performance review and were
      // approved by Ben. Listed first in 5 of 7 daily ChatGPT checks, 9–15 Nov.
      // 799 includes repeated references across branded and non-branded
      // questions: never present it as 799 recommendations, buyers or leads,
      // nor citations as traffic, backlinks or customers. Competitor rankings
      // were NOT verified: leave them out. Never publish the questions' wording
      // or the markets they name.
      metaTitle: "How We Got a Recruitment Firm onto ChatGPT’s Shortlist | DomiSearch",
      metaDescription:
        "An international recruitment firm recorded 372 mentions in AI answers to questions that didn’t name it over 30 days, and appeared in ChatGPT’s answer to a priority recruitment question on 29 of 30 days.",
      source: "30 days of monitoring · 17 October–15 November 2026",
      heroCta: "booking",
      article: "international-recruitment-firm.md",
      cta: {
        heading: "Is your recruitment firm on AI’s shortlist?",
        sub: "Book a free 30-minute call. We’ll show you where your firm appears today and the recruitment questions we would focus on first.",
      },
    },
  },
];

export function getResultBySlug(slug: string): ResultCaseStudy | undefined {
  return RESULTS.find((r) => r.slug === slug);
}

export const resultHref = (r: Pick<ResultCaseStudy, "slug">) => `/case-studies/${r.slug}`;
