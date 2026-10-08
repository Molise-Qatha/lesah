import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { featuredProviders } from '../data/marketplaceData';
import { getProductById, products, formatPrice } from '../data/products';
import './ProductPage.css';

function ProductPage() {
  const { productId } = useParams();
  const product = getProductById(productId);

  // Build the gallery: prefer `images[]` if present, else fall back to `image`
  const gallery = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);

  // Reset thumbnail selection whenever the product changes
  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  // Clamp in case the active index is out of range (belt + braces)
  const safeActive = activeImage < gallery.length ? activeImage : 0;

  if (!product) {
    return (
      <div className="pp-page">
        <div className="pp-not-found">
          <h1>Product not found</h1>
          <p>
            No product matches &quot;<code>{productId}</code>&quot;.
          </p>
          <Link to="/marketplace" className="pp-back-cta">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const vendor = product.vendorId
    ? featuredProviders.find((v) => v.id === product.vendorId)
    : null;

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.vendorId === product.vendorId ||
          p.category === product.category)
    )
    .slice(0, 3);

  const handleOrder = () => {
    if (!vendor) return;

    if (vendor.id === 'easylearn') {
      window.open('https://easylearn.co.ls', '_blank', 'noopener,noreferrer');
      return;
    }

    const wa = {
      maseeiso: '26656208144',
      pontso: '26651439005',
      thapelo: '26662572519',
      rorisang: '26663048401',
    }[vendor.id];

    if (!wa) return;
    const msg =
      product.orderMessage ||
      `Hello ${vendor.name}, I found ${product.name} on LeSAH and would like to order.`;
    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const ctaLabel =
    vendor?.id === 'easylearn' ? '🌐 Visit Website' : '🛒 Order Now';

  const hasGallery = gallery.length > 0;
  const hasMultiple = gallery.length > 1;

  return (
    <div className="pp-page">
      <div className="pp-container">
        <Link to="/marketplace" className="pp-back">
          ← Back to Marketplace
        </Link>

        <div className="pp-layout">
          <div className="pp-image">
            {hasGallery ? (
              <>
                <img
                  src={gallery[safeActive]}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {hasMultiple && (
                  <div className="pp-thumbs" role="tablist">
                    {gallery.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        role="tab"
                        aria-selected={i === safeActive}
                        className={`pp-thumb ${
                          i === safeActive ? 'active' : ''
                        }`}
                        onClick={() => setActiveImage(i)}
                        aria-label={`View image ${i + 1} of ${gallery.length}`}
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="pp-icon-fallback">
                <span>{product.icon || '📦'}</span>
              </div>
            )}
            {product.verified && (
              <span className="pp-verified">✓ LeSAH Verified</span>
            )}
          </div>

          <div className="pp-info">
            <h1 className="pp-title">{product.name}</h1>

            <p className="pp-price">{formatPrice(product)}</p>

            <div className="pp-meta">
              <span className="pp-location">📍 {product.location}</span>
              {hasMultiple && (
                <span className="pp-photo-count">
                  🖼️ {gallery.length} photos
                </span>
              )}
            </div>

            {vendor && (
              <Link to={vendor.profileUrl} className="pp-vendor-card">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <span className="pp-vendor-name">{vendor.name}</span>
                  <span className="pp-vendor-cat">{vendor.category}</span>
                  <span className="pp-vendor-detail">
                    {vendor.statusIcon || '🎓'} {vendor.status}
                    {vendor.course ? ` • ${vendor.course}` : ''}
                  </span>
                </div>
              </Link>
            )}

            <button className="pp-order-btn" onClick={handleOrder}>
              {ctaLabel}
            </button>

            <div className="pp-info-note">
              🛡️ All items are reviewed by LeSAH before listing.
            </div>
          </div>
        </div>

        <section className="pp-reviews">
          <h2>Reviews</h2>
          <div className="pp-reviews-empty">
            <p>
              No reviews yet. Reviews from real customers will appear here once
              the feature launches.
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pp-related">
            <h2>You may also like</h2>
            <div className="pp-related-grid">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/product/${r.id}`}
                  className="pp-related-card"
                >
                  <div className="pp-related-image">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="pp-icon-fallback pp-icon-fallback--small">
                        <span>{r.icon || '📦'}</span>
                      </div>
                    )}
                  </div>
                  <div className="pp-related-body">
                    <h3>{r.name}</h3>
                    <p>{formatPrice(r)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductPage;