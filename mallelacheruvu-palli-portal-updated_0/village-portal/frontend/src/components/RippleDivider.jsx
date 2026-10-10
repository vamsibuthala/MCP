/* Signature motif: a ripple (the village "cheruvu"/tank) with a jasmine
   sprig (the "malle") resting on it — used sparingly as a section divider
   so it reads as this village's mark, not a generic squiggle. */
export default function RippleDivider({ flip = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        justifyContent: 'center',
        transform: flip ? 'rotate(180deg)' : 'none',
        margin: '0 auto',
        padding: '4px 0',
      }}
    >
      <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14C12 6 20 22 30 14C40 6 48 22 58 14C68 6 76 22 86 14C96 6 104 22 118 14"
          stroke="#2E6068" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <g transform="translate(52,2)">
          <path d="M8 12 C4 8 4 2 8 0 C12 2 12 8 8 12Z" fill="#FBF8F1" stroke="#BD5A2A" strokeWidth="1.2" />
          <circle cx="8" cy="4" r="2.1" fill="#D9A441" />
        </g>
      </svg>
    </div>
  );
}
