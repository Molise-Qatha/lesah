import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// Import background images
import nulCampus from '../assets/images/nul-campus.jpg';
import heroAccommodation from '../assets/images/hero-accommodation.jpg';
import heroEats from '../assets/images/hero-eats.jpg';
import heroTech from '../assets/images/hero-tech.jpg';
import heroDelivery from '../assets/images/hero-delivery.jpg';

const slides = [
  {
    image: nulCampus,
    title: 'Your all‑in‑one student support platform',
    headline: 'Everything students need — in one place.',
    subtitle: 'Find accommodation, student loans, and delivery services across Lesotho — fast, simple, and reliable.',
    buttonText: 'Explore Services',
    link: null,                // scroll to services section
    linkType: 'scroll',
  },
  {
    image: heroAccommodation,
    headline: '🏠 Find Your Perfect Student Home',
    subtitle: 'Browse verified listings near your campus.',
    buttonText: 'Explore Listings',
    link: '/accommodation',
    linkType: 'page',
  },
  {
    image: heroEats,
    headline: '🍕 Delicious Food, Delivered',
    subtitle: 'Order from student‑friendly vendors around campus.',
    buttonText: 'Order Now',
    link: '/eats',
    linkType: 'page',
  },
  {
    image: heroTech,
    headline: '💻 Tech Support for Students',
    subtitle: 'Repair, buy, or upgrade your devices with trusted partners.',
    buttonText: 'Get Support',
    link: '/tech',
    linkType: 'page',
  },
  {
    image: heroDelivery,
    headline: '🚚 Fast & Reliable Delivery',
    subtitle: 'Moving your stuff? We’ve got drivers ready to help.',
    buttonText: 'Request Delivery',
    link: '/delivery',
    linkType: 'page',
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Automatic cycling every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[current];

  const scrollToServices = () => {
    const section = document.getElementById('services-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // Render button based on slide
  const renderButton = () => {
    const btnStyle = 'hero-refined-cta';

    if (currentSlide.linkType === 'scroll') {
      return (
        <button onClick={scrollToServices} className={btnStyle}>
          {currentSlide.buttonText}
        </button>
      );
    }

    return (
      <Link to={currentSlide.link} className={btnStyle}>
        {currentSlide.buttonText}
      </Link>
    );
  };

  return (
    <section
      className="hero-refined hero-carousel"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${currentSlide.image})`,
      }}
    >
      <div className="hero-refined-grid">
        <div className="hero-refined-text">
          <p className="hero-refined-label">{currentSlide.title || 'Your all‑in‑one student support platform'}</p>
          <h1 className="hero-refined-headline">{currentSlide.headline}</h1>
          <p className="hero-refined-subtitle">{currentSlide.subtitle}</p>

          <div className="hero-refined-trust">
            <span>🏠 Accommodation</span>
            <span>💰 Student Loans</span>
            <span>🚚 Delivery</span>
          </div>

          <div className="hero-refined-action">
            {renderButton()}
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

        {/* Navigation dots for manual control */}
        <div className="hero-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === current ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
