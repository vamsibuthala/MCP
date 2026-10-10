import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter both the admin username and password.');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      const dest = location.state?.from?.pathname || '/admin/dashboard';
      navigate(dest, { replace: true });
    } catch {
      setError('Incorrect username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="card" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src="/logo.jpg" alt="Mallelacheruvu Palli logo" width="56" height="56" style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
            <span className="eyebrow">Admin Access</span>
            <h2 style={{ margin: '4px 0 0' }}>Village Admin Login</h2>
            <p style={{ marginTop: 8, fontSize: '0.92rem' }}>Sign in to add and manage village information.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Username
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                style={inputStyle}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                style={inputStyle}
              />
            </label>

            {error && (
              <p role="alert" style={{ color: '#B3432E', fontSize: '0.88rem', margin: 0 }}>{error}</p>
            )}

            <button type="submit" className="btn btn--primary" disabled={loading} style={{ justifyContent: 'center', marginTop: 6 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, marginBottom: 0, fontSize: '0.85rem' }}>
            <Link to="/">← Back to the village portal</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  padding: '11px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-line)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--color-ink)',
  background: 'var(--color-bg)',
};
