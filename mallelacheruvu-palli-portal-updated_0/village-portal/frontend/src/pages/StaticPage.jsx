export default function StaticPage({ title, children }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
