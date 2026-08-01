/**
 * Autograph marks for the team cards, modelled on the signatures Solar on
 * Steroids uses: dark ink, bottom-right, hanging past the card's lower edge.
 *
 * Three things make these read as an autograph rather than handwriting:
 *  - initial plus surname ("B. Martland"), the way people actually sign
 *  - a flourish stroke that crosses and underlines the text, different per person
 *  - a distinct face, rotation and skew per person, so the two are visibly two
 *    different hands rather than one typeface rendered twice
 *
 * Both faces are self-hosted (SIL OFL 1.1); see globals.css.
 */

type Variant = "ben" | "jake";

const VARIANTS: Record<
  Variant,
  { text: string; font: string; size: string; transform: string; flourish: string; bottom: number }
> = {
  ben: {
    text: "B. Martland",
    font: '"SignatureA", cursive',
    size: "text-[19px]",
    // px offset tuned so ~a third of the ink crosses onto the photo and the
    // rest lands on the page. The photos are dark at the foot, so ink sitting
    // over them barely reads; weighting it downward keeps the mark legible
    // while still visibly breaking the card edge. The two faces have different
    // cap heights, so they need different values.
    bottom: -7,
    // Heavier pen, leaning back, slightly tall
    transform: "rotate(-6deg) skewX(-4deg) scaleY(1.06)",
    // Sweeps right, hooks back on itself
    flourish:
      "M10 13 C40 23 94 21 136 8 C147 5 150 12 142 15 C133 18 122 19 116 18",
  },
  jake: {
    text: "J. Duffy",
    font: '"SignatureB", cursive',
    size: "text-[24px]",
    bottom: -17,
    // Thinner hand, leans forward, stretched wide
    transform: "rotate(4deg) scaleX(1.05)",
    // A single long tail that dives under and kicks up
    flourish: "M12 9 C32 21 68 24 110 12 C122 9 128 14 120 17 C116 18 112 18 109 17",
  },
};

export function Signature({ variant, className }: { variant: Variant; className?: string }) {
  const v = VARIANTS[variant];
  return (
    <span
      aria-hidden
      // No `relative` here: the consumer positions this absolutely, and Tailwind
      // emits .relative after .absolute, so a local `relative` would silently win
      // and drop the mark back into normal flow.
      className={`pointer-events-none inline-block select-none whitespace-nowrap leading-none ${v.size} ${className ?? ""}`}
      // transform-origin pins the mark's bottom-right so the rotate/skew does
      // not drag it away from the corner it is positioned against.
      style={{
        fontFamily: v.font,
        transform: v.transform,
        transformOrigin: "right bottom",
        bottom: v.bottom,
        // Local glow instead of a large fade: keeps the half of the mark that
        // sits over the dark photo readable without fogging the whole card.
        textShadow:
          "0 0 5px rgba(237,233,225,0.75), 0 0 2px rgba(237,233,225,0.7)",
      }}
    >
      {v.text}
      {/* Flourish overlaps the descenders, as a real pen stroke would */}
      <svg
        viewBox="0 0 155 28"
        className="absolute inset-x-0 -bottom-[0.3em] h-[0.56em] w-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 2px rgba(237,233,225,0.7))" }}
        aria-hidden
      >
        <path d={v.flourish} />
      </svg>
    </span>
  );
}
