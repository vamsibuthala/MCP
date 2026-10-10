export default function CropCard({ crop }) {
  return (
    <div className="card">
      <h3>{crop.name}{crop.is_demo_data && <span className="demo-flag">demo</span>}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>{crop.season}</p>
      <p>{crop.description}</p>
    </div>
  );
}
