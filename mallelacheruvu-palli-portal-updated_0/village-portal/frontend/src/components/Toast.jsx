export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const bg = type === 'error' ? '#B3432E' : 'var(--color-paddy)';
  return (
    <div
      role="status"
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: bg, color: '#fff', padding: '12px 22px', borderRadius: 999,
        boxShadow: 'var(--shadow-soft)', zIndex: 1000, fontSize: '0.92rem',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
      >
        ✕
      </button>
    </div>
  );
}
