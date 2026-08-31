/**
 * Sanity Studio route.
 *
 * The catch-all is required: the Studio does its own client-side routing
 * under /studio, so every path below it has to resolve to this one page.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
