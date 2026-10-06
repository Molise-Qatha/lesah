// src/pages/ServicePage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { services } from '../data/services';
import { featuredProviders } from '../data/marketplaceData';
import './ServicePage.css';

function ServicePage() {
  const { serviceId } = useParams();
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="service-page">
        <div className="service-not-found">
          <h1>Service not found</h1>
          <p>
            No service matches &quot;<code>{serviceId}</code>&quot;.
          </p>
          <Link to="/marketplace" className="service-back-cta">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const providers = service.providerIds
    .map((id) => featuredProviders.find((p) => p.id === id))
    .filter(Boolean);

  const hasProviders = providers.length > 0;

  const referProvider = () => {
    window.open(
      `https://wa.me/26656613551?text=${encodeURIComponent(
        `Hello LeSAH, I know someone who offers ${service.name}. I'd like to refer them.\n\nBusiness Name:\nContact Number:`
      )}`,
      '_blank'
    );
  };

  return (
    <div className="service-page">
      <Link to="/marketplace" className="service-back">
        ← Back to Marketplace
      </Link>

      <header className="service-hero">
        <span className="service-hero-icon">{service.icon}</span>
        <h1 className="service-hero-title">{service.name}</h1>
        <p className="service-hero-tagline">{service.tagline}</p>
        {hasProviders && (
          <p className="service-hero-count">
            {providers.length} {providers.length === 1 ? 'provider' : 'providers'} available
          </p>
        )}
      </header>

      {hasProviders ? (
        <section className="service-providers">
          <div className="service-provider-grid">
            {providers.map((p) => (
              <Link
                key={p.id}
                to={p.profileUrl}
                className="service-provider-card"
              >
                <div className="service-provider-avatar">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="service-provider-placeholder">
                      {p.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="service-provider-info">
                  <h3>{p.name}</h3>
                  {p.category && <p className="service-provider-cat">{p.category}</p>}
                  <p className="service-provider-detail">
                    {p.statusIcon || '🎓'} {p.status}
                    {p.course ? ` • ${p.course}` : ''}
                  </p>
                  <p className="service-provider-detail">📍 {p.location}</p>
                  <span className="service-provider-link">View Profile →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="service-empty">
          <div className="service-empty-icon">⏳</div>
          <h2>Coming soon</h2>
          <p>
            We don&apos;t have anyone offering <strong>{service.name}</strong> yet.
            Know someone who does? Tell them about LeSAH — or refer them yourself.
          </p>
          <button className="service-empty-cta" onClick={referProvider}>
            Refer a Provider →
          </button>
        </section>
      )}
    </div>
  );
}

export default ServicePage;