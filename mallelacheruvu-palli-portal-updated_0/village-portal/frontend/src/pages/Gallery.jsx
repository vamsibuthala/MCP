import { useEffect, useState } from 'react';
import { getGallery, getMemories, submitMemory } from '../api/endpoints';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const CATEGORIES = ['all', 'village', 'nature', 'festivals', 'agriculture', 'youth', 'sports', 'temples', 'old_memories'];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  const [memories, setMemories] = useState([]);
  const [form, setForm] = useState({ submitted_by: '', title: '', story: '', image_url: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    setLoading(true);
    getGallery(category === 'all' ? undefined : category).then(setItems).finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    getMemories().then(setMemories).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await submitMemory(form);
      setForm({ submitted_by: '', title: '', story: '', image_url: '' });
      setToast('Thank you — your memory was submitted for review.');
    } catch {
      setToast('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Gallery" title="Photos & videos from the village" align="center" />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? 'btn btn--primary' : 'btn btn--outline'}
                style={{ padding: '7px 14px', fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {c.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  style={{ border: 'none', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--color-bg-alt)' }}
                  aria-label={`View ${item.title || 'photo'} full size`}
                >
                  <img src={item.image_url} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
              {items.length === 0 && <p>No images in this category yet.</p>}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,14,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <img src={lightbox.image_url} alt={lightbox.title} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12 }} />
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 40, height: 40, fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <section className="section section--alt">
        <div className="container grid-2" style={{ gap: 48 }}>
          <div>
            <SectionHeading eyebrow="Village Memories" title="Share a memory of Mallelacheruvu Palli" />
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input placeholder="Your name" value={form.submitted_by}
                onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
                style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
              <input placeholder="Title of your memory" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
              <textarea placeholder="Tell the story…" rows={4} value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
                style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)', fontFamily: 'inherit' }} />
              <input placeholder="Photo URL (optional)" value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
              <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>Submit Memory</button>
              <p style={{ fontSize: '0.8rem' }}>Submissions are reviewed by an admin before appearing publicly.</p>
            </form>
          </div>
          <div>
            <h3>Recently shared</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {memories.slice(0, 4).map((m) => (
                <div className="card" key={m.id}>
                  <h3 style={{ marginBottom: 4 }}>{m.title}</h3>
                  <p style={{ marginBottom: 4 }}>{m.story}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', margin: 0 }}>— {m.submitted_by}</p>
                </div>
              ))}
              {memories.length === 0 && <p>No approved memories yet — be the first to share one.</p>}
            </div>
          </div>
        </div>
      </section>

      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
