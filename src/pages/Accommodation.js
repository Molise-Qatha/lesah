import React, { useState } from 'react';
import './Accommodation.css';
import accommodationHeroBg from '../assets/images/accommodation-hero-bg.jpg';

// ------------------------------------------------------------
// Residence data – all listings
// ------------------------------------------------------------
const residences = [
  {
    id: 1,
    name: "Mahone Residence",
    village: "Thoteng",
    area: "Roma",
    amount: null,
    amenities: "No ceiling (assumed), security (gate)",
    internalNote: "I need him for the functioning of this business.",
    contactHidden: "56429005",
    coordinates: { lat: -29.438410, lng: 27.716728 },
    images: null,
  },
  {
    id: 2,
    name: "Zwagala Residence",
    village: "Thoteng",
    area: "Roma",
    amount: 450,
    amenities: "No ceiling",
    internalNote: "I think everything is kinda okay here.",
    contactHidden: "57345827",
    coordinates: { lat: -29.442743, lng: 27.709948 },
    images: null,
  },
  {
    id: 3,
    name: "'Memmafumane Residence",
    village: "Thoteng",
    area: "Roma",
    amount: 350,
    amenities: "No ceiling, good security, landlord lives on site",
    internalNote: "Ohh she is perfect",
    contactHidden: "63231600",
    coordinates: { lat: -29.442060, lng: 27.713597 },
    images: null,
  },
  {
    id: 4,
    name: "Molise Residence",
    village: "Thoteng",
    area: "Roma",
    amount: null,
    amenities: "No ceiling",
    internalNote: "Well I have to call the landlord.",
    contactHidden: "63232954",
    coordinates: null,
    images: null,
  },
  {
    id: 5,
    name: "'Maphakiso Residence",
    village: "Thoteng",
    area: "Roma",
    amount: null,
    amenities: "No ceiling, good security, landlord lives on site",
    internalNote: "We are mostly good, need to ask for amount.",
    contactHidden: "57528555",
    coordinates: { lat: -29.440149, lng: 27.710882 },
    images: null,
  },
  {
    id: 6,
    name: "Neo Tsatsi Residence",
    village: "Thoteng",
    area: "Thoteng (pela toreng)",
    amount: 450,
    amenities: "No ceiling, landlord lives in yard",
    internalNote: null,
    contactHidden: null,
    coordinates: null,
    images: null,
  },
  {
    id: 7,
    name: "Phama Residence",
    village: "Hata-Butle",
    area: "Hata-Butle",
    amount: 500,
    amenities: "Some with ceiling, some without. Security available.",
    internalNote: null,
    contactHidden: null,
    coordinates: null,
    images: null,
  },
  {
    id: 8,
    name: "Squireng Residence",
    village: "Hata-Butle",
    area: "Hata-Butle",
    amount: null,
    amenities: "Ceiling, prices M400 (shared electricity), M450, M500",
    internalNote: null,
    contactHidden: null,
    coordinates: null,
    images: [
      '/images/accommodation/squireng_exterior.jpg',
      '/images/accommodation/squireng_interior.jpg',
    ],
  },
];

// NUL main campus (Roma) coordinates
const NUL_CAMPUS = { lat: -29.4422, lng: 27.7148 };

// Haversine distance in km
const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(coord1.lat * Math.PI / 180) *
      Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper to generate image path from residence name
const getImagePath = (name) => {
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const shortMap = {
    "mahoneresidence": "mahone",
    "zwagalaresidence": "zwagala",
    "memmafumaneresidence": "memmafumane",
    "moliseresidence": "molise",
    "maphakisoresidence": "maphakiso",
    "neotsatsiresidence": "neotsatsi",
    "phamaresidence": "phama",
    "squirengresidence": "squireng",
  };
  if (shortMap[slug]) slug = shortMap[slug];
  return `/images/accommodation/${slug}.jpg`;
};

// Unique villages for filter
const villages = [...new Set(residences.map(r => r.village))];

const WHATSAPP_LINK = "https://wa.me/26656613551";
const BOOKING_FEE = 60;

