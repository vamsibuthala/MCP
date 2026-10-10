const ICONS = {
  school: '🏫', temple: '🛕', health: '🏥', panchayat: '🏛️', shop: '🏪',
  playground: '🏏', park: '🌳', water: '💧', transport: '🚌',
};

export default function FacilityCard({ facility }) {
  return (
    <div className="card">
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>{ICONS[facility.category] || '📍'}</div>
      <h3>{facility.name}{facility.is_demo_data && <span className="demo-flag">demo</span>}</h3>
      <p>{facility.description}</p>
      {facility.location_details && (
        <button className="btn btn--outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          {facility.location_details}
        </button>
      )}
    </div>
  );
}
