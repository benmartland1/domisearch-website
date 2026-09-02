import type { AccessPlatform, Answers } from "./types";

/**
 * The email the client adds to their platforms. We never ask for a password:
 * a delegated user can be removed by the client at any time, and nothing we
 * hold is a credential.
 */
export const TEAM_EMAIL = "aeo@domisearch.com";

/**
 * CMS instructions, keyed by the platform answered in the website section.
 *
 * Anything not listed — a custom build, or a client who isn't sure — falls
 * back to `generic`, which asks for what we need rather than pretending to
 * know where the button is.
 */
const CMS_STEPS: Record<string, string[]> = {
  WordPress: [
    "Sign in to your WordPress admin at yoursite.com/wp-admin.",
    "In the left menu go to Users → Add New User.",
    `Enter ${TEAM_EMAIL} as both the username and the email.`,
    "Set Role to Editor (or Administrator if technical changes are in scope).",
    "Untick \"Send the new user an email\" only if you'd rather send it yourself — otherwise leave it ticked.",
    "Click Add New User.",
  ],
  Webflow: [
    "Open your Webflow project and click the Site Settings gear.",
    "Go to the People tab (Members on older plans).",
    `Click Invite and enter ${TEAM_EMAIL}.`,
    "Set the role to Content Editor, or Can Edit / Admin if design changes are in scope.",
    "Send the invite.",
  ],
  Squarespace: [
    "Sign in to Squarespace and open the site.",
    "Go to Settings → Permissions (older versions: Settings → Permissions & Ownership).",
    `Click Invite Contributor and enter ${TEAM_EMAIL}.`,
    "Tick Administrator, or Website Editor plus Store Manager if you'd rather limit it.",
    "Click Invite.",
  ],
  Wix: [
    "Sign in to Wix and open your site's dashboard.",
    "Go to Settings → Roles & Permissions.",
    `Click Invite People and enter ${TEAM_EMAIL}.`,
    "Choose Website Manager (or Admin if technical changes are in scope).",
    "Send the invite.",
  ],
  Shopify: [
    "Sign in to your Shopify admin.",
    "Go to Settings → Users and permissions.",
    `Click Add staff and enter ${TEAM_EMAIL} with the name \"DomiSearch AEO\".`,
    "Tick permissions for Online Store, Themes, Blog posts and pages, and Products.",
    "Send the invite.",
  ],
  HubSpot: [
    "Sign in to HubSpot.",
    "Click the settings gear, then Users & Teams in the left menu.",
    `Click Create user and enter ${TEAM_EMAIL}.`,
    "Grant CMS access: Website pages, Blog and Design tools, all set to Everything.",
    "Send the invite.",
  ],
  generic: [
    `Add ${TEAM_EMAIL} as a user with Editor or Admin rights in whatever your site is managed through.`,
    "If your CMS has no user management, ask your developer to give us access to a staging environment or the repository instead.",
    `If neither is possible, choose \"I need help with this\" and we'll work out the safest route with your developer on the onboarding call.`,
  ],
};

export function cmsSteps(answers: Answers): string[] {
  const platform = typeof answers.platform === "string" ? answers.platform : "";
  return CMS_STEPS[platform] ?? CMS_STEPS.generic;
}

export const ACCESS_PLATFORMS: AccessPlatform[] = [
  {
    id: "accessSearchConsole",
    name: "Google Search Console",
    why: "So we can see how you appear in search and diagnose technical issues.",
    permission: "Full",
    link: { href: "https://search.google.com/search-console", label: "Open Search Console" },
    steps: () => [
      "Go to search.google.com/search-console and pick your property from the dropdown at the top left.",
      "In the left menu, scroll down to Settings, then click Users and permissions.",
      "Click Add user.",
      `Enter ${TEAM_EMAIL}.`,
      "Set Permission to Full.",
      "Click Add.",
    ],
  },
  {
    id: "accessAnalytics",
    name: "Google Analytics 4",
    why: "So we can measure traffic arriving from AI platforms and prove the impact.",
    permission: "Editor, at property level",
    link: { href: "https://analytics.google.com", label: "Open Google Analytics" },
    steps: () => [
      "Go to analytics.google.com and make sure the correct property is selected.",
      "Click Admin (the gear at the bottom left).",
      "In the Property column, click Property Access Management.",
      "Click the blue + at the top right, then Add users.",
      `Enter ${TEAM_EMAIL}.`,
      "Tick Editor under Standard roles, then click Add.",
    ],
  },
  {
    id: "accessCms",
    name: "Your website CMS",
    why: "So we can implement technical fixes and publish content without queueing behind anyone.",
    permission: "Editor or Admin",
    steps: cmsSteps,
  },
  {
    id: "accessBusinessProfile",
    name: "Google Business Profile",
    why: "Local AI answers lean heavily on this, and yours is a local or regional business.",
    permission: "Manager",
    link: { href: "https://business.google.com", label: "Open Business Profile" },
    steps: () => [
      "Go to business.google.com and select your business.",
      "Click the three-dot menu, then Business Profile settings.",
      "Click People and access.",
      "Click Add, then enter " + TEAM_EMAIL + ".",
      "Choose Manager as the access level.",
      "Click Invite.",
    ],
  },
];

export const ACCESS_STATUS_LABELS: Record<string, string> = {
  done: "Done",
  help: "Needs help",
  na: "Not applicable",
};
