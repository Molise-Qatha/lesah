import React from 'react';
import { Link } from 'react-router-dom';
import './Marketplace.css';

const categories = [
  {
    icon: '🏠',
    title: 'Accommodation',
    desc: 'Find student housing near campus',
    link: '/accommodation',
    active: true,
  },
  {
    icon: '🍔',
    title: 'Food & Eats',
    desc: 'Meals, snacks, and catering',
    link: null,
    active: false,
  },
  {
    icon: '🚚',
    title: 'Delivery & Errands',
    desc: 'Transport and moving services',
    link: null,
    active: false,
  },
  {
    icon: '💻',
    title: 'Tech & Gadgets',
    desc: 'Repairs, sales, and support',
    link: null,
    active: false,
  },
  {
    icon: '📚',
    title: 'Textbooks & Stationery',
    desc: 'Buy, sell, or trade study materials',
    link: null,
    active: false,
  },
  {
    icon: '💇',
    title: 'Beauty & Grooming',
    desc: 'Hair, nails, and personal care',
    link: null,
    active: false,
  },
  {
    icon: '🎓',
    title: 'Tutoring',
    desc: 'Academic help and mentorship',
    link: null,
    active: false,
  },
  {
    icon: '💰',
    title: 'Student Loans',
    desc: 'Financial assistance options',
    link: null,
    active: false,
  },
];

const vendors = [
  // Add your first vendor here
  // {
  //   name: 'Vendor Name',
  //   category: 'Food & Eats',
  //   desc: 'Description of services',
  //   image: '/images/vendors/vendor1.jpg',
  //   whatsapp: '266xxxxxxxx',
  //   services: ['Service 1', 'Service 2'],
  // },
];

function Marketplace() {
  const openWhatsApp = (number, vendorName) => {
    const message = `Hello, I'm interested in your services on LeSAH Marketplace${vendorName ? ` (${vendorName})` : ''}. Can you tell me more?`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const becomeVendor = () => {
    const message = `Hello LeSAH, I want to list my business on the Marketplace. Here are my details:\n\nBusiness Name:\nCategory:\nServices:\nContact Number:`;
    window.open(`https://wa.me/26656613551?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="marketplace-page">
      {/* Hero */}
      <section className="marketplace-hero">
        <h1>🛒 LeSAH Marketplace</h1>
        <p>Everything a student needs — from trusted vendors near your campus.</p>
        <button className="vendor-cta-btn" onClick={becomeVendor}>
          📢 Become a Vendor
        </button>
      </section>

      {/* Categories Grid */}
      <section className="marketplace-section">
        <h2>Browse Categories</h2>
        <div className="marketplace-categories">
          {categories.map((cat, idx) => (
            <div key={idx} className={`marketplace-category-card ${!cat.active ? 'coming-soon' : ''}`}>
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              {cat.active ? (
                <Link to={cat.link} className="category-link">Browse →</Link>
              ) : (
                <span className="coming-soon-badge">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Vendors Section */}
      <section className="marketplace-section">
        <h2>Featured Vendors</h2>
        {vendors.length > 0 ? (
          <div className="marketplace-vendors">
            {vendors.map((vendor, idx) => (
              <div key={idx} className="vendor-card">
                {vendor.image && <img src={vendor.image} alt={vendor.name} className="vendor-image" />}
                <div className="vendor-info">
                  <span className="vendor-category">{vendor.category}</span>
                  <h3>{vendor.name}</h3>
                  <p>{vendor.desc}</p>
                  <div className="vendor-services">
                    {vendor.services.map((s, i) => (
                      <span key={i} className="service-tag">{s}</span>
                    ))}
                  </div>
                  <button
                    className="vendor-contact-btn"
                    onClick={() => openWhatsApp(vendor.whatsapp, vendor.name)}
                  >
                    💬 Chat on WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-vendors">
            <p>🛍️ Vendors are coming soon! Interested in listing your services?</p>
            <button className="vendor-cta-btn" onClick={becomeVendor}>
              Become Our First Vendor
            </button>
          </div>
        )}
      </section>

      {/* Student Zone Promo */}
      <section className="marketplace-section">
        <div className="student-zone-promo">
          <h2>🎮 Need a Break?</h2>
          <p>Play Basotho games like Ho Kalla and Morabaraba in the Student Zone.</p>
          <Link to="/student-zone" className="category-link">Visit Student Zone →</Link>
        </div>
      </section>
    </div>
  );
}

export default Marketplace;