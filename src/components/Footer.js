import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToGame = () => {
    const gameSection = document.getElementById('sz-games');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/student-zone');
      setTimeout(() => {
        const gameSection = document.getElementById('sz-games');
        if (gameSection) {
          gameSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <h3>LeSAH</h3>
            <p>
              Lesotho Students Assistance Hub — connecting students with opportunities,
              services, knowledge and community.
            </p>
          </div>

          {/* Explore */}
          <div className="footer-section">
            <h3>EXPLORE</h3>
            <ul>
              <li><Link to="/marketplace" onClick={scrollToTop}>Marketplace</Link></li>
              <li><Link to="/student-zone" onClick={scrollToTop}>Student Zone</Link></li>
              <li><Link to="/accommodation" onClick={scrollToTop}>Accommodation</Link></li>
              <li><Link to="/provider/maseeiso" onClick={scrollToTop}>Maseeiso Thaanyane</Link></li>
              <li><Link to="/about" onClick={scrollToTop}>About LeSAH</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="footer-section">
            <h3>LEGAL & SUPPORT</h3>
            <ul>
              <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={scrollToTop}>Terms of Use</Link></li>
              <li><Link to="/community-safety" onClick={scrollToTop}>Community & Safety</Link></li>
              <li><Link to="/vendor-guidelines" onClick={scrollToTop}>Vendor Guidelines</Link></li>
            </ul>
          </div>

          {/* Student Zone CTA */}
          <div className="footer-section">
            <h3>STUDENT ZONE</h3>
            <p>Play Basotho games like Ho Kalla, Lilotho and Morabaraba.</p>
            <button onClick={scrollToGame} className="game-link-btn">
              Play Games →
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 LeSAH — Lesotho Students Assistance Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;