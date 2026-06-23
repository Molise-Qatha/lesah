import React from 'react';
import './Eats.css';

const WHATSAPP_NUMBER = '26656613551';

const pizzaMenu = [
  { size: 'Small Pizza', price: 'M40' },
  { size: 'Medium Pizza', price: 'M70' },
  { size: 'Large Pizza', price: 'M100' },
];

function Eats() {
  const openWhatsApp = () => {
    const message = `Hi LeSAH, I'd like to order from Campus Pizza.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="eats-page">
      <div className="eats-container">
        <div className="eats-hero">
          <h1>🍕 LeSAH Eats</h1>
          <p>Order food from local student‑friendly vendors.</p>
        </div>

        <div className="featured-vendor">
          <div className="vendor-card">
            <div className="vendor-image">
              <span className="vendor-icon">🍕</span>
            </div>
            <h2>Campus Pizza</h2>
            <div className="pizza-menu">
              {pizzaMenu.map((item, idx) => (
                <div key={idx} className="menu-item">
                  <span className="item-name">{item.size}</span>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
            <button className="whatsapp-btn" onClick={openWhatsApp}>
              🟢 Order on WhatsApp
            </button>
          </div>
        </div>

        <p className="coming-soon-text">More food vendors coming soon.</p>
      </div>
    </div>
  );
}

export default Eats;