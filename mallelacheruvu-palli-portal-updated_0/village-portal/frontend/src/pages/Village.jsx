import { useEffect, useState } from 'react';
import { getFacilities, getVillageInfo } from '../api/endpoints';
import FacilityCard from '../components/FacilityCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

const CATEGORIES = ['all', 'school', 'temple', 'health', 'panchayat', 'shop', 'playground', 'park', 'water', 'transport'];

export default function Village() {
  const [facilities, setFacilities] = useState([]);
  const [info, setInfo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.allSettled([getFacilities(), getVillageInfo()])
      .then(([fRes, iRes]) => {
        if (fRes.status === 'fulfilled') setFacilities(fRes.value || []);
        if (iRes.status === 'fulfilled') setInfo(iRes.value || {});
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? facilities : facilities.filter((f) => f.category === filter);

  const address = info?.location_address || 'Mallelacheruvu Palli, Andhra Pradesh, India';
  const mapEmbedUrl = info?.map_embed_url || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = info?.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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

        {/* VILLAGE MAP & LOCATE SECTION */}
        <div id="village-map" style={{ marginTop: 72, scrollMarginTop: 90 }}>
          <SectionHeading
            eyebrow="Locate Our Village"
            title="Village Map & Directions"
            align="center"
            description="Find Mallelacheruvu Palli on the map, explore landmarks, and navigate easily from anywhere."
          />

          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: '1px solid var(--color-line)',
              boxShadow: 'var(--shadow-soft)',
              background: 'var(--color-white)',
            }}
          >
            {/* Action Bar Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 22px',
                background: 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-line)',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-ink)' }}>
                    {address}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>
                    Andhra Pradesh, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyLocation}
                  className="btn btn--outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  {copied ? '✓ Address Copied' : '📋 Copy Address'}
                </button>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  🚗 Get Directions
                </a>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  🗺️ Open in Google Maps
                </a>
              </div>
            </div>

            {/* Interactive Embedded Map */}
            <div style={{ width: '100%', height: 460, position: 'relative', background: 'var(--color-bg)' }}>
              <iframe
                title="Mallelacheruvu Palli Interactive Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Highlights Grid below map */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 18,
                padding: '24px 22px',
                background: 'var(--color-white)',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--color-paddy)' }}>🏛️</span>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-ink)', display: 'block' }}>Key Landmarks</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
                    Village Gram Panchayat, local schools, temples, and community water reservoir.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--color-paddy)' }}>🚌</span>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-ink)', display: 'block' }}>Transport & Roads</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
                    Well connected by state bus routes and connecting arterial roads.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--color-paddy)' }}>🌾</span>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-ink)', display: 'block' }}>Surroundings</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
                    Fertile agricultural lands, paddy fields, irrigation canals, and serene village ponds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
