export default function AnnouncementCard({ announcement }) {
  const date = new Date(announcement.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="card">
      <span className="eyebrow">{announcement.category}</span>
      <h3>{announcement.title}</h3>
      <p>{announcement.short_description}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', marginBottom: 12 }}>{date}</p>
      <a href="#" className="btn btn--outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Read More</a>
    </div>
  );
}
