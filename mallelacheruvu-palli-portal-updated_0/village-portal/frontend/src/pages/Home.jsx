import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  getVillageInfo, getFacilities, getLatestEvents, getLatestAnnouncements, getGallery,
} from '../api/endpoints';
import StatCounter from '../components/StatCounter';
import FacilityCard from '../components/FacilityCard';
import EventCard from '../components/EventCard';
import AnnouncementCard from '../components/AnnouncementCard';
import RippleDivider from '../components/RippleDivider';
import Loader from '../components/Loader';

export default function Home() {
  const { t } = useLanguage();
  const [info, setInfo] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getVillageInfo(), getFacilities(), getLatestEvents(3), getLatestAnnouncements(3), getGallery(),
    ]).then(([i, f, e, a, g]) => {
      if (i.status === 'fulfilled') setInfo(i.value);
      if (f.status === 'fulfilled') setFacilities(f.value.slice(0, 6));
      if (e.status === 'fulfilled') setEvents(e.value);
      if (a.status === 'fulfilled') setAnnouncements(a.value);
      if (g.status === 'fulfilled') setGallery(g.value.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading the village portal…" />;

  return (
    <>
      {/* HERO */}
      {/* HERO */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: '86vh',
          display: 'flex',
          alignItems: 'center',
          background: info?.hero_image_url
            ? `linear-gradient(160deg, rgba(18, 54, 25, 0.82) 0%, rgba(22, 78, 35, 0.88) 100%), url(${info.hero_image_url}) center/cover no-repeat`
            : 'linear-gradient(160deg, #163B20 0%, #255F32 50%, #3D8548 100%)',
          overflow: 'hidden',
        }}
      >
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 120 }}
          viewBox="0 0 1440 120" preserveAspectRatio="none"
        >
          <path d="M0,64 C240,110 480,20 720,50 C960,80 1200,110 1440,64 L1440,120 L0,120 Z" fill="var(--color-bg)" />
        </svg>
        <div className="container hero-content" style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 140 }}>
          <span className="eyebrow" style={{ color: '#F1D88A' }}>Andhra Pradesh, India</span>
          <h1 style={{ color: '#fff', maxWidth: 780 }}>{info?.title || t('hero_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.2rem', maxWidth: 580, fontWeight: 500 }}>
            {info?.tagline || t('hero_sub')}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 580, marginBottom: 32 }}>
            {info?.description || 'This portal connects villagers, showcases our culture, and shares useful information for everyone who calls Mallelacheruvu Palli home.'}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
            <Link to="/village" className="btn btn--primary">{t('explore')}</Link>
            <Link to="/gallery" className="btn btn--secondary">{t('view_gallery')}</Link>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
            <StatCounter label="Population" value={info?.population || 0} />
            <StatCounter label="Families" value={info?.families || 0} />
            <StatCounter label="Schools" value={info?.schools || 0} />
            <StatCounter label="Temples" value={info?.temples || 0} />
            <StatCounter label="Farmers" value={info?.farmers || 0} />
            <StatCounter label="Youth Members" value={info?.youth_members || 0} />
          </div>
          {info?.is_demo_data && (
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', marginTop: 18 }}>
              Figures above can be updated anytime by the administrator.
            </p>
          )}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="section">
        <div className="container grid-2" style={{ gap: 48, alignItems: 'center' }}>
          <div>
            <span className="eyebrow">About Us</span>
            <h2>A village shaped by field, faith and family</h2>
            <p>{info?.history || info?.description || 'Learn more about the rich agricultural heritage and vibrant community of our village.'}</p>
            <Link to="/about" className="btn btn--outline">{t('know_more')}</Link>
          </div>
          <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-line)' }}>
            {info?.about_image_url ? (
              <img src={info.about_image_url} alt="Mallelacheruvu Palli" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : info?.hero_image_url ? (
              <img src={info.hero_image_url} alt="Mallelacheruvu Palli" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-ink-soft)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 8 }}>🌾</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Mallelacheruvu Palli Village</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <RippleDivider />

      {/* FACILITIES PREVIEW */}
      {facilities.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <span className="eyebrow">Our Village</span>
            <h2>Everything the village runs on</h2>
            <div className="grid grid--3">
              {facilities.map((f) => <FacilityCard key={f.id} facility={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Upcoming Events</span>
          <h2 style={{ marginBottom: 24 }}>What's happening</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.length === 0 && <p>No upcoming events yet.</p>}
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
          <Link to="/events" className="btn btn--outline" style={{ marginTop: 20 }}>See All Events</Link>
        </div>
      </section>

      <RippleDivider flip />

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <span className="eyebrow">Village Gallery</span>
            <h2>Moments from Mallelacheruvu Palli</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {gallery.map((g) => (
                <div key={g.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1/1' }}>
                  <img src={g.image_url} alt={g.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <Link to="/gallery" className="btn btn--outline" style={{ marginTop: 24 }}>{t('view_gallery')}</Link>
          </div>
        </section>
      )}

      {/* OUR PRIDE + QUOTE */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">Our Pride</span>
          <h2 style={{ maxWidth: 700, margin: '0 auto 24px' }}>Achievements of our villagers, youth and students</h2>
          <p style={{ maxWidth: 640, margin: '0 auto 40px' }}>
            DEMO DATA — this space is reserved for the admin to highlight local achievements once available.
          </p>
          <blockquote className="accent-text" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.3rem)', color: 'var(--color-paddy-dark)', maxWidth: 640, margin: '0 auto', lineHeight: 1.3 }}>
            "A village is not just a place; it is a family, a memory, and a shared future."
          </blockquote>
        </div>
      </section>
    </>
  );
}
