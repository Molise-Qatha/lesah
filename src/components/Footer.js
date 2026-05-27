import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToGame = () => {
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const gameSection = document.getElementById('game-section');
        if (gameSection) {
          gameSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>LeSAH</h3>
            <p>
              LeSAH‑Academic Luminary is dedicated to simplifying the student experience
              through innovative digital solutions and traditional mentorship.
            </p>
          </div>

          <div className="footer-section">
            <h3>SERVICES</h3>
            <ul>
              <li><Link to="/accommodation" onClick={scrollToTop}>Accommodation</Link></li>
              <li><Link to="/loans" onClick={scrollToTop}>Student Loans</Link></li>
              <li><Link to="/delivery" onClick={scrollToTop}>Asset Delivery</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>QUICK LINKS</h3>
            <ul>
              <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
              <li><Link to="/learn-more" onClick={scrollToTop}>About Us</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={scrollToTop}>Terms of Service</Link></li>
              <li><Link to="/support" onClick={scrollToTop}>Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>THE GAME</h3>
            <p>Join our weekly Lilotho challenge and win prizes for your student profile.</p>
            <button onClick={scrollToGame} className="game-link-btn">
              Play Lilotho →
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 LeSAH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;