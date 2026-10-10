/* A toran — the mango-leaf-and-marigold string hung over doorways for
   festivals — repeated as a thin decorative strip. Purely ornamental,
   rendered once under the navbar so every page carries the motif. */
export default function ToranStrip() {
  const leaf = (x) => (
    <g key={x} transform={`translate(${x},0)`}>
      <path d="M9 0 L18 10 Q9 18 0 10 Z" fill="#3F6B3D" opacity="0.9" />
      <circle cx="9" cy="15" r="2.4" fill="#D9A441" />
    </g>
  );
  const positions = Array.from({ length: 40 }, (_, i) => i * 30);

  return (
    <div aria-hidden="true" style={{ width: '100%', overflow: 'hidden', lineHeight: 0, background: 'var(--color-bg)' }}>
      <svg width="100%" height="20" viewBox={`0 0 ${positions.length * 30} 20`} preserveAspectRatio="xMidYMin slice">
        <line x1="0" y1="2" x2={positions.length * 30} y2="2" stroke="var(--color-line)" strokeWidth="1" />
        {positions.map((x) => leaf(x))}
      </svg>
    </div>
  );
}
