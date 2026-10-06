// src/pages/RorisangProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import { rorisangData } from '../data/rorisangData';
import './VendorShared.css';

function RorisangProfile() {
  const p = rorisangData;

  const order = () => {
    const url = `https://wa.me/${p.contact.whatsapp}?text=${encodeURIComponent(p.contact.defaultMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="vendor-page">
      <Link to="/marketplace" className="vendor-back">← Back to Marketplace</Link>

      <header className="vendor-header">
        <div className="vendor-avatar-wrap">
          <img
            className="vendor-avatar"
            src={p.profileImage}
            alt={p.name}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="vendor-info">
          <span className="vendor-badge">{p.badge}</span>
          <h1 className="vendor-name">{p.name}</h1>
          <p className="vendor-business">{p.businessName}</p>
          {p.education && <p className="vendor-detail">🎓 {p.education}</p>}
          <p className="vendor-detail">📍 {p.location}</p>
          <p className="vendor-bio">{p.bio}</p>
          <button className="vendor-cta" onClick={order}>
            💬 Place an Order on WhatsApp
          </button>
        </div>
      </header>

      {p.pricingModel && (
        <section className="vendor-section">
          <h2 className="vendor-section-title">{p.pricingModel.title}</h2>
          <div className="vendor-price-items">
            {p.pricingModel.rules.map((rule) => (
              <div key={rule.label} className="vendor-price-row">
                <span className="vendor-price-label">{rule.label}</span>
                <span className="vendor-price-amount">{rule.value}</span>
              </div>
            ))}
          </div>
          {p.pricingModel.note && (
            <p className="vendor-note">{p.pricingModel.note}</p>
          )}
        </section>
      )}

      {p.highlights && p.highlights.length > 0 && (
        <section className="vendor-section">
          <h2 className="vendor-section-title">What I Offer</h2>
          <ul className="vendor-highlights">
            {p.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="vendor-section">
        <h2 className="vendor-section-title">Contact Details</h2>
        <div className="vendor-contact-list">
          {p.phoneNumbers && p.phoneNumbers.map((num) => (
            <p key={num} className="vendor-detail">📞 {num}</p>
          ))}
          {p.email && <p className="vendor-detail">✉️ {p.email}</p>}
        </div>
      </section>
    </div>
  );
}

export default RorisangProfile;