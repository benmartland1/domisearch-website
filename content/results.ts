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
    /** Page h1 when it differs from the card headline. */
    title?: string;
    /** Opening paragraph in the page header, in place of the card summary. */
    lede?: string;
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
      title: "How Taxd gained 52 new clients through AI search",
      lede:
        "Taxd recorded 52 new paying customers attributed to AI search over a 12-month reporting period. DomiSearch’s work with the online tax platform combined AI search optimisation, website improvements and content to help potential customers discover the service and understand whether it was right for them.",
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
    // ACCURACY: 97% = 29 of 30 daily ChatGPT checks, rounded to the nearest
    // whole percent, for ONE tracked question. Not an increase, not an overall
    // visibility score, and not "always listed first". Keep "one priority
    // buyer question" and the sample size wherever 97% appears. The overall
    // reporting dates are deliberately not published.
    headline: "97% ChatGPT visibility for one priority buyer question",
    summary: "Appeared in 29 of 30 daily ChatGPT checks.",
    image: {
      src: "/case-studies/recruitment-office.webp",
      width: 924,
      height: 646,
      alt: "Illustrative image: colleagues talking around a table in a bright, modern office",
      position: "50% 40%",
    },
    detail: {
      metaTitle: "97% ChatGPT Visibility for One Priority Buyer Question | DomiSearch",
      metaDescription:
        "An international recruitment firm appeared in 29 of 30 daily ChatGPT checks for one priority buyer question.",
      source: "One tracked buyer question · 30 daily checks",
      overview:
        "The client is an international recruitment firm. We tracked one priority buyer question in ChatGPT once a day for 30 days and recorded whether the firm appeared in the answer. The exact question is not published, to protect the client’s confidentiality.",
      resultPoints: [
        { label: "Daily ChatGPT checks where the firm appeared", value: "29 of 30" },
        { label: "Listed first, 9–15 November 2026", value: "5 of 7 daily checks" },
        { label: "Questions tracked", value: "One priority buyer question" },
        { label: "Daily checks", value: "30" },
      ],
      reading: [
        "97% is 29 of 30 checks, rounded to the nearest whole percent.",
        "It measures how often the firm appeared in ChatGPT’s answer to one specific question. It is not an increase, and not an overall visibility score across all questions.",
        "The firm was not always listed first: it was listed first in 5 of the 7 daily checks between 9 and 15 November 2026.",
        "We do not claim that any particular piece of work caused the result.",
      ],
    },
  },
];

export function getResultBySlug(slug: string): ResultCaseStudy | undefined {
  return RESULTS.find((r) => r.slug === slug);
}

export const resultHref = (r: Pick<ResultCaseStudy, "slug">) => `/case-studies/${r.slug}`;
