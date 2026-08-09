import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { providers, openProviderWhatsApp } from '../data/providers';
import './ProviderProfile.css';

function ProviderProfile() {
  const { providerId } = useParams();
  const provider = providers[providerId];

  if (!provider) {
    return (
      <div className="provider-profile-page">
        <div className="provider-not-found">
          <h2>Provider Not Found</h2>
          <p>The service provider you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="back-link">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-profile-page">
      {/* Back Navigation */}
      <div className="provider-back-nav">
        <Link to="/marketplace" className="back-link">← Back to Marketplace</Link>
      </div>

      {/* Profile Header */}
      <section className="provider-header">
        <div className="provider-header-content">
          <div className="provider-image-container">
            {provider.profileImage ? (
              <img
                src={provider.profileImage}
                alt={provider.name}
                className="provider-profile-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('no-image');
                }}
              />
            ) : null}
            <div className="provider-image-placeholder">
              {provider.name.charAt(0)}
            </div>
          </div>
          <div className="provider-header-info">
            <span className="provider-badge">{provider.badge}</span>
            <h1>{provider.name}</h1>
            <p className="provider-education">🎓 {provider.education}</p>
            <p className="provider-bio">{provider.bio}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="provider-services">
        <h2>Services Offered</h2>
        <div className="provider-services-grid">
          {provider.services.map((service) => (
            <div key={service.id} className="provider-service-card">
              {service.image ? (
                <div className="service-card-image">
                  <img
                    src={service.image}
                    alt={service.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="service-card-icon">{service.icon}</span>
                </div>
              ) : (
                <div className="service-card-icon-only">
                  <span>{service.icon}</span>
                </div>
              )}
              <div className="service-card-content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <button
                  className="whatsapp-contact-btn"
                  onClick={() => openProviderWhatsApp(provider.whatsapp, service.whatsappMessage)}
                >
                  💬 Contact on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="provider-trust">
        <div className="trust-item">
          <span>🎓</span>
          <p>NUL Alumni</p>
        </div>
        <div className="trust-item">
          <span>✅</span>
          <p>Verified Provider</p>
        </div>
        <div className="trust-item">
          <span>🤝</span>
          <p>Student Trusted</p>
        </div>
      </section>
    </div>
  );
}

export default ProviderProfile;