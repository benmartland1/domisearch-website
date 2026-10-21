import { ClientLogos } from "./ClientLogos";

/** The client logo strip from the approved homepage, for inner pages. */
export function LogoWall() {
  return (
    <section className="ds-client-strip ds-wrap mt-24 lg:mt-32" aria-label="Selected client brands">
      <span className="ds-eyebrow">Some of the businesses we’ve worked with</span>
      <ClientLogos />
    </section>
  );
}
