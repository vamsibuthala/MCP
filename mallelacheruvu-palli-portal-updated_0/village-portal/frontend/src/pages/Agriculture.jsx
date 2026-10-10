import { useEffect, useState } from 'react';
import { getCrops, getFarmerResources } from '../api/endpoints';
import CropCard from '../components/CropCard';
import SectionHeading from '../components/SectionHeading';
import Loader from '../components/Loader';

export default function Agriculture() {
  const [crops, setCrops] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getCrops(), getFarmerResources()]).then(([c, r]) => {
      if (c.status === 'fulfilled') setCrops(c.value);
      if (r.status === 'fulfilled') setResources(r.value);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Agriculture" title="The heart of village life" align="center"
            description="Farming shapes the seasons, the calendar, and the community here. Crop details below are placeholders until an administrator adds real figures." />
          <div className="grid grid--3">
            {crops.map((c) => <CropCard key={c.id} crop={c} />)}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Support" title="Farmer Resources" />
          <div className="grid grid--3">
            {resources.map((r) => (
              <div className="card" key={r.id}>
                <span className="eyebrow">{r.category.replace('_', ' ')}</span>
                <h3>{r.title}{r.is_demo_data && <span className="demo-flag">demo</span>}</h3>
                <p>{r.description}</p>
                {r.link_url && <a href={r.link_url} className="btn btn--outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Learn more</a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
