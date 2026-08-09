import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// Import background images
import nulCampus from '../assets/images/nul-campus.jpg';
import heroMarketplace from '../assets/images/hero-accommodation.jpg';  // reuse until you have marketplace image
import heroStudentZone from '../assets/images/hero-eats.jpg';           // reuse

const slides = [
  {
    image: nulCampus,
    headline: 'Everything a Student Needs — One Marketplace',
    subtitle: 'Accommodation, food, delivery, tutoring, tech, and more. All from trusted vendors near your campus.',
    buttonText: 'Explore Marketplace',
    link: '/marketplace',
    linkType: 'page',
  },
  {
    image: heroMarketplace,
    headline: '🏠 Find Student Accommodation',
    subtitle: 'Verified listings near NUL — now part of our marketplace.',
    buttonText: 'Browse Accommodation',
    link: '/accommodation',
    linkType: 'page',
  },
  {
    image: heroStudentZone,
    headline: '🎮 Games, Puzzles & More',
    subtitle: 'Take a break with Basotho games like Ho Kalla and Morabaraba.',
    buttonText: 'Visit Student Zone',
    link: '/student-zone',
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

  const renderButton = () => {
    if (currentSlide.linkType === 'scroll') {
      return (
        <button onClick={() => {
          const section = document.getElementById('services-section');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }} className="hero-refined-cta">
          {currentSlide.buttonText}
        </button>
      );
    }

    return (
      <Link to={currentSlide.link} className="hero-refined-cta">
        {currentSlide.buttonText}
      </Link>
    );
  };

  return (
    <section
      className="hero-refined hero-carousel"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentSlide.image})`,
      }}
    >
      <div className="hero-refined-grid">
        <div className="hero-refined-text">
          <p className="hero-refined-label">
            Lesotho's Student Marketplace
          </p>
          <h1 className="hero-refined-headline">{currentSlide.headline}</h1>
          <p className="hero-refined-subtitle">{currentSlide.subtitle}</p>

          {/* Updated service badges — now marketplace categories */}
          <div className="hero-refined-trust">
            <span>🏠 Accommodation</span>
            <span>🍔 Food & Eats</span>
            <span>🚚 Delivery</span>
            <span>💻 Tech</span>
            <span>📚 Textbooks</span>
            <span>💇 Beauty</span>
            <span>🎓 Tutoring</span>
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

          {/* Become a vendor CTA */}
          <div className="hero-student-zone-cta">
            <p>🛒 Got a service to offer?</p>
            <a
              href="https://wa.me/26656613551?text=Hello%20LeSAH%2C%20I%20want%20to%20become%20a%20vendor%20on%20the%20marketplace."
              target="_blank"
              rel="noopener noreferrer"
              className="hero-refined-cta"
              style={{ background: '#e9c46a', color: '#111827' }}
            >
              Become a Vendor
            </a>
          </div>
        </div>

        {/* Navigation dots */}
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