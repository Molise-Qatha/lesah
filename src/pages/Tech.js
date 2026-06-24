// src/pages/Tech.js
import React from 'react';
import './Tech.css';

const PHONE_NUMBER = '+266 56613551';
const WHATSAPP_NUMBER = '26656613551';

const hardwareServices = [
  'Laptop Sales',
  'Desktop Sales',
  'Laptop Chargers',
  'SSD Sales',
  'Screen Replacement',
  'Hinge Repairs',
];

const softwareServices = [
  'Windows Installation',
  'Software Installation',
  'Operating System Upgrades',
  'Software Upgrades',
];

const supportServices = [
  'Phone Setup',
  'Printer Setup',
];

function Tech() {
  const openWhatsApp = () => {
    const message = `Hi LeSAH, I need tech support.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const callNumber = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <div className="tech-page">
      <div className="tech-container">
        <div className="tech-hero">
          <h1>💻 LeSAH Tech</h1>
          <p>Reliable student technology support.</p>
        </div>

        <div className="services-section">
          <div className="services-category">
            <h3>🔧 Hardware Services</h3>
            <div className="services-grid">
              {hardwareServices.map((s, i) => (
                <div key={i} className="service-card">{s}</div>
              ))}
            </div>
          </div>

          <div className="services-category">
            <h3>💾 Software Services</h3>
            <div className="services-grid">
              {softwareServices.map((s, i) => (
                <div key={i} className="service-card">{s}</div>
              ))}
            </div>
          </div>

          <div className="services-category">
            <h3>📞 Support Services</h3>
            <div className="services-grid">
              {supportServices.map((s, i) => (
                <div key={i} className="service-card">{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="partner-card">
          <div className="partner-badges">
            <span className="badge verified">✅ Verified Partner</span>
            <span className="badge fast">⚡ Fast Turnaround</span>
            <span className="badge student">🎓 Student Friendly</span>
          </div>
          <div className="partner-info">
            <div className="partner-avatar">👨🏾‍💻</div>
            <h2>LeSAH Tech Partner</h2>
          </div>
          <div className="partner-actions">
            <button className="whatsapp-btn" onClick={openWhatsApp}>
              🟢 WhatsApp
            </button>
            <button className="call-btn" onClick={callNumber}>
              📞 Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tech;