import { useEffect, useState } from 'react';
import { getServices } from '../api/endpoints';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

const CATEGORIES = ['all', 'grocery', 'medical', 'mechanic', 'electrician', 'plumber', 'tailor', 'restaurant', 'transport', 'agriculture', 'other'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServices({ category, q: query || undefined }).then(setServices).finally(() => setLoading(false));
  }, [category, query]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Local Services" title="Find help nearby" align="center"
          description="Listings are demo/placeholder data until real businesses are added by an administrator." />

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid var(--color-line)', minWidth: 240 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? 'btn btn--primary' : 'btn btn--outline'}
              style={{ padding: '7px 14px', fontSize: '0.8rem', textTransform: 'capitalize' }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : (
          <div className="grid grid--3">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            {services.length === 0 && <p>No services found.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
