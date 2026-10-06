import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { featuredProviders } from '../data/marketplaceData';
import { products, productCategories, formatPrice } from '../data/products';
import './Marketplace.css';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter + sort products
  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'rating':
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'newest':
      default:
        list = [...list].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
    return list;
  }, [searchTerm, activeCategory, sortBy]);

  // Top vendors for sidebar
  const sidebarVendors = useMemo(
    () =>
      [...featuredProviders]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5),
    []
  );

  const becomeVendor = () => {
    window.open(
      `https://wa.me/26656613551?text=${encodeURIComponent(
        'Hello LeSAH, I want to list my business on the Marketplace.\n\nBusiness Name:\nCategory:\nContact Number:'
      )}`,
      '_blank'
    );
  };

  return (
    <div className="mp-page">
      {/* ═══════════ HERO BANNER ═══════════ */}
      <section
        className="mp-hero-banner"
        style={{ backgroundImage: "url('/assets/images/marketplace-hero.jpg')" }}
      >
        <div className="mp-hero-inner">
          <div className="mp-hero-text">
            <h1>LeSAH Marketplace</h1>
            <p>
              Buy and sell products and services from students and local
              businesses. Support each other. Grow together.
            </p>
          </div>
          <div className="mp-hero-tag">
            <span>Students</span>
            <span>supporting</span>
            <span>students</span>
          </div>
        </div>
      </section>

      <div className="mp-container">
        {/* ═══════════ SEARCH + LOCATION ═══════════ */}
        <div className="mp-search-row">
          <div className="mp-search-wrap">
            <span className="mp-search-icon">🔍</span>
            <input
              type="text"
              className="mp-search-input"
              placeholder="Search for products or services (e.g. eggs, hair, laundry...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="mp-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button className="mp-location-btn" type="button">
            <span>📍</span>
            <span>Roma &amp; Surroundings</span>
            <span className="mp-location-caret">▾</span>
          </button>
        </div>

        {/* ═══════════ CATEGORY TILES ═══════════ */}
        <div className="mp-cat-row">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              className={`mp-cat-tile ${
                activeCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="mp-cat-icon">{cat.icon}</span>
              <span className="mp-cat-label">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════ MAIN GRID + SIDEBAR ═══════════ */}
        <div className="mp-layout">
          {/* Main column */}
          <div className="mp-main">
            <div className="mp-list-header">
              <h2>Featured Products &amp; Services</h2>
              <div className="mp-sort">
                <label htmlFor="mp-sort-select">Sort by:</label>
                <select
                  id="mp-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {visibleProducts.length === 0 ? (
              <div className="mp-empty-products">
                <p>No products match your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mp-product-grid">
                {visibleProducts.map((p) => {
                  const vendor = featuredProviders.find(
                    (v) => v.id === p.vendorId
                  );
                  return (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="mp-product-card"
                    >
                      <div className="mp-product-image">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        {p.verified && (
                          <span className="mp-verified-badge">
                            ✓ LeSAH Verified
                          </span>
                        )}
                      </div>

                      <div className="mp-product-body">
                        <h3 className="mp-product-name">{p.name}</h3>
                        <p className="mp-product-price">{formatPrice(p)}</p>

                        {vendor && (
                          <div className="mp-product-vendor">
                            <img
                              src={vendor.image}
                              alt={vendor.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="mp-product-vendor-info">
                              <span className="mp-product-vendor-name">
                                {vendor.name}
                              </span>
                              <span className="mp-product-vendor-cat">
                                {vendor.category}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="mp-product-meta">
                          <span className="mp-rating">
                            ⭐ {p.rating} ({p.reviews})
                          </span>
                          <span className="mp-location">📍 {p.location}</span>
                        </div>

                        <button
                          className="mp-order-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/product/${p.id}`;
                          }}
                        >
                          🛒 Order Now
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mp-sidebar">
            {/* Featured Vendors */}
            <div className="mp-sidebar-card">
              <div className="mp-sidebar-header">
                <span className="mp-sidebar-icon">👥</span>
                <h3>Featured Vendors</h3>
              </div>
              <ul className="mp-vendor-list">
                {sidebarVendors.map((v) => (
                  <li key={v.id}>
                    <Link to={v.profileUrl} className="mp-vendor-item">
                      <img
                        src={v.image}
                        alt={v.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="mp-vendor-text">
                        <span className="mp-vendor-name">{v.name}</span>
                        <span className="mp-vendor-cat">{v.category}</span>
                        <span className="mp-vendor-rating">
                          ⭐ {v.rating} ({v.reviews})
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support local */}
            <div className="mp-sidebar-card mp-sidebar-support">
              <div className="mp-sidebar-header">
                <span className="mp-sidebar-icon">🤝</span>
                <h3>Support Local Students</h3>
              </div>
              <p>
                Every purchase helps a fellow student or local business. Together
                we build a stronger community.
              </p>
              <div className="mp-support-tag">
                <span>Small choices.</span>
                <span>Big impact.</span>
              </div>
            </div>

            {/* Verified note */}
            <div className="mp-sidebar-card mp-sidebar-verified">
              <div className="mp-sidebar-header">
                <span className="mp-sidebar-icon">🛡️</span>
                <h3>All items are verified by LeSAH</h3>
              </div>
              <p>We review every listing to ensure quality and trust.</p>
            </div>

            {/* CTA */}
            <button className="mp-sidebar-cta" onClick={becomeVendor}>
              <span className="mp-sidebar-cta-plus">+</span>
              <span>
                <strong>Share Your Products / Services</strong>
                <em>Be part of the marketplace. Grow your business.</em>
              </span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;