// src/pages/EasyLearnProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import { easylearnData } from '../data/easylearnData';
import './VendorShared.css';

function EasyLearnProfile() {
  const p = easylearnData;

  const openSite = () =>
    window.open(p.contact.url, '_blank', 'noopener,noreferrer');

  return (
    <div className="vendor-page">
      <Link to="/marketplace" className="vendor-back">
        ← Back to Marketplace
      </Link>

      <header className="vendor-header">
        <div className="vendor-avatar-wrap">
          <img
            className="vendor-avatar"
            src={p.profileImage}
            alt={p.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="vendor-info">
          <span className="vendor-badge">{p.badge}</span>
          <h1 className="vendor-name">{p.name}</h1>
          {p.education && (
            <p className="vendor-detail">🎓 {p.education}</p>
          )}
          <p className="vendor-detail">📍 {p.location}</p>
          <p className="vendor-bio">{p.bio}</p>
          <button className="vendor-cta" onClick={openSite}>
            🌐 {p.contact.label || 'Visit Website'}
          </button>
        </div>
      </header>

      <section className="vendor-section">
        <h2 className="vendor-section-title">Subjects Offered</h2>
        <div className="vendor-service-grid">
          {p.services.map((s) => (
            <div key={s.id} className="vendor-service-card">
              <span className="vendor-service-icon">{s.icon}</span>
              <h3 className="vendor-service-name">{s.name}</h3>
              <p className="vendor-service-desc">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {p.highlights && p.highlights.length > 0 && (
        <section className="vendor-section">
          <h2 className="vendor-section-title">By the Numbers</h2>
          <ul className="vendor-highlights">
            {p.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {p.testimonial && (
        <section className="vendor-section">
          <div className="vendor-quote">
            <blockquote>&ldquo;{p.testimonial.quote}&rdquo;</blockquote>
            <p>{p.testimonial.subtext}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default EasyLearnProfile;