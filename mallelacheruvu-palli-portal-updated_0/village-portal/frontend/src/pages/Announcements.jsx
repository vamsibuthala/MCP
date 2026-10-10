import { useEffect, useState } from 'react';
import { getAnnouncements } from '../api/endpoints';
import AnnouncementCard from '../components/AnnouncementCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

const CATEGORIES = ['all', 'panchayat', 'education', 'agriculture', 'events', 'schemes', 'emergency', 'general'];

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnnouncements(category === 'all' ? undefined : category).then(setItems).finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Announcements" title="Stay up to date" align="center" />
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
            {items.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}
            {items.length === 0 && <p>No announcements in this category yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
