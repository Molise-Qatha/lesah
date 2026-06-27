import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// --- Import all hero images ---
import nulCampus from '../assets/images/nul-campus.jpg';
import heroAccommodation from '../assets/images/hero-accommodation.jpg';
import heroEats from '../assets/images/hero-eats.jpg';
import heroTech from '../assets/images/hero-tech.jpg';
import heroDelivery from '../assets/images/hero-delivery.jpg';

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const scrollToServices = () => {
    const section = document.getElementById('services-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-refined">
      <div className="hero-refined-grid">
        {/* ---- LEFT TEXT (unchanged) ---- */}
        <div className="hero-refined-text">
          <p className="hero-refined-label">Your all‑in‑one student support platform</p>
          <h1 className="hero-refined-headline">
            Everything students need — in one place.
          </h1>
          <p className="hero-refined-subtitle">
            Find accommodation, student loans, and delivery services across Lesotho — fast, simple, and reliable.
          </p>

          <div className="hero-refined-trust">
            <span>🏠 Accommodation</span>
            <span>💰 Student Loans</span>
            <span>🚚 Delivery</span>
          </div>

          <div className="hero-refined-action">
            {isLoggedIn ? (
              <button onClick={scrollToServices} className="hero-refined-cta">
                Explore Services
              </button>
            ) : (
              <Link to="/register" className="hero-refined-cta">
                Get Started (Register First)
              </Link>
            )}
            <a
              href="https://wa.me/26656613551"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          <p className="hero-refined-note">Free account required to submit requests.</p>
        </div>

        {/* ---- RIGHT COLLAGE ---- */}
        <div className="hero-collage">
          {/* Main campus image */}
          <div className="hero-main-image">
            <img src={nulCampus} alt="NUL Campus" />
          </div>

          {/* Service thumbnails grid */}
          <div className="hero-thumb-grid">
            <div className="hero-thumb">
              <img src={heroAccommodation} alt="Accommodation" />
              <span>🏠 Accommodation</span>
            </div>
            <div className="hero-thumb">
              <img src={heroEats} alt="LeSAH Eats" />
              <span>🍕 LeSAH Eats</span>
            </div>
            <div className="hero-thumb">
              <img src={heroTech} alt="LeSAH Tech" />
              <span>💻 LeSAH Tech</span>
            </div>
            <div className="hero-thumb">
              <img src={heroDelivery} alt="Delivery" />
              <span>🚚 Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
