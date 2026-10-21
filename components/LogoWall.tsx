import Image from "next/image";
import { site } from "@/lib/site";

/** The client logo strip from the approved homepage, for inner pages. */
export function LogoWall() {
  return (
    <section className="ds-client-strip ds-wrap mt-24 lg:mt-32" aria-label="Selected client brands">
      <span className="ds-eyebrow">Some of the businesses we’ve worked with</span>
      <div className="ds-client-logos">
        {site.clients.map((client) => (
          <Image key={client.name} src={client.logo} alt={client.name} width={160} height={48} sizes="160px" />
        ))}
      </div>
    </section>
  );
}
