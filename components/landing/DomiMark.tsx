/**
 * DomiSearch orbital mark - the 8-dot ring, rebuilt as inline SVG so it can be
 * recoloured (here: a green tonal sweep on light backgrounds). Pure SVG, no JS.
 */

// 8 dots evenly spaced around a circle (radius 33 in a 100×100 box), starting
// at the top and sweeping clockwise. Opacity fades around the ring to give the
// brand's "orbit" feel; all dots share the deep-green brand colour.
const DOTS = [
  { x: 50, y: 17, o: 1 },
  { x: 73.33, y: 26.67, o: 0.86 },
  { x: 83, y: 50, o: 0.72 },
  { x: 73.33, y: 73.33, o: 0.58 },
  { x: 50, y: 83, o: 0.46 },
  { x: 26.67, y: 73.33, o: 0.56 },
  { x: 17, y: 50, o: 0.7 },
  { x: 26.67, y: 26.67, o: 0.85 },
];

export function DomiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="DomiSearch"
      fill="var(--color-pine)"
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={11} opacity={d.o} />
      ))}
    </svg>
  );
}
