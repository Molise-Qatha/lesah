import React, { useState } from 'react';
import './Accommodation.css';
import accommodationHeroBg from '../assets/images/accommodation-hero-bg.jpg';

// ------------------------------------------------------------------
// Residence data – add more residences from other villages later
// ------------------------------------------------------------------
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
  },
];

// Helper to generate image path from residence name
const getImagePath = (name) => {
  // Convert name to lowercase, remove spaces and special chars
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  // Special cases for names with apostrophes
  if (slug === "memmafumaneresidence") slug = "memmafumane";
  if (slug === "maphakisoresidence") slug = "maphakiso";
  if (slug === "mohoneresidence") slug = "mahone";
  if (slug === "zwagalaresidence") slug = "zwagala";
  if (slug === "moliseresidence") slug = "molise";
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

  const filteredResidences = residences.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage = selectedVillage === "all" || r.village === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  const openWhatsApp = (residenceName, price, village, area) => {
    const priceText = price ? `M${price}/month` : 'price on request';
    const message = `Hello LeSAH, I'm interested in "${residenceName}" in ${village}, ${area} (${priceText}). I understand there is a M${BOOKING_FEE} booking fee. Could you help me get in touch with the landlord?`;
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
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
            const imagePath = getImagePath(res.name);
            const imageFailed = imageErrors[res.id];
            return (
              <div key={res.id} className="accommodation-card">
                <div className="card-image">
                  {!imageFailed ? (
                    <img
                      src={imagePath}
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
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{res.name}</h3>
                  </div>
                  <p className="location">
                    📍 {res.village}, {res.area}
                  </p>
                  <p className="price">
                    {res.amount ? `M${res.amount}/month` : 'Price on request – contact us'}
                  </p>
                  <div className="booking-fee-badge">
                    💰 Booking fee: M{BOOKING_FEE} (non-refundable)
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
              <p>A non-refundable M{BOOKING_FEE} booking fee applies.</p>
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
              <p>No, the M{BOOKING_FEE} fee is non-refundable as it covers administrative and connection costs.</p>
            </div>
            <div className="faq-item">
              <h3>Can I see properties in other villages?</h3>
              <p>Currently we have listings in Thoteng, Roma. More villages coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accommodation;
