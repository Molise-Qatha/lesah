// src/pages/Eats.js
import React from 'react';
import './Eats.css';

const WHATSAPP_NUMBER = '26656613551';

const regularPizzas = [
  { name: 'BBQ Chicken', price: 'M60' },
  { name: 'Uni Special', price: 'M60' },
  { name: 'Margherita', price: 'M65' },
  { name: 'Chicken & Mushroom', price: 'M70' },
  { name: 'Meat Feast', price: 'M75' },
];

const mediumPizzas = [
  { name: 'BBQ Chicken', price: 'M75' },
  { name: 'Uni Special', price: 'M70' },
  { name: 'Margherita', price: 'M80' },
  { name: 'Chicken & Mushroom', price: 'M80' },
  { name: 'Meat Feast', price: 'M85' },
];

const flavours = [
  'BBQ Chicken',
  'Uni Special',
  'Margherita',
  'Chicken & Mushroom',
  'Meat Feast',
];

function Eats() {
  const openWhatsApp = () => {
    const message = `Hi LeSAH, I'd like to order from Pizza Hub.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="eats-page">
      <div className="eats-container">
        {/* Hero */}
        <div className="eats-hero">
          <h1>🍕 LeSAH Eats</h1>
          <p>Order food from trusted local vendors around campus.</p>
          <button className="order-now-btn" onClick={openWhatsApp}>
            Order Now
          </button>
        </div>

        {/* Vendor Card */}
        <div className="vendor-card">
          <div className="vendor-header">
            <div className="vendor-badges">
              <span className="badge verified">✅ Verified Vendor</span>
              <span className="badge student">🎓 Student Friendly</span>
              <span className="badge delivery">🛵 Delivery Available</span>
            </div>
            <h2>Pizza Hub</h2>
            <p className="vendor-location">📍 Mafikeng</p>
            <p className="vendor-delivery">Delivery fee: M5</p>
          </div>

          <div className="pizza-flavours">
            <h3>🍕 Pizza Flavours</h3>
            <div className="flavour-tags">
              {flavours.map((f, i) => (
                <span key={i} className="flavour-tag">{f}</span>
              ))}
            </div>
          </div>

          <div className="pricing-tables">
            <div className="pricing-table">
              <h4>Regular Pizza</h4>
              {regularPizzas.map((p, i) => (
                <div key={i} className="menu-row">
                  <span>{p.name}</span>
                  <span>{p.price}</span>
                </div>
              ))}
            </div>
            <div className="pricing-table">
              <h4>Medium Pizza</h4>
              {mediumPizzas.map((p, i) => (
                <div key={i} className="menu-row">
                  <span>{p.name}</span>
                  <span>{p.price}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="whatsapp-btn" onClick={openWhatsApp}>
            🟢 Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default Eats;