function Accommodation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const filteredResidences = residences.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage = selectedVillage === "all" || r.village === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  // WhatsApp message for a specific residence (student looking to book)
  const openWhatsApp = (residenceName, price, village, area) => {
    const priceText = price ? `M${price}/month` : 'price on request';
    const message = `Hello LeSAH, I'm interested in "${residenceName}" in ${village}, ${area} (${priceText}). I understand there is a M${BOOKING_FEE} booking fee. Could you help me get in touch with the landlord?`;
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // WhatsApp message for "Request a Closer Residence"
  const requestCloserResidence = () => {
    const message = `Hello LeSAH, I'm looking for a residence closer to the university that isn't listed on the app. I understand there is a M${BOOKING_FEE} booking fee once you find one. Could you help me? I'm willing to wait up to a day.`;
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // WhatsApp message for landlords who want to list their residence
  const listYourResidence = () => {
    const message = `Hello LeSAH, I'd like to list my residence on the app. I can provide interior & exterior images, whether there's a ceiling, whether electricity is shared, and the rent amount. Please guide me through the listing process.`;
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getImages = (res) => {
    if (res.images && res.images.length > 0) return res.images;
    return [getImagePath(res.name)];
  };

  return (
    <div className="accommodation-page">
      <div className="accommodation-container">
        {/* Hero Section */}
        <div
          className="accommodation-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(42, 157, 143, 0.85), rgba(38, 70, 83, 0.85)), url(${accommodationHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="hero-icon">🏠</div>
          <h1>Find Your Perfect Student Home</h1>
          <p>We connect you with trusted residences near your campus</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>📍 Village</label>
            <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)}>
              <option value="all">All Villages</option>
              {villages.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="filter-group" style={{ flex: 2 }}>
            <label>🔍 Search by residence name</label>
            <input
              type="text"
              placeholder="e.g., Mahone, Zwagala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div className="results-count">
          Found <strong>{filteredResidences.length}</strong> residence{filteredResidences.length !== 1 ? 's' : ''}
        </div>

        {/* Residence Cards */}
        <div className="accommodation-grid">
          {filteredResidences.map(res => {
            const imageFailed = imageErrors[res.id];
            const distance = res.coordinates
              ? haversineDistance(res.coordinates, NUL_CAMPUS).toFixed(1)
              : null;
            const images = getImages(res);
            const currentIdx = currentImageIndex[res.id] || 0;

            const goToImage = (idx) => {
              setCurrentImageIndex(prev => ({ ...prev, [res.id]: idx }));
            };

            return (
              <div key={res.id} className="accommodation-card">
                <div className="card-image">
                  {!imageFailed ? (
                    <img
                      src={images[currentIdx]}
                      alt={res.name}
                      className="property-image"
                      onError={() => handleImageError(res.id)}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span className="placeholder-icon">🏠</span>
                      <span className="placeholder-text">Photo coming soon</span>
                    </div>
                  )}
                  {images.length > 1 && !imageFailed && (
                    <div className="image-dots">
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`dot ${idx === currentIdx ? 'active' : ''}`}
                          onClick={() => goToImage(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{res.name}</h3>
                  </div>
                  <p className="location">
                    📍 {res.village}, {res.area}
                  </p>
                  {distance ? (
                    <p className="distance">
                      🚶 {distance} km from NUL campus
                    </p>
                  ) : (
                    <p className="distance" style={{ opacity: 0.5 }}>
                      🚶 Distance unknown – coming soon
                    </p>
                  )}
                  <p className="price">
                    {res.amount ? `M${res.amount}/month` : 'Price on request – contact us'}
                  </p>
                  <div className="booking-fee-badge">
                    💰 Booking fee: M{BOOKING_FEE} (non‑refundable)
                  </div>
                  <div className="amenities">
                    <span className="amenity-tag">🔧 {res.amenities}</span>
                  </div>
                  <button
                    className="book-btn whatsapp-btn"
                    onClick={() => openWhatsApp(res.name, res.amount, res.village, res.area)}
                  >
                    💬 Chat with us on WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Request a Closer Residence Button */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            className="book-btn whatsapp-btn"
            onClick={requestCloserResidence}
            style={{ backgroundColor: '#25D366', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            🔍 Don't see what you want? Request a closer residence
          </button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            We'll find you a residence near campus within a day. A M{BOOKING_FEE} booking fee applies once we connect you.
          </p>
        </div>

        {/* Landlords – List Your Residence Button */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            className="book-btn whatsapp-btn"
            onClick={listYourResidence}
            style={{ backgroundColor: '#128C7E', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            🏡 Landlords – List Your Residence
          </button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Have a property for students? Message us with interior & exterior photos, ceiling info, electricity sharing, and rent.
          </p>
        </div>

        {/* How It Works */}
        <div className="info-section">
          <h3>📋 How It Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Browse Residences</h4>
              <p>See the list of trusted student homes by village.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Click WhatsApp Button</h4>
              <p>Chat with us directly – no forms, no delays.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Pay Booking Fee</h4>
              <p>A non‑refundable M{BOOKING_FEE} booking fee applies.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>We Connect You</h4>
              <p>We'll share landlord details and arrange a visit.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book a room?</h3>
              <p>Click the WhatsApp button on any residence, and we'll guide you. A M{BOOKING_FEE} booking fee is required.</p>
            </div>
            <div className="faq-item">
              <h3>Is the booking fee refundable?</h3>
              <p>No, the M{BOOKING_FEE} fee is non‑refundable as it covers administrative and connection costs.</p>
            </div>
            <div className="faq-item">
              <h3>Can I see properties in other villages?</h3>
              <p>Currently we have listings in Thoteng, Roma, and Hata‑Butle. More villages coming soon!</p>
            </div>
            <div className="faq-item">
              <h3>What if I don't see a suitable residence?</h3>
              <p>Use the "Request a closer residence" button and we'll personally find one for you within a day.</p>
            </div>
            <div className="faq-item">
              <h3>I'm a landlord – how do I list my property?</h3>
              <p>Click the "Landlords – List Your Residence" button and send us the required details via WhatsApp. We'll get back to you promptly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accommodation;