import React from 'react';
import { Link } from 'react-router-dom';
import { providers } from '../data/providers';
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

// Map Maseeiso's services to category names for the card display
const maseeisoCategory = 'Food & Eats • Laundry';

function Marketplace() {
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
        <div className="marketplace-vendors">
          {/* Maseeiso Thaanyane */}
          <div className="vendor-card">
            {providers.maseeiso.profileImage ? (
              <img 
                src={providers.maseeiso.profileImage} 
                alt={providers.maseeiso.name} 
                className="vendor-image"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="vendor-image-placeholder">
                <span>{providers.maseeiso.name.charAt(0)}</span>
              </div>
            )}
            <div className="vendor-info">
              <span className="vendor-category">{maseeisoCategory}</span>
              <h3>{providers.maseeiso.name}</h3>
              <p>{providers.maseeiso.bio}</p>
              <p className="vendor-education">🎓 {providers.maseeiso.education}</p>
              <div className="vendor-services">
                {providers.maseeiso.services.map((s, i) => (
                  <span key={i} className="service-tag">{s.icon} {s.name}</span>
                ))}
              </div>
              <Link 
                to={`/provider/${providers.maseeiso.id}`} 
                className="vendor-profile-link"
              >
                View Full Profile →
              </Link>
            </div>
          </div>
        </div>
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