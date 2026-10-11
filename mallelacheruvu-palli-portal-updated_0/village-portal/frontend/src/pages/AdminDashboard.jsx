import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import {
  getDashboardStats,
  getVillageInfo, updateVillageInfo,
  getFacilities, createFacility, deleteFacility,
  getContacts, createContact, deleteContact,
  getPeople, createPerson, deletePerson,
  getGallery, createGalleryItem, deleteGalleryItem, uploadImage,
  getEvents, createEvent, deleteEvent,
  getAllAnnouncementsAdmin, createAnnouncement, deleteAnnouncement,
  getServices, createService, deleteService,
  getCrops, createCrop, deleteCrop,
  getFarmerResources, createFarmerResource, deleteFarmerResource,
  getYouthActivities, createYouthActivity, deleteYouthActivity,
  getAllFeedback, reviewFeedback, deleteFeedback,
  getPendingMemories, moderateMemory,
  changePassword,
} from '../api/endpoints';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'village', label: 'Village Info' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'events', label: 'Events' },
  { key: 'agriculture', label: 'Agriculture' },
  { key: 'youth', label: 'Youth Activities' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'contacts', label: 'Important Contacts' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'memories', label: 'Memories' },
  { key: 'security', label: 'Security & Password' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section style={{ minHeight: '75vh' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="eyebrow">Admin Dashboard</span>
            <h1 style={{ margin: 0 }}>Manage the Village Portal</h1>
            {user?.name && <p style={{ margin: '6px 0 0' }}>Signed in as <strong>{user.name}</strong></p>}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="hamburger-admin" onClick={() => setMenuOpen((m) => !m)} style={{ display: 'none', background: 'none', border: '1px solid var(--color-line)', borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>
              {menuOpen ? '✕ Close Menu' : '☰ Sections'}
            </button>
            <button onClick={handleLogout} className="btn btn--outline" style={{ padding: '9px 20px' }}>Log Out</button>
          </div>
        </div>
      </div>

      <div className="container admin-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, paddingBottom: 80, alignItems: 'flex-start' }} id="admin-layout">
        <nav aria-label="Admin sections" className="admin-sidebar" style={{ display: menuOpen ? 'flex' : undefined, flexDirection: 'column', gap: 6, position: 'sticky', top: 110, width: '100%' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMenuOpen(false); }}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                width: '100%',
                background: tab === t.key ? 'var(--color-paddy)' : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--color-ink)',
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-panel" style={{ minWidth: 0, width: '100%' }}>
          {tab === 'overview' && <Overview />}
          {tab === 'village' && <VillageInfoPanel notify={notify} />}
          {tab === 'gallery' && <GalleryPanel notify={notify} />}
          {tab === 'events' && <EventsPanel notify={notify} />}
          {tab === 'agriculture' && <AgriculturePanel notify={notify} />}
          {tab === 'youth' && <YouthPanel notify={notify} />}
          {tab === 'facilities' && <FacilitiesPanel notify={notify} />}
          {tab === 'contacts' && <ContactsPanel notify={notify} />}
          {tab === 'feedback' && <FeedbackPanel notify={notify} />}
          {tab === 'memories' && <MemoriesPanel notify={notify} />}
          {tab === 'security' && <SecurityPanel notify={notify} />}
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <style>{`
        /* Sidebar items always sit one below another, in a single tidy
           column — on desktop as a sticky rail, and on mobile inside the
           dropdown "Sections" panel. */
        .admin-sidebar { flex-direction: column !important; }

        @media (max-width: 860px) {
          #admin-layout { grid-template-columns: 1fr !important; gap: 18px !important; }
          .hamburger-admin { display: inline-block !important; }
          .admin-sidebar {
            display: none;
            flex-wrap: nowrap;
            position: static !important;
            background: var(--color-white);
            border: 1px solid var(--color-line);
            border-radius: var(--radius-md);
            padding: 10px;
            box-shadow: var(--shadow-card);
          }
        }
        @media (max-width: 540px) {
          .admin-layout { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Shared building blocks                                            */
/* ---------------------------------------------------------------- */

function PanelHeader({ title, description }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {description && <p style={{ marginTop: 6 }}>{description}</p>}
    </div>
  );
}

const inputStyle = {
  padding: '10px 13px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-line)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--color-ink)',
  background: 'var(--color-bg)',
  width: '100%',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-ink)' }}>
      {label}
      {children}
    </label>
  );
}

function DeleteButton({ onClick, label = 'Delete' }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: '1px solid rgba(179,67,46,0.4)', color: '#B3432E', borderRadius: 999, padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
    >
      {label}
    </button>
  );
}

/**
 * Generic "add + list + delete" manager used by most simple content types
 * (facilities, contacts, crops, resources, youth activities, services…).
 * `fields` describes the create form; `renderItem` describes each row.
 */
function ListManager({
  title, description, fields, initialForm, load, onCreate, onDelete, renderItem, notify, emptyLabel = 'Nothing added yet.',
}) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  const refresh = useCallback(async () => {
    const data = await load();
    setItems(data);
  }, [load]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleImageChange = async (name, file) => {
    if (!file) return;
    setUploadingField(name);
    try {
      const { url } = await uploadImage(file);
      handleChange(name, url);
      notify('Image uploaded.');
    } catch {
      notify('Image upload failed.', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate(form);
      setForm(initialForm);
      await refresh();
      notify('Added successfully.');
    } catch {
      notify('Could not save that — check the fields and try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      await refresh();
      notify('Removed.');
    } catch {
      notify('Could not remove that item.', 'error');
    }
  };

  return (
    <div>
      <PanelHeader title={title} description={description} />

      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {fields.map((f) => (
          <Field key={f.name} label={f.label}>
            {f.type === 'textarea' ? (
              <textarea
                rows={f.rows || 3}
                value={form[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
                required={f.required}
              />
            ) : f.type === 'select' ? (
              <select
                value={form[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={inputStyle}
                required={f.required}
              >
                <option value="" disabled>Choose…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'image' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(f.name, e.target.files?.[0])} />
                {uploadingField === f.name && <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)' }}>Uploading…</span>}
                {form[f.name] && (
                  <img src={form[f.name]} alt="Selected upload preview" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                )}
              </div>
            ) : (
              <input
                type={f.type || 'text'}
                value={form[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                style={inputStyle}
                required={f.required}
              />
            )}
          </Field>
        ))}
        <div style={{ alignSelf: 'end' }}>
          <button type="submit" className="btn btn--primary" disabled={saving || !!uploadingField} style={{ padding: '10px 22px', width: '100%', justifyContent: 'center' }}>
            {uploadingField ? 'Uploading…' : saving ? 'Saving…' : 'Add'}
          </button>
        </div>
      </form>

      {items === null ? <Loader /> : items.length === 0 ? (
        <p style={{ color: 'var(--color-ink-soft)' }}>{emptyLabel}</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => (
            <li key={item.id || item._id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>{renderItem(item)}</div>
              <DeleteButton onClick={() => handleDelete(item.id || item._id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Overview                                                          */
/* ---------------------------------------------------------------- */

function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats(false));
  }, []);

  if (stats === null) return <Loader />;
  if (stats === false) return <p>Could not load dashboard stats.</p>;

  const cards = [
    ['Announcements', stats.total_announcements],
    ['Events', stats.total_events],
    ['Gallery Images', stats.gallery_images],
    ['Services', stats.total_services],
    ['Pending Feedback', stats.pending_feedback],
    ['Pending Memories', stats.pending_memories],
    ['People Listed', stats.total_people],
  ];

  return (
    <div>
      <PanelHeader title="Overview" description="A quick snapshot of everything currently on the portal." />
      <div className="grid grid--3">
        {cards.map(([label, value]) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '26px 18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-paddy-dark)' }}>{value}</div>
            <div style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Village Info (single document)                                    */
/* ---------------------------------------------------------------- */

function VillageInfoPanel({ notify }) {
  const [info, setInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    getVillageInfo()
      .then((data) => setInfo(data || {}))
      .catch(() => setInfo({}));
  }, []);

  const handleChange = (name, value) => setInfo((i) => ({ ...i, [name]: value }));

  const handleImageChange = async (name, file) => {
    if (!file) return;
    setUploadingField(name);
    try {
      const { url } = await uploadImage(file);
      handleChange(name, url);
      notify('Image uploaded successfully.');
    } catch {
      notify('Image upload failed. Try another image.', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateVillageInfo(info);
      setInfo(updated);
      notify('Village info updated successfully!');
    } catch {
      notify('Could not update village info. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (info === null) return <Loader />;

  const textFields = [
    ['title', 'Village Title', 'text'],
    ['tagline', 'Tagline', 'text'],
    ['description', 'Description', 'textarea'],
    ['history', 'History', 'textarea'],
    ['culture', 'Culture', 'textarea'],
    ['traditions', 'Traditions', 'textarea'],
    ['main_occupations', 'Main Occupations', 'textarea'],
    ['community_values', 'Community Values', 'textarea'],
  ];
  const imageFields = [
    ['hero_image_url', 'Hero Image'],
    ['about_image_url', 'About Section Image'],
  ];
  const numberFields = [
    ['population', 'Population'],
    ['families', 'Families'],
    ['schools', 'Schools'],
    ['temples', 'Temples'],
    ['farmers', 'Farmers'],
    ['youth_members', 'Youth Members'],
  ];

  return (
    <div>
      <PanelHeader title="Village Info" description="This is the core information shown across the Home, About, and Village pages." />
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 26 }}>
        {textFields.map(([name, label, type]) => (
          <Field key={name} label={label}>
            {type === 'textarea' ? (
              <textarea rows={3} value={info[name] || ''} onChange={(e) => handleChange(name, e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            ) : (
              <input value={info[name] || ''} onChange={(e) => handleChange(name, e.target.value)} style={inputStyle} />
            )}
          </Field>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {imageFields.map(([name, label]) => (
            <Field key={name} label={label}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(name, e.target.files?.[0])} />
                {uploadingField === name && <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)' }}>Uploading…</span>}
                {info[name] && (
                  <img src={info[name]} alt="Selected upload preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                )}
              </div>
            </Field>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
          {numberFields.map(([name, label]) => (
            <Field key={name} label={label}>
              <input type="number" value={info[name] ?? 0} onChange={(e) => handleChange(name, Number(e.target.value))} style={inputStyle} />
            </Field>
          ))}
        </div>
        <button type="submit" className="btn btn--primary" disabled={saving || !!uploadingField} style={{ alignSelf: 'flex-start', padding: '11px 26px' }}>
          {uploadingField ? 'Uploading…' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Our People                                                        */
/* ---------------------------------------------------------------- */

const PEOPLE_ROLES = ['Sarpanch', 'Ward Member', 'Panchayat Secretary', 'Teacher', 'Farmer Leader', 'Youth Leader', 'Elder', 'Notable Villager', 'Other'];

function PeoplePanel({ notify }) {
  return (
    <ListManager
      title="Our People"
      description="Add anyone notable to the village directory — officials, teachers, elders, or any respected villager."
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Role', type: 'select', options: PEOPLE_ROLES },
        { name: 'photo_url', label: 'Photo', type: 'image' },
        { name: 'bio', label: 'Short Bio', type: 'textarea' },
      ]}
      initialForm={{ name: '', role: '', photo_url: '', bio: '' }}
      load={getPeople}
      onCreate={createPerson}
      onDelete={deletePerson}
      notify={notify}
      emptyLabel="No one added yet."
      renderItem={(p) => (
        <>
          <strong>{p.name}</strong>{p.role && <span style={{ color: 'var(--color-ink-soft)' }}> — {p.role}</span>}
          {p.bio && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{p.bio}</p>}
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Gallery (with file upload)                                        */
/* ---------------------------------------------------------------- */

const GALLERY_CATEGORIES = ['village', 'nature', 'festivals', 'agriculture', 'youth', 'sports', 'temples', 'old_memories'];

function GalleryPanel({ notify }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', image_url: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => setItems(await getGallery()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUploading(true);
    try {
      const { url } = await uploadImage(f);
      setForm((old) => ({ ...old, image_url: url }));
      notify('Image uploaded.');
    } catch {
      notify('Image upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) {
      notify('Upload an image first.', 'error');
      return;
    }
    setSaving(true);
    try {
      await createGalleryItem(form);
      setForm({ title: '', category: '', image_url: '' });
      setFile(null);
      await refresh();
      notify('Photo added to the gallery.');
    } catch {
      notify('Could not add that photo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryItem(id);
      await refresh();
      notify('Photo removed.');
    } catch {
      notify('Could not remove that photo.', 'error');
    }
  };

  return (
    <div>
      <PanelHeader title="Gallery" description="Upload photos of the village, festivals, and everyday life straight from your device." />

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28, padding: 24 }}>
        <Field label="Photo">
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Field>
        {form.image_url && (
          <img src={form.image_url} alt="Selected upload preview" style={{ width: 160, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={inputStyle}>
              <option value="" disabled>Choose…</option>
              {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </Field>
        </div>
        <button type="submit" className="btn btn--primary" disabled={saving || uploading} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
          {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Add to Gallery'}
        </button>
      </form>

      {items === null ? <Loader /> : items.length === 0 ? <p style={{ color: 'var(--color-ink-soft)' }}>No photos yet.</p> : (
        <div className="grid grid--4">
          {items.map((img) => (
            <div key={img.id || img._id} className="card" style={{ padding: 10 }}>
              <img src={img.image_url} alt={img.title || 'Village gallery photo'} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: '0.82rem' }}>{img.title || 'Untitled'}</span>
                <DeleteButton onClick={() => handleDelete(img.id || img._id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Events                                                             */
/* ---------------------------------------------------------------- */

const EVENT_CATEGORIES = ['festival', 'sports', 'cultural', 'youth', 'community', 'meeting'];

function EventsPanel({ notify }) {
  return (
    <ListManager
      title="Events"
      description="Upcoming and past village events. You can upload photos directly from your device."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', options: EVENT_CATEGORIES },
        { name: 'event_date', label: 'Date', type: 'date', required: true },
        { name: 'location', label: 'Location' },
        { name: 'status', label: 'Status', type: 'select', options: ['upcoming', 'completed'] },
        { name: 'image_url', label: 'Photo (From device)', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      initialForm={{ title: '', category: '', event_date: '', location: '', status: 'upcoming', description: '', image_url: '' }}
      load={getEvents}
      onCreate={createEvent}
      onDelete={deleteEvent}
      notify={notify}
      renderItem={(ev) => (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {ev.image_url && (
            <img src={ev.image_url} alt={ev.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          )}
          <div>
            <strong>{ev.title}</strong>
            <span style={{ color: 'var(--color-ink-soft)' }}> — {ev.category}, {ev.status}</span>
            {ev.event_date && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{new Date(ev.event_date).toLocaleDateString()}{ev.location ? ` · ${ev.location}` : ''}</p>}
          </div>
        </div>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Announcements                                                     */
/* ---------------------------------------------------------------- */

const ANNOUNCEMENT_CATEGORIES = ['panchayat', 'education', 'agriculture', 'events', 'schemes', 'emergency', 'general'];

function AnnouncementsPanel({ notify }) {
  return (
    <ListManager
      title="Announcements"
      description="Notices and updates shown on the Announcements page."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ANNOUNCEMENT_CATEGORIES },
        { name: 'content', label: 'Content', type: 'textarea', required: true },
        { name: 'is_published', label: 'Published', type: 'select', options: ['true', 'false'] },
      ]}
      initialForm={{ title: '', category: '', content: '', is_published: 'true' }}
      load={getAllAnnouncementsAdmin}
      onCreate={(form) => createAnnouncement({ ...form, is_published: form.is_published === 'true' })}
      onDelete={deleteAnnouncement}
      notify={notify}
      renderItem={(a) => (
        <>
          <strong>{a.title}</strong>
          <span style={{ color: 'var(--color-ink-soft)' }}> — {a.category}{a.is_published ? '' : ' (unpublished)'}</span>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{a.content}</p>
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Services                                                           */
/* ---------------------------------------------------------------- */

const SERVICE_CATEGORIES = ['grocery', 'medical', 'mechanic', 'electrician', 'plumber', 'tailor', 'restaurant', 'transport', 'agriculture', 'other'];

function ServicesPanel({ notify }) {
  return (
    <ListManager
      title="Local Services"
      description="Shops, tradespeople, and services villagers rely on."
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'category', label: 'Category', type: 'select', options: SERVICE_CATEGORIES },
        { name: 'contact_phone', label: 'Phone' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      initialForm={{ name: '', category: '', contact_phone: '', description: '' }}
      load={getServices}
      onCreate={createService}
      onDelete={deleteService}
      notify={notify}
      renderItem={(s) => (
        <>
          <strong>{s.name}</strong>
          <span style={{ color: 'var(--color-ink-soft)' }}> — {s.category}</span>
          {s.contact_phone && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{s.contact_phone}</p>}
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Agriculture — crops + farmer resources                            */
/* ---------------------------------------------------------------- */

function AgriculturePanel({ notify }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <ListManager
        title="Crops"
        description="Crops grown in and around the village. You can upload photos directly from your device."
        fields={[
          { name: 'name', label: 'Crop Name', required: true },
          { name: 'season', label: 'Season' },
          { name: 'image_url', label: 'Photo (From device)', type: 'image' },
          { name: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        initialForm={{ name: '', season: '', notes: '', image_url: '' }}
        load={getCrops}
        onCreate={createCrop}
        onDelete={deleteCrop}
        notify={notify}
        renderItem={(c) => (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {c.image_url && (
              <img src={c.image_url} alt={c.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
            )}
            <div>
              <strong>{c.name}</strong>
              {c.season && <span style={{ color: 'var(--color-ink-soft)' }}> — {c.season}</span>}
              {c.notes && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{c.notes}</p>}
            </div>
          </div>
        )}
      />
      <ListManager
        title="Farmer Resources"
        description="Schemes, contacts, or info useful to local farmers."
        fields={[
          { name: 'title', label: 'Title', required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'link', label: 'Link (optional)' },
        ]}
        initialForm={{ title: '', description: '', link: '' }}
        load={getFarmerResources}
        onCreate={createFarmerResource}
        onDelete={deleteFarmerResource}
        notify={notify}
        renderItem={(r) => (
          <>
            <strong>{r.title}</strong>
            {r.description && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{r.description}</p>}
          </>
        )}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Youth activities                                                   */
/* ---------------------------------------------------------------- */

function YouthPanel({ notify }) {
  return (
    <ListManager
      title="Youth Activities"
      description="Clubs, sports, and initiatives run by village youth. You can upload photos directly from your device."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'image_url', label: 'Photo (From device)', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      initialForm={{ title: '', description: '', image_url: '' }}
      load={getYouthActivities}
      onCreate={createYouthActivity}
      onDelete={deleteYouthActivity}
      notify={notify}
      renderItem={(y) => (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {y.image_url && (
            <img src={y.image_url} alt={y.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          )}
          <div>
            <strong>{y.title}</strong>
            {y.description && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{y.description}</p>}
          </div>
        </div>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Facilities                                                         */
/* ---------------------------------------------------------------- */

const FACILITY_CATEGORIES = ['school', 'temple', 'health', 'panchayat', 'shop', 'playground', 'park', 'water', 'transport'];

function FacilitiesPanel({ notify }) {
  return (
    <ListManager
      title="Facilities"
      description="Schools, temples, health centres, and other village facilities. You can upload photos directly from your device."
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'category', label: 'Category', type: 'select', options: FACILITY_CATEGORIES },
        { name: 'image_url', label: 'Photo (From device)', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      initialForm={{ name: '', category: '', description: '', image_url: '' }}
      load={getFacilities}
      onCreate={createFacility}
      onDelete={deleteFacility}
      notify={notify}
      renderItem={(f) => (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {f.image_url && (
            <img src={f.image_url} alt={f.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          )}
          <div>
            <strong>{f.name}</strong>
            <span style={{ color: 'var(--color-ink-soft)' }}> — {f.category}</span>
            {f.description && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{f.description}</p>}
          </div>
        </div>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Important contacts                                                 */
/* ---------------------------------------------------------------- */

function ContactsPanel({ notify }) {
  return (
    <ListManager
      title="Important Contacts"
      description="Phone numbers villagers may need in an emergency or for local services."
      fields={[
        { name: 'name', label: 'Name / Office', required: true },
        { name: 'role', label: 'Role' },
        { name: 'phone', label: 'Phone', required: true },
      ]}
      initialForm={{ name: '', role: '', phone: '' }}
      load={getContacts}
      onCreate={createContact}
      onDelete={deleteContact}
      notify={notify}
      renderItem={(c) => (
        <>
          <strong>{c.name}</strong>
          {c.role && <span style={{ color: 'var(--color-ink-soft)' }}> — {c.role}</span>}
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{c.phone}</p>
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Feedback (moderation, no create)                                   */
/* ---------------------------------------------------------------- */

function FeedbackPanel({ notify }) {
  const [items, setItems] = useState(null);

  const refresh = useCallback(async () => setItems(await getAllFeedback()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleReview = async (id) => {
    try { await reviewFeedback(id); await refresh(); notify('Marked as reviewed.'); }
    catch { notify('Could not update that feedback.', 'error'); }
  };
  const handleDelete = async (id) => {
    try { await deleteFeedback(id); await refresh(); notify('Feedback removed.'); }
    catch { notify('Could not remove that feedback.', 'error'); }
  };

  return (
    <div>
      <PanelHeader title="Feedback" description="Suggestions and complaints submitted by villagers." />
      {items === null ? <Loader /> : items.length === 0 ? <p style={{ color: 'var(--color-ink-soft)' }}>No feedback yet.</p> : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((f) => (
            <li key={f.id || f._id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <strong>{f.category || 'General'}</strong>
                <span style={{ color: 'var(--color-ink-soft)' }}> — {f.status}</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{f.message}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {f.status !== 'reviewed' && (
                  <button onClick={() => handleReview(f.id || f._id)} className="btn btn--outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Mark Reviewed</button>
                )}
                <DeleteButton onClick={() => handleDelete(f.id || f._id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Memories (moderation, no create)                                   */
/* ---------------------------------------------------------------- */

function MemoriesPanel({ notify }) {
  const [items, setItems] = useState(null);

  const refresh = useCallback(async () => setItems(await getPendingMemories()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleModerate = async (id, status) => {
    try { await moderateMemory(id, status); await refresh(); notify(status === 'approved' ? 'Memory approved.' : 'Memory rejected.'); }
    catch { notify('Could not update that memory.', 'error'); }
  };

  return (
    <div>
      <PanelHeader title="Memories" description="Villager-submitted memories waiting for approval before they appear publicly." />
      {items === null ? <Loader /> : items.length === 0 ? <p style={{ color: 'var(--color-ink-soft)' }}>No memories pending review.</p> : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((m) => (
            <li key={m.id || m._id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                {m.author_name && <strong>{m.author_name}</strong>}
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{m.content || m.text}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleModerate(m.id || m._id, 'approved')} className="btn btn--primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Approve</button>
                <DeleteButton onClick={() => handleModerate(m.id || m._id, 'rejected')} label="Reject" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Security & Password Management                                    */
/* ---------------------------------------------------------------- */

function SecurityPanel({ notify }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.trim().length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: currentPassword || undefined,
        newPassword: newPassword.trim(),
      });
      notify('Password updated successfully! Please keep your new password safe.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update password. Please check your credentials.';
      setError(msg);
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Admin Security & Password"
        description="Change your login password at any time. Choose a password you can easily remember."
      />
      <div className="card" style={{ maxWidth: 520, padding: '32px 28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Current Password (Optional if first change)">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              style={inputStyle}
            />
          </Field>

          <Field label="New Password">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 4 characters"
              required
              style={inputStyle}
            />
          </Field>

          <Field label="Confirm New Password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
              style={inputStyle}
            />
          </Field>

          {error && (
            <p role="alert" style={{ color: '#B3432E', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
              {error}
            </p>
          )}

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Updating Password…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
