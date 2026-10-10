export default function ServiceCard({ service }) {
  return (
    <div className="card">
      <span className="eyebrow">{service.category}{service.is_demo_data && <span className="demo-flag">demo</span>}</span>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>{service.location}</p>
      {service.timings && <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>🕒 {service.timings}</p>}
      {service.phone && (
        <a href={`tel:${service.phone}`} className="btn btn--primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Call {service.phone}
        </a>
      )}
    </div>
  );
}
