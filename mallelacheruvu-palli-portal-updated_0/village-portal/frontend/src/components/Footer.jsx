import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-paddy-dark)', color: 'rgba(255,255,255,0.88)', paddingBottom: 28 }}>
      <div
        aria-hidden="true"
        style={{ height: 5, width: '100%', background: 'linear-gradient(90deg, var(--color-terracotta), var(--color-turmeric), var(--color-paddy), var(--color-turmeric), var(--color-terracotta))' }}
      />
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, paddingTop: 56, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <img src="/logo.jpg" alt="Mallelacheruvu Palli logo" width="36" height="36" style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: '1.5rem', color: '#fff' }}>
              Mallelacheruvu Palli
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Our Village • Our People • Our Pride</p>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Home', '/'], ['About', '/about'], ['Events', '/events'], ['Youth', '/youth']].map(([label, to]) => (
              <li key={to}><Link to={to} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Community</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Agriculture', '/agriculture'], ['Village Facilities', '/village'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([label, to]) => (
              <li key={to}><Link to={to} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><Link to="/privacy" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
            <li><Link to="/terms" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Terms</Link></li>
            <li><Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Follow Us</h4>
          <a
            href="https://instagram.com/mallelacheruvu_palli"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}
            aria-label="Follow Mallelacheruvu Palli on Instagram: mallelacheruvu_palli"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <radialGradient id="ig-gradient-footer" cx="30%" cy="107%" r="150%">
                  <stop offset="0%" stopColor="#FFDD55" />
                  <stop offset="10%" stopColor="#FFDD55" />
                  <stop offset="50%" stopColor="#FF543E" />
                  <stop offset="100%" stopColor="#C837AB" />
                </radialGradient>
              </defs>
              <rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#ig-gradient-footer)" />
              <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.6" />
              <circle cx="16.1" cy="7.9" r="1.05" fill="#fff" />
            </svg>
            mallelacheruvu_palli
          </a>
        </div>
      </div>
      <div className="container" style={{ paddingTop: 20, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 Mallelacheruvu Palli. All Rights Reserved.</span>
      </div>
    </footer>
  );
}
