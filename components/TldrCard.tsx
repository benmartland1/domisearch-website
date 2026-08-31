/**
 * The TL;DR box at the top of a post.
 *
 * Renders nothing when the field is empty, so posts without one are
 * unaffected and the field could be introduced without touching content.
 *
 * Not a heading: this summarises the whole page rather than opening a
 * section of it, so it stays out of the document outline and the table of
 * contents. The visual is unchanged from the old `## TL;DR` convention.
 */
export function TldrCard({ text }: { text?: string }) {
  const value = text?.trim();
  if (!value) return null;

  return (
    <aside className="tldr-card" aria-label="Summary">
      <p className="tldr-card__label">TL;DR</p>
      <p className="tldr-card__body">{value}</p>
    </aside>
  );
}
