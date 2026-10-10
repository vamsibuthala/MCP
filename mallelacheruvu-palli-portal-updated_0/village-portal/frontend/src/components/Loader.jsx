export default function Loader({ label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid rgba(63,107,61,0.18)', borderTopColor: 'var(--color-paddy)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem' }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
