// src/pages/ThapeloProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import { thapeloData } from '../data/thapeloData';
import './VendorShared.css';

function ThapeloProfile() {
  const p = thapeloData;

  const order = (item) => {
    const msg = item
      ? `Hello ${p.name}, I found Gold Garden Poultry on LeSAH and would like to order ${item}.`
      : p.contact.defaultMessage;
    const url = `https://wa.me/${p.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
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
          <button className="vendor-cta" onClick={() => order()}>
            💬 Order on WhatsApp
          </button>
        </div>
      </header>

      <section className="vendor-section">
        <h2 className="vendor-section-title">Price List</h2>
        <div className="vendor-price-items">
          {p.priceList.map((item) => (
            <div key={item.label} className="vendor-price-row">
              <span className="vendor-price-label">{item.label}</span>
              <span className="vendor-price-amount">
                {p.currency}
                {item.amount}
              </span>
              <button
                className="vendor-book-btn"
                onClick={() => order(item.label)}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </section>

      {p.gallery && p.gallery.length > 0 && (
        <section className="vendor-section">
          <h2 className="vendor-section-title">From the Farm</h2>
          <div className="vendor-gallery">
            {p.gallery.map((img) => (
              <div key={img.src} className="vendor-gallery-item">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {p.posterImage && (
        <section className="vendor-section">
          <h2 className="vendor-section-title">Poster</h2>
          <div className="vendor-poster">
            <img
              src={p.posterImage}
              alt={`${p.businessName} poster`}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default ThapeloProfile;