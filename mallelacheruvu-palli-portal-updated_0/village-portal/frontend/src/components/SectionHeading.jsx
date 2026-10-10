export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? 640 : 720, margin: align === 'center' ? '0 auto 40px' : '0 0 40px' }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p style={{ fontSize: '1.05rem' }}>{description}</p>}
    </div>
  );
}
