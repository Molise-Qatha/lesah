import React from 'react';
import './Tech.css';

const PHONE_NUMBER = '+266 56613551';
const WHATSAPP_NUMBER = '26656613551';

const services = [
  '🔧 Laptop Repair',
  '🪟 Windows Installation',
  '📱 Phone Setup',
  '💾 Software Installation',
  '💻 Buy Laptops',
  '🖨 Printer Setup',
];

function Tech() {
  const openWhatsApp = () => {
    const message = `Hi LeSAH, I need tech support.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const callNumber = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <div className="tech-page">
      <div className="tech-container">
        <div className="tech-hero">
          <h1>💻 LeSAH Tech</h1>
          <p>Buy, repair and upgrade your devices.</p>
        </div>

        <div className="services-list">
          {services.map((service, idx) => (
            <div key={idx} className="service-item">
              {service}
            </div>
          ))}
        </div>

        <div className="provider-card">
          <div className="provider-image">
            <span className="provider-icon">👨🏾‍💻</span>
          </div>
          <h2>LeSAH Tech Partner</h2>
          <p>Reliable student IT support.</p>
          <div className="provider-actions">
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