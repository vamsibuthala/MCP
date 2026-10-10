import { useEffect, useState } from 'react';
import { getContacts, submitFeedback } from '../api/endpoints';
import SectionHeading from '../components/SectionHeading';
import Toast from '../components/Toast';

const CONTACT_LABELS = {
  panchayat: 'Panchayat', schools: 'Schools', health: 'Health Services', police: 'Police',
  fire: 'Fire Services', emergency: 'Emergency', transport: 'Transportation', other: 'Other',
};

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState({ name: '', contact: '', category: 'suggestion', message: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    getContacts().then(setContacts).catch(() => {});
  }, []);

  const submitFeedbackForm = async (e) => {
    e.preventDefault();
    if (!feedback.message.trim()) {
      setToast('Please enter a message before submitting.');
      return;
    }
    try {
      await submitFeedback(feedback);
      setFeedback({ name: '', contact: '', category: 'suggestion', message: '' });
      setToast('Thanks for your feedback!');
    } catch {
      setToast('Something went wrong. Please try again.');
    }
  };

  const grouped = contacts.reduce((acc, c) => {
    acc[c.category] = acc[c.category] || [];
    acc[c.category].push(c);
    return acc;
  }, {});

  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Contact" title="Get in touch with Mallelacheruvu Palli" align="center" />
          <div className="grid-2" style={{ gap: 48 }}>
            <div>
              <h3>Send a message</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Your name" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
                <input placeholder="Email or phone" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
                <textarea placeholder="Your message" rows={4} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)', fontFamily: 'inherit' }} />
                <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
              </form>
            </div>
            <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '2rem' }}>📍</span>
              <p style={{ margin: 0, color: 'var(--color-ink-soft)' }}>Mallelacheruvu Palli, Andhra Pradesh</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>Map placeholder — connect a map API here.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Important Contacts" title="Numbers worth saving" />
          <div className="grid grid--4">
            {Object.entries(grouped).map(([cat, list]) => (
              <div className="card" key={cat}>
                <span className="eyebrow">{CONTACT_LABELS[cat] || cat}</span>
                {list.map((c) => (
                  <div key={c.id} style={{ marginBottom: 10 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-ink)' }}>{c.name}{c.is_demo_data && <span className="demo-flag">demo</span>}</p>
                    {c.phone && <a href={`tel:${c.phone}`} className="btn btn--outline" style={{ padding: '6px 14px', fontSize: '0.8rem', marginTop: 6 }}>{c.phone}</a>}
                  </div>
                ))}
              </div>
            ))}
            {contacts.length === 0 && <p>No contacts published yet.</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Feedback" title="Tell us what you think" />
          <form onSubmit={submitFeedbackForm} className="grid-2" style={{ gap: 14, maxWidth: 720 }}>
            <input placeholder="Name (optional)" value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
            <input placeholder="Email or phone (optional)" value={feedback.contact}
              onChange={(e) => setFeedback({ ...feedback, contact: e.target.value })}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)' }} />
            <select value={feedback.category} onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)', gridColumn: '1 / -1' }}>
              <option value="suggestion">Suggestion</option>
              <option value="complaint">Complaint</option>
              <option value="development">Village Development</option>
              <option value="website">Website Feedback</option>
              <option value="other">Other</option>
            </select>
            <textarea placeholder="Your message" required rows={4} value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-line)', fontFamily: 'inherit', gridColumn: '1 / -1' }} />
            <button type="submit" className="btn btn--primary" style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>Submit Feedback</button>
          </form>
        </div>
      </section>

      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
