import { useEffect, useState } from 'react';
import { getPeople } from '../api/endpoints';
import SectionHeading from '../components/SectionHeading';
import RippleDivider from '../components/RippleDivider';
import Loader from '../components/Loader';

export default function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeople().then(setPeople).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Our People"
          title="Faces of Mallelacheruvu Palli"
          description="The leaders, elders and villagers who shape our community's story."
          align="center"
        />
        <RippleDivider />

        {loading ? (
          <Loader label="Loading our people…" />
        ) : (
          <div className="grid grid--3" style={{ marginTop: 40 }}>
            {people.map((p) => <PersonCard key={p.id} person={p} />)}
            {people.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                No one has been added to the People directory yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PersonCard({ person }) {
  return (
    <div className="card temple-stripe" style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 108, height: 108, borderRadius: '50%', margin: '0 auto 18px',
          background: 'var(--color-bg-alt)', border: '3px solid var(--color-turmeric)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {person.photo_url ? (
          <img src={person.photo_url} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '2rem' }} aria-hidden="true">🌾</span>
        )}
      </div>
      <h3 style={{ marginBottom: 2 }}>{person.name}</h3>
      {person.role && <span className="eyebrow" style={{ marginBottom: 10 }}>{person.role}</span>}
      {person.bio && <p style={{ fontSize: '0.92rem' }}>{person.bio}</p>}
    </div>
  );
}
