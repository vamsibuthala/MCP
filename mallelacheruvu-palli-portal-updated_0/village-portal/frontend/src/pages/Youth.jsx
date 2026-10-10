import { useEffect, useState } from 'react';
import { getYouthActivities } from '../api/endpoints';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

export default function Youth() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getYouthActivities().then(setActivities).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="section"
        style={{ background: 'linear-gradient(160deg, #2E6068 0%, #2C4C2A 100%)', color: '#fff', textAlign: 'center' }}
      >
        <div className="container">
          <span className="eyebrow" style={{ color: '#E8C97A' }}>Mallelacheruvu Palli Youth</span>
          <h1 style={{ color: '#fff' }}>Together for a Better Village</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560, margin: '0 auto 28px' }}>
            From cleanliness drives to blood donation camps, festival arrangements to educational support —
            the youth of Mallelacheruvu Palli show up for their community.
          </p>
          <a href="/contact" className="btn btn--secondary">Join / Contact Youth Team</a>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Activities" title="What the youth team does" />
          {loading ? <Loader /> : (
            <div className="grid grid--3">
              {activities.map((a) => (
                <div className="card" key={a.id}>
                  <h3>{a.title}{a.is_demo_data && <span className="demo-flag">demo</span>}</h3>
                  <p>{a.description}</p>
                </div>
              ))}
              {activities.length === 0 && <p>No activities listed yet.</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
