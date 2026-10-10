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
        <SectionHeading eyebrow="About Us" title="About Mallelacheruvu Palli" align="center"
          description={info?.is_demo_data ? 'The details below are placeholder demo data until an administrator updates them.' : ''} />
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 100 }}>
            <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Village photo placeholder</span>
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
