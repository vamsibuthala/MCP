export default function EventCard({ event }) {
  const date = new Date(event.event_date);
  const day = date.toLocaleDateString('en-IN', { day: '2-digit' });
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  return (
    <div className="card" style={{ display: 'flex', gap: 18, padding: 20 }}>
      <div style={{ textAlign: 'center', minWidth: 56 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-terracotta)' }}>{day}</div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-ink-soft)' }}>{month}</div>
      </div>
      <div>
        <span className="eyebrow" style={{ marginBottom: 4 }}>{event.category} • {event.status}</span>
        <h3 style={{ marginBottom: 4 }}>{event.title}</h3>
        <p style={{ margin: '0 0 6px', fontSize: '0.9rem' }}>{event.description}</p>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
          {event.event_time && `${event.event_time} • `}{event.location}
        </p>
      </div>
    </div>
  );
}
