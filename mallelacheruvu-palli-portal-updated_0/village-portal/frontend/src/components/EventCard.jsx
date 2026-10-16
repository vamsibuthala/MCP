import { useState } from 'react';

export default function EventCard({ event }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const date = event.event_date ? new Date(event.event_date) : null;
  const day = date ? date.toLocaleDateString('en-IN', { day: '2-digit' }) : '—';
  const month = date ? date.toLocaleDateString('en-IN', { month: 'short' }) : '';
  const year = date ? date.getFullYear() : '';

  // Collect all photos (either from images array or fallback to image_url)
  const photos = Array.isArray(event.images) && event.images.length > 0
    ? event.images
    : event.image_url
    ? [event.image_url]
    : [];

  const mainPhoto = photos[activePhotoIdx] || photos[0] || null;

  return (
    <>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          height: '100%',
        }}
      >
        {/* Photo Section if event has photos */}
        {photos.length > 0 && (
          <div style={{ position: 'relative', width: '100%', background: '#0F2613' }}>
            <img
              src={mainPhoto}
              alt={event.title}
              onClick={() => setSelectedPhoto(mainPhoto)}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                display: 'block',
                cursor: 'pointer',
              }}
            />
            {/* Multi-photo badge */}
            {photos.length > 1 && (
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(20, 40, 23, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                📸 {photos.length} Photos
              </span>
            )}

            {/* Thumbnail selector if multiple photos */}
            {photos.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(15, 38, 19, 0.92)',
                  overflowX: 'auto',
                  scrollbarWidth: 'thin',
                }}
              >
                {photos.map((url, idx) => (
                  <button
                    key={url + idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      border: idx === activePhotoIdx ? '2px solid var(--color-paddy-light, #43A047)' : '1px solid rgba(255,255,255,0.3)',
                      padding: 0,
                      background: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: idx === activePhotoIdx ? 1 : 0.65,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 3, display: 'block' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div style={{ display: 'flex', gap: 16, padding: 20, flex: 1 }}>
          {/* Calendar Day box */}
          <div
            style={{
              textAlign: 'center',
              minWidth: 54,
              padding: '6px 4px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-line)',
              height: 'fit-content',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.45rem', color: 'var(--color-terracotta)', lineHeight: 1 }}>
              {day}
            </div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-ink-soft)', marginTop: 2 }}>
              {month}
            </div>
            {year && (
              <div style={{ fontSize: '0.65rem', color: 'var(--color-ink-soft)', opacity: 0.8 }}>
                {year}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              <span
                style={{
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-paddy-dark)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {event.category || 'Event'}
              </span>
              <span
                style={{
                  background: event.status === 'upcoming' ? 'rgba(45, 125, 50, 0.15)' : 'rgba(100, 100, 100, 0.12)',
                  color: event.status === 'upcoming' ? 'var(--color-paddy-dark)' : 'var(--color-ink-soft)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {event.status || 'Active'}
              </span>
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: 'var(--color-ink)' }}>
              {event.title}
            </h3>

            {event.description && (
              <p style={{ margin: '0 0 8px', fontSize: '0.88rem', color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                {event.description}
              </p>
            )}

            {event.location && (
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>📍</span> {event.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full-size Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: -44,
                right: 0,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close"
            >
              ✕
            </button>
            <img
              src={selectedPhoto}
              alt={event.title}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            />
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: '12px 0 0', fontSize: '0.9rem', textAlign: 'center' }}>
              {event.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
