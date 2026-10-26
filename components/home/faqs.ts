import { AEO_PRICING, aeoUpfrontSaving, gbp } from "@/lib/pricing";

/*
 * The homepage FAQ, as approved in the design. Rendered on the page and
 * published as FAQPage schema, so the two can never drift. The price answer
 * reads from lib/pricing.ts, the only source of the programme's price.
 */
export const homeFaqs = [
  {
    question: "What is Answer Engine Optimisation?",
    answer:
      "AEO helps a business get discovered, mentioned and cited in AI-generated answers. It builds on SEO fundamentals—accessible pages, clear business information and useful content—with research into the questions buyers ask and the sources AI references.",
  },
  {
    question: "What does DomiSearch do?",
    answer:
      "We help service businesses improve their AI search visibility. We research buyer questions, examine the brands and sources in AI answers, and use that evidence to guide website improvements, content and ongoing measurement. Recruitment agencies are a core focus. We also manage Google Ads for a smaller number of clients.",
  },
  {
    question: "Which platforms do you track?",
    answer:
      "We track agreed buyer questions daily across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. We add platforms as they become relevant to the buyers our clients want to reach.",
  },
  {
    question: "What does the programme involve?",
    answer:
      "We establish a visibility and competitor baseline, research buyer questions and cited sources, then work on technical foundations, structured data, service pages and useful content with your team’s expertise and approval. Daily tracking feeds a monthly report and strategy call.",
  },
  {
    question: "How do you measure progress?",
    answer:
      "We compare the same tracked questions against your baseline: brand mentions, cited sources, competitor appearances and how AI describes your business. Domi Studio connects the work completed with this visibility data. The figures describe the tracked set, not every AI conversation.",
  },
  {
    question: "What does the programme cost?",
    answer: `The programme is ${gbp(AEO_PRICING.monthly)} per month with a ${AEO_PRICING.minimumMonths === 3 ? "three" : AEO_PRICING.minimumMonths}-month minimum term (${AEO_PRICING.recommendedMonths === 6 ? "six" : AEO_PRICING.recommendedMonths} recommended), then rolling monthly. Alternatively, the first ${AEO_PRICING.upfrontMonths === 3 ? "three" : AEO_PRICING.upfrontMonths} months are ${gbp(AEO_PRICING.upfront)} paid upfront, saving ${gbp(aeoUpfrontSaving)}. There are no setup fees. Google Ads management is quoted separately.`,
  },
  {
    question: "How quickly could we see results?",
    answer:
      "We can’t promise a date for a particular AI recommendation. The initial 90-day programme gives us a defined period to deliver the agreed work, track changes and review the evidence. Your starting position, competition and pace of approvals all affect how quickly visibility moves.",
  },
  {
    question: "What happens on the free call?",
    answer:
      "It’s 30 minutes with Ben. We look at where you appear across ChatGPT, Gemini and Perplexity and walk you through it: where you stand, who is being recommended instead and what we would work on first.",
  },
];
