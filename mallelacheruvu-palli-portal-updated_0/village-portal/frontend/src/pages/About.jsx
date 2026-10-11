import { useEffect, useState } from 'react';
import { getVillageInfo } from '../api/endpoints';
import Loader from '../components/Loader';
import SectionHeading from '../components/SectionHeading';

export default function About() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVillageInfo().then(setInfo).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const blocks = [
    ['Introduction', info?.description],
    ['History', info?.history],
    ['Culture', info?.culture],
    ['Traditions', info?.traditions],
    ['Main Occupations', info?.main_occupations],
    ['Community Values', info?.community_values],
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="About Us" title="About Mallelacheruvu Palli" align="center" />
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 100, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-card)' }}>
            {info?.about_image_url ? (
              <img src={info.about_image_url} alt="Mallelacheruvu Palli Village" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : info?.hero_image_url ? (
              <img src={info.hero_image_url} alt="Mallelacheruvu Palli Village" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-ink-soft)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 10 }}>🌾</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-paddy)' }}>Mallelacheruvu Palli</strong>
                <p style={{ fontSize: '0.82rem', margin: '6px 0 0', color: 'var(--color-ink-soft)' }}>Upload village photos in Admin Dashboard to showcase our village.</p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {blocks.map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text || `DEMO DATA — ${title.toLowerCase()} will appear here.`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
