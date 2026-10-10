import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { globalSearch } from '../api/endpoints';
import ToranStrip from './ToranStrip';

const LINKS = [
  { to: '/', key: 'nav_home' },
  { to: '/about', key: 'nav_about' },
  { to: '/village', key: 'nav_village' },
  { to: '/agriculture', key: 'nav_agriculture' },
  { to: '/events', key: 'nav_events' },
  { to: '/youth', key: 'nav_youth' },
  { to: '/people', key: 'nav_people' },
  { to: '/services', key: 'nav_services' },
  { to: '/gallery', key: 'nav_gallery' },
  { to: '/announcements', key: 'nav_announcements' },
  { to: '/contact', key: 'nav_contact' },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const runSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const data = await globalSearch(query.trim());
      setResults(data);
    } catch {
      setResults(null);
    }
  };

  const flatResults = results
    ? Object.values(results).flat()
    : [];

  return (
    <>
      <header
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(251,248,241,0.95)' : 'rgba(251,248,241,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: scrolled ? '1px solid var(--color-line)' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div className="container navbar-inner" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', minHeight: 96, padding: '16px 24px', gap: 20 }}>
        <Link to="/" className="brand-link" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: '1.45rem', color: 'var(--color-paddy-dark)', minWidth: 0 }}>
          <img src="/logo.jpg" alt="Mallelacheruvu Palli logo" width="48" height="48" style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <span className="brand-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Mallelacheruvu Palli</span>
        </Link>

        <nav
          aria-label="Primary"
          style={{
            display: menuOpen ? 'flex' : undefined,
            flexDirection: menuOpen ? 'column' : undefined,
            position: menuOpen ? 'absolute' : 'static',
            top: menuOpen ? 96 : 'auto',
            left: 0, right: 0,
            width: menuOpen ? '100%' : undefined,
            maxWidth: '100vw',
            boxSizing: 'border-box',
            background: menuOpen ? 'var(--color-bg)' : 'transparent',
            padding: menuOpen ? '16px 24px 24px' : 0,
            borderBottom: menuOpen ? '1px solid var(--color-line)' : 'none',
          }}
          className="nav-links"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: 700,
                color: isActive ? 'var(--color-white)' : 'var(--color-paddy-dark)',
              })}
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifySelf: 'end', minWidth: 0 }}>
          <button
            aria-label="Search the site"
            onClick={() => setSearchOpen((s) => !s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.15rem', color: 'var(--color-ink)' }}
          >
            🔍
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
            style={{ background: 'none', border: '1px solid var(--color-line)', borderRadius: 999, padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
            aria-label="Switch language"
          >
            {lang === 'en' ? 'తెలుగు' : 'EN'}
          </button>
          <Link to="/" className="btn btn--primary" style={{ padding: '9px 18px', fontSize: '0.85rem', display: 'none' }} id="explore-desktop">
            {t('get_started')}
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((m) => !m)}
            className="hamburger"
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', display: 'none' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="container" style={{ paddingBottom: 16 }}>
          <form onSubmit={runSearch} style={{ display: 'flex', gap: 8, maxWidth: 480 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, services, announcements…"
              style={{ flex: 1, padding: '10px 14px', borderRadius: 999, border: '1px solid var(--color-line)', fontFamily: 'var(--font-body)' }}
            />
            <button type="submit" className="btn btn--outline" style={{ padding: '8px 18px' }}>Search</button>
          </form>
          {results && (
            <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, maxWidth: 480 }}>
              {flatResults.length === 0 && <li style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem' }}>No matches found.</li>}
              {flatResults.slice(0, 8).map((r) => (
                <li key={`${r.type}-${r.id}`} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-line)', fontSize: '0.9rem' }}>
                  <span className="demo-flag" style={{ marginLeft: 0, marginRight: 8 }}>{r.type}</span>{r.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .navbar-inner { max-width: 100vw; box-sizing: border-box; }
        .brand-link .brand-text { max-width: 46vw; }
        @media (max-width: 980px) {
          .navbar-inner { grid-template-columns: 1fr auto !important; gap: 10px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .nav-links { display: ${menuOpen ? 'flex' : 'none'} !important; }
          .hamburger { display: inline-block !important; }
        }
        @media (max-width: 480px) {
          .brand-link { font-size: 1.15rem !important; gap: 8px !important; }
          .brand-link img { width: 38px !important; height: 38px !important; }
          .brand-link .brand-text { max-width: 40vw; }
        }
        @media (min-width: 981px) {
          #explore-desktop { display: inline-flex !important; }
        }
      `}</style>
    </header>
    <ToranStrip />
    </>
  );
}
