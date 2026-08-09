import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { maseeisoData } from '../data/maseeisoData';
import ServiceImageCarousel from '../components/ServiceImageCarousel';
import ImageViewer from '../components/ImageViewer';
import './ProviderProfile.css';

const WHATSAPP = maseeisoData.whatsapp;

function ProviderProfile() {
  const [viewerImage, setViewerImage] = useState(null);
  const [activeSection, setActiveSection] = useState('food');

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="provider-storefront">
      
      {/* ── Provider Header ── */}
      <header className="storefront-header">
        <div className="storefront-header-inner">
          {maseeisoData.profileImage ? (
            <img
              src={maseeisoData.profileImage}
              alt={maseeisoData.name}
              className="storefront-avatar"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="storefront-avatar-placeholder">
              {maseeisoData.name.charAt(0)}
            </div>
          )}
          <div className="storefront-header-text">
            <h1>{maseeisoData.name}</h1>
            <p className="storefront-edu">{maseeisoData.education}</p>
            <p className="storefront-loc">📍 {maseeisoData.location}</p>
            <p className="storefront-bio">{maseeisoData.bio}</p>
            <button
              className="storefront-whatsapp-btn"
              onClick={() => openWhatsApp(`Hello Maseeiso, I found your profile on LeSAH and would like to enquire about your services.`)}
            >
              💬 Contact Maseeiso on WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* ── Service Navigation ── */}
      <nav className="storefront-nav">
        <button
          className={`storefront-nav-btn ${activeSection === 'food' ? 'active' : ''}`}
          onClick={() => scrollTo('food')}
        >
          🍲 Food
        </button>
        <button
          className={`storefront-nav-btn ${activeSection === 'laundry' ? 'active' : ''}`}
          onClick={() => scrollTo('laundry')}
        >
          🧺 Laundry
        </button>
      </nav>

      {/* ═══════════ FOOD ═══════════ */}
      <section id="food" className="storefront-section">
        <div className="storefront-section-header">
          <h2>Food &amp; Meals</h2>
          <p>Fresh, affordable meals prepared for students in Roma.</p>
        </div>

        <ServiceImageCarousel images={maseeisoData.food.images} />

        {/* Weekly Menu */}
        <div className="storefront-subsection">
          <h3>Weekly Menu</h3>
          <ul className="storefront-menu-list">
            {maseeisoData.food.weeklyMenu.map((item, i) => (
              <li key={i} className="menu-item">
                <span className="menu-day">{item.day}</span>
                <span className="menu-meal">{item.meal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meal Plans */}
        <div className="storefront-subsection">
          <h3>Meal Plans</h3>
          <div className="storefront-pricing-row">
            {maseeisoData.food.mealPlans.map((plan, i) => (
              <div key={i} className="pricing-block">
                <span className="pricing-price">M{plan.price}</span>
                <span className="pricing-detail">{plan.weeks} WEEK{plan.weeks > 1 ? 'S' : ''}</span>
                <span className="pricing-detail">{plan.meals} MEALS</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Menu Image */}
        <div className="storefront-subsection">
          <h3>Full Food Menu</h3>
          <div
            className="storefront-menu-poster"
            onClick={() => setViewerImage(maseeisoData.food.menuImage)}
          >
            <img
              src={maseeisoData.food.menuImage}
              alt="Full food menu"
              className="menu-poster-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('menu-poster-placeholder');
              }}
            />
            <span className="menu-poster-hint">Tap to view full size</span>
          </div>
        </div>

        {/* Order CTA */}
        <div className="storefront-cta">
          <p>Ready to order?</p>
          <button
            className="storefront-whatsapp-btn"
            onClick={() => openWhatsApp(`Hello Maseeiso, I'd like to order food from LeSAH.`)}
          >
            🍲 Order Food on WhatsApp
          </button>
        </div>
      </section>

      {/* ═══════════ LAUNDRY ═══════════ */}
      <section id="laundry" className="storefront-section">
        <div className="storefront-section-header">
          <h2>Laundry Service</h2>
          <p>Wash, dry and fold — convenient laundry services for students.</p>
        </div>

        <ServiceImageCarousel images={maseeisoData.laundry.images} />

        {/* Prices */}
        <div className="storefront-subsection">
          <h3>Laundry Prices</h3>
          <ul className="storefront-menu-list">
            {maseeisoData.laundry.prices.map((item, i) => (
              <li key={i} className="menu-item">
                <span className="menu-day">{item.size}</span>
                <span className="menu-meal">M{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly Packages */}
        <div className="storefront-subsection">
          <h3>Monthly Packages</h3>
          <ul className="storefront-menu-list">
            {maseeisoData.laundry.monthlyPackages.map((item, i) => (
              <li key={i} className="menu-item">
                <span className="menu-day">{item.size}</span>
                <span className="menu-meal">M{item.price}/month</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Included */}
        <div className="storefront-subsection">
          <h3>What's Included</h3>
          <ul className="storefront-checklist">
            {maseeisoData.laundry.included.map((item, i) => (
              <li key={i}>✓ {item}</li>
            ))}
          </ul>
        </div>

        {/* Laundry Menu Image */}
        <div className="storefront-subsection">
          <h3>Laundry Information</h3>
          <div
            className="storefront-menu-poster"
            onClick={() => setViewerImage(maseeisoData.laundry.menuImage)}
          >
            <img
              src={maseeisoData.laundry.menuImage}
              alt="Laundry menu"
              className="menu-poster-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('menu-poster-placeholder');
              }}
            />
            <span className="menu-poster-hint">Tap to view full size</span>
          </div>
        </div>

        {/* Order CTA */}
        <div className="storefront-cta">
          <p>Need your clothes cleaned?</p>
          <button
            className="storefront-whatsapp-btn"
            onClick={() => openWhatsApp(`Hello Maseeiso, I'd like to use your laundry service from LeSAH.`)}
          >
            🧺 Order Laundry on WhatsApp
          </button>
        </div>
      </section>

      {/* ── Image Viewer ── */}
      {viewerImage && (
        <ImageViewer
          src={viewerImage}
          alt="Full size view"
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  );
}

export default ProviderProfile;