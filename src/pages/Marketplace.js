import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { featuredProviders, foodItems, categories, servicesList } from '../data/marketplaceData';
import HorizontalScroller from '../components/HorizontalScroller';
import './Marketplace.css';

function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter featured providers based on search + category
  const filteredProviders = useMemo(() => {
    return featuredProviders.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' ||
        p.category.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Filter food items
  const filteredFood = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || activeCategory === 'food';
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const featuredProvider = featuredProviders.find((p) => p.featured);

  const becomeVendor = () => {
    window.open(
      `https://wa.me/26656613551?text=${encodeURIComponent(
        'Hello LeSAH, I want to list my business on the Marketplace.\n\nBusiness Name:\nCategory:\nServices:\nContact Number:'
      )}`,
      '_blank'
    );
  };

  return (
    <div className="marketplace-new">
      {/* ═══════════ HERO ═══════════ */}
      <section className="mp-hero">
        <div className="mp-hero-content">
          <h1>Discover. Connect. Support.</h1>
          <p>Find businesses and services built around student life in Lesotho.</p>
          
          {/* Search */}
          <div className="mp-search-wrapper">
            <span className="mp-search-icon">🔍</span>
            <input
              type="text"
              className="mp-search-input"
              placeholder="Search for food, laundry, groceries, accommodation, delivery and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="mp-search-clear" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          {/* Category Scroller */}
          <div className="mp-category-scroller">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`mp-category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STUDENT BUSINESSES ═══════════ */}
      <section className="mp-section">
        <div className="mp-section-header">
          <h2>Student Businesses</h2>
          <p>Discover products and services created by students and young entrepreneurs.</p>
        </div>

        {filteredProviders.length > 0 ? (
          <HorizontalScroller>
            {filteredProviders.map((provider) => (
              <Link
                key={provider.id}
                to={provider.profileUrl}
                className="mp-business-card"
              >
                <div className="mp-business-image">
                  {provider.image ? (
                    <img
                      src={provider.image}
                      alt={provider.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="mp-business-placeholder">
                      {provider.name.charAt(0)}
                    </div>
                  )}
                  <div className="mp-business-overlay">
                    <h3>{provider.name}</h3>
                    <p>{provider.category}</p>
                    <span className="mp-business-link">View Business →</span>
                  </div>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        ) : (
          <div className="mp-empty">
            <p>No businesses match your search.</p>
            <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ FOOD DISCOVERY ═══════════ */}
      {(activeCategory === 'all' || activeCategory === 'food') && filteredFood.length > 0 && (
        <section className="mp-section mp-section-alt">
          <div className="mp-section-header">
            <h2>Food for Students</h2>
            <p>Affordable meals from providers around the student community.</p>
          </div>
          <HorizontalScroller>
            {filteredFood.map((item, idx) => (
              <Link
                key={idx}
                to={item.profileUrl}
                className="mp-food-card"
              >
                <div className="mp-food-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="mp-food-info">
                  <h4>{item.name}</h4>
                  <span className="mp-food-price">{item.price}</span>
                  <span className="mp-food-provider">{item.provider}</span>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        </section>
      )}

      {/* ═══════════ SERVICES AROUND YOU ═══════════ */}
      <section className="mp-section">
        <div className="mp-section-header">
          <h2>Services Around You</h2>
        </div>
        <div className="mp-services-scroller">
          {servicesList.map((service) => (
            <button
              key={service.id}
              className="mp-service-chip"
              onClick={() => setActiveCategory(service.id)}
            >
              <span className="mp-service-icon">{service.icon}</span>
              <span className="mp-service-label">{service.label}</span>
              {service.hasProviders && <span className="mp-service-dot" />}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURED PROVIDER ═══════════ */}
      {featuredProvider && (
        <section className="mp-section mp-featured">
          <div className="mp-featured-grid">
            <div className="mp-featured-image">
              {featuredProvider.image ? (
                <img
                  src={featuredProvider.image}
                  alt={featuredProvider.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="mp-featured-placeholder">
                  {featuredProvider.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mp-featured-info">
              <span className="mp-featured-badge">Featured Provider</span>
              <h2>{featuredProvider.name}</h2>
              <p className="mp-featured-category">{featuredProvider.category}</p>
              <p className="mp-featured-detail">
                🎓 {featuredProvider.status} • {featuredProvider.course}
              </p>
              <p className="mp-featured-detail">📍 {featuredProvider.location}</p>
              <Link to={featuredProvider.profileUrl} className="mp-btn">
                View Full Profile →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ TRUST SECTION ═══════════ */}
      <section className="mp-section mp-trust">
        <h2>Know who you're dealing with.</h2>
        <p>LeSAH helps students discover the people behind the businesses they use.</p>
        <div className="mp-trust-items">
          {featuredProviders.slice(0, 1).map((p) => (
            <Link key={p.id} to={p.profileUrl} className="mp-trust-card">
              <span className="mp-trust-icon">🎓</span>
              <strong>{p.name}</strong>
              <span>{p.status}</span>
              <span>{p.course}</span>
              <span>📍 {p.location}</span>
              <span className="mp-trust-link">Learn More →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ PROVIDER CTA ═══════════ */}
      <section className="mp-section mp-cta">
        <h2>Do you have a business?</h2>
        <p>
          Turn your skills, products or services into an opportunity to reach students
          across Lesotho.
        </p>
        <button className="mp-btn mp-btn-large" onClick={becomeVendor}>
          List Your Business →
        </button>
      </section>
    </div>
  );
}

export default Marketplace;