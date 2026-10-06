import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { featuredProviders, foodItems, categories } from '../data/marketplaceData';
import { services } from '../data/services';
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
      <section
        className="mp-hero"
        style={{ backgroundImage: "url('/assets/images/marketplace-hero.jpg')" }}
      >
        <div className="mp-hero-content">
          <h1>What do you need today?</h1>
          <p>Services built around student life in Lesotho — delivered by real people you can trust.</p>

          {/* Search */}
          <div className="mp-search-wrapper">
            <span className="mp-search-icon">🔍</span>
            <input
              type="text"
              className="mp-search-input"
              placeholder="Search for food, laundry, eggs, hair, tutoring and more..."
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

      {/* ═══════════ BROWSE SERVICES (primary layer) ═══════════ */}
      <section className="mp-section">
        <div className="mp-section-header">
          <h2>Browse Services</h2>
          <p>Pick what you need — we&apos;ll show you who can deliver it.</p>
        </div>

        <div className="mp-services-grid">
          {services.map((service) => {
            const hasProviders = service.providerIds.length > 0;
            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className={`mp-service-tile ${!hasProviders ? 'mp-service-tile--empty' : ''}`}
              >
                <span className="mp-service-tile-icon">{service.icon}</span>
                <h3 className="mp-service-tile-name">{service.name}</h3>
                <p className="mp-service-tile-tagline">{service.tagline}</p>
                <span className="mp-service-tile-count">
                  {hasProviders
                    ? `${service.providerIds.length} ${service.providerIds.length === 1 ? 'provider' : 'providers'}`
                    : 'Coming soon'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════ THE PEOPLE (secondary layer) ═══════════ */}
      <section className="mp-section mp-section-alt">
        <div className="mp-section-header">
          <h2>Meet the People Behind LeSAH</h2>
          <p>Every service on LeSAH comes from a real person in our community. Here are some of them.</p>
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
                    <span className="mp-business-link">View Profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        ) : (
          <div className="mp-empty">
            <p>No providers match your search.</p>
            <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ FOOD DISCOVERY ═══════════ */}
      {(activeCategory === 'all' || activeCategory === 'food') && filteredFood.length > 0 && (
        <section className="mp-section">
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
                {featuredProvider.statusIcon || '🎓'} {featuredProvider.status}
                {featuredProvider.course ? ` • ${featuredProvider.course}` : ''}
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
        <h2>Know who you&apos;re dealing with.</h2>
        <p>LeSAH helps students discover the people behind the services they use.</p>
        <div className="mp-trust-items">
          {featuredProviders.slice(0, 3).map((p) => (
            <Link key={p.id} to={p.profileUrl} className="mp-trust-card">
              <span className="mp-trust-icon">{p.statusIcon || '🎓'}</span>
              <strong>{p.name}</strong>
              <span>{p.status}</span>
              {p.course && <span>{p.course}</span>}
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