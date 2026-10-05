// src/pages/HairVendorProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import { hairVendorData } from '../data/hairVendorData';
import './VendorShared.css';

function HairVendorProfile() {
  const p = hairVendorData;

  const book = (style) => {
    const msg = style
      ? `Hello ${p.name}, I found your hair services on LeSAH and would like to book ${style}.`
      : p.contact.defaultMessage;
    const url = `https://wa.me/${p.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          <button className="vendor-cta" onClick={() => book()}>
            💬 Contact Pont&apos;so on WhatsApp
          </button>
        </div>
      </header>

      <section className="vendor-section">
        <h2 className="vendor-section-title">Price List</h2>
        {p.currencyNote && (
          <p className="vendor-note">{p.currencyNote}</p>
        )}
        <div className="vendor-pricelist">
          {p.priceList.map((group) => (
            <div key={group.category} className="vendor-price-group">
              <h3 className="vendor-price-cat">{group.category}</h3>
              <ul className="vendor-price-items">
                {group.items.map((it) => (
                  <li key={it.label} className="vendor-price-item">
                    <span className="vendor-price-label">{it.label}</span>
                    <span className="vendor-price-amount">
                      {p.currency}
                      {it.amount}
                    </span>
                    <button
                      className="vendor-book-btn"
                      onClick={() => book(group.category)}
                    >
                      Book
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HairVendorProfile;