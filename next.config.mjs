/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "domisearch.com" },
      { protocol: "https", hostname: "www.domisearch.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Sanity's asset CDN — every image uploaded in the Studio is served here.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
  // /call-booked reads Calendly's query params, so it renders per-request rather
  // than at build time. It still pulls the featured case study and the
  // testimonial headshots off disk, and Next's tracer can't see runtime fs
  // reads — without this the files are missing from the serverless bundle and
  // those sections silently degrade.
  outputFileTracingIncludes: {
    "/call-booked": ["./content/case-studies/**/*", "./public/testimonials/**/*"],
  },
  async redirects() {
    return [
      // Framer blog posts → closest current equivalent (recapture AI citations)
      {
        source: "/blog/optimizing-for-ai-search-practical-first-steps-for-your-saas-company",
        destination: "/blog/what-is-aeo",
        permanent: true,
      },
      {
        source: "/blog/how-to-improve-your-google-ads-conversion-rate",
        destination: "/blog/google-ads-for-saas-startups-complete-strategy-guide",
        permanent: true,
      },
      {
        source: "/blog/driving-efficiency-with-ai-automation-in-supply-chain-management",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/empowering-hr-with-ai-automation-streamlining-recruitment-and-onboarding",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/navigating-data-challenges-with-ai-automation-unlocking-insights-and-driving-decision-making",
        destination: "/blog",
        permanent: true,
      },
      // Framer service pages → new structure
      { source: "/aeo", destination: "/services/aeo", permanent: true },
      { source: "/audit", destination: "/contact", permanent: true },
      { source: "/visibility-audit", destination: "/contact", permanent: true },
      { source: "/scorecard", destination: "/contact", permanent: true },
      { source: "/ecom", destination: "/services/google-ads", permanent: true },
      { source: "/ecom/thank-you", destination: "/", permanent: true },
      // Framer career pages → unified careers page
      { source: "/careers/aeo-account-manager", destination: "/careers", permanent: true },
      { source: "/careers/content-writer", destination: "/careers", permanent: true },
      { source: "/careers/google-ads-account-manager", destination: "/careers", permanent: true },
      // Framer artefacts
      { source: "/old-home", destination: "/", permanent: true },
      { source: "/page", destination: "/", permanent: true },
      // Was a Framer artefact pointing at "/". Now a safety net for the
      // post-booking page — kept temporary so browsers don't cache it, since
      // the old 308 to "/" may still be cached from the Framer era.
      { source: "/thank-you", destination: "/call-booked", permanent: false },
    ];
  },
};

export default nextConfig;
