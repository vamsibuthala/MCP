import { useEffect, useState } from 'react';
import { getEvents } from '../api/endpoints';
import EventCard from '../components/EventCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

const FILTERS = ['all', 'upcoming', 'completed', 'festival', 'sports', 'community'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (['upcoming', 'completed'].includes(filter)) params.status = filter;
    else if (filter !== 'all') params.category = filter;
    getEvents(params).then(setEvents).finally(() => setLoading(false));
  }, [filter]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Events & Festivals" title="What's happening in the village" align="center" />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'btn btn--primary' : 'btn btn--outline'}
              style={{ padding: '8px 16px', fontSize: '0.82rem', textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
        {loading ? <Loader /> : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {events.map((e) => <EventCard key={e.id} event={e} />)}
            {events.length === 0 && <p>No events found for this filter.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
