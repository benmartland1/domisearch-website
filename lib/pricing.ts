/**
 * The one place the AI search programme's price lives. The sector pages'
 * PricingCard, the /pricing page and the pricing FAQs all read from here, so
 * the figures cannot drift apart. Google Ads has no published price.
 */
export const AEO_PRICING = {
  monthly: 2450,
  upfront: 6950,
  upfrontMonths: 3,
  minimumMonths: 3,
  recommendedMonths: 6,
} as const;

export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export const aeoUpfrontSaving = AEO_PRICING.monthly * AEO_PRICING.upfrontMonths - AEO_PRICING.upfront;
export const aeoUpfrontEffectiveMonthly = AEO_PRICING.upfront / AEO_PRICING.upfrontMonths;

/** One sentence, reused in FAQs and llms.txt so every statement of price matches. */
export const aeoPricingSentence = `The AI search programme is ${gbp(AEO_PRICING.monthly)} per month on a ${AEO_PRICING.minimumMonths}-month minimum term (${AEO_PRICING.recommendedMonths} recommended), then rolling monthly, or ${gbp(AEO_PRICING.upfront)} for the first ${AEO_PRICING.upfrontMonths} months paid upfront, which saves ${gbp(aeoUpfrontSaving)}. There are no setup fees.`;
