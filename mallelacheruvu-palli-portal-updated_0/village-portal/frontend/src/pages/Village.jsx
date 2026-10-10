import { useEffect, useState } from 'react';
import { getFacilities, getContacts } from '../api/endpoints';
import FacilityCard from '../components/FacilityCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

const CATEGORIES = ['all', 'school', 'temple', 'health', 'panchayat', 'shop', 'playground', 'park', 'water', 'transport'];

export default function Village() {
  const [facilities, setFacilities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacilities().then(setFacilities).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? facilities : facilities.filter((f) => f.category === filter);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Our Village" title="Facilities & Important Places" align="center" />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={filter === c ? 'btn btn--primary' : 'btn btn--outline'}
              style={{ padding: '8px 16px', fontSize: '0.82rem', textTransform: 'capitalize' }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : (
          <div className="grid grid--3">
            {filtered.map((f) => <FacilityCard key={f.id} facility={f} />)}
            {filtered.length === 0 && <p>No facilities in this category yet.</p>}
          </div>
        )}

        <div style={{ marginTop: 64 }}>
          <SectionHeading eyebrow="Find Your Way" title="Village Map" />
          <div style={{
            background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', height: 340,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
          }}>
            <span style={{ fontSize: '2rem' }}>🗺️</span>
            <p style={{ margin: 0, color: 'var(--color-ink-soft)' }}>
              Interactive map placeholder — connect a map API (e.g. Google Maps or OpenStreetMap) here,
              using each facility's latitude/longitude from the API.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
