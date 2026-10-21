import Image from "next/image";
import { site } from "@/lib/site";

/**
 * The client logo strip from the approved design. Uses pre-flattened mono
 * versions of the logos (public/clients/mono) so each reads at full strength;
 * the originals have soft alpha that looked washed out on cream. A grid from tablet up; on
 * phones it becomes a slow continuous scroll, like the reviews row. The
 * second group in the track is a visual clone for the loop and is hidden
 * from assistive tech. Under reduced motion the grid is shown instead.
 */
export function ClientLogos() {
  const logos = (hidden: boolean) =>
    site.clients.map((c) => (
      <Image key={c.name} src={c.logo.replace("/clients/", "/clients/mono/").replace(/\.png$/, "-mono-2026.png")} alt={hidden ? "" : c.name} width={160} height={48} sizes="160px" />
    ));
  return (
    <>
      <div className="ds-client-logos">{logos(false)}</div>
      <div className="ds-logo-marquee" aria-hidden="true">
        <div className="ds-logo-track">
          <div className="ds-logo-group">{logos(true)}</div>
          <div className="ds-logo-group">{logos(true)}</div>
        </div>
      </div>
    </>
  );
}
