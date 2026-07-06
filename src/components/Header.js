import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';   // 👈 Replace with your new logo file

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="LeSAH Logo" className="logo-image" />
            {/* The text is already in the new logo, so we remove the span */}
          </Link>

          <div className="nav-actions">
            {!isHomePage && (
              <button className="back-btn" onClick={handleBack} aria-label="Go back">
                ← Back
              </button>
            )}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/accommodation" onClick={() => setIsMenuOpen(false)}>Accommodation</Link></li>
              <li><Link to="/loans" onClick={() => setIsMenuOpen(false)}>Loans</Link></li>
              <li><Link to="/delivery" onClick={() => setIsMenuOpen(false)}>Delivery</Link></li>
              <li><Link to="/eats" onClick={() => setIsMenuOpen(false)}>Eats</Link></li>
              <li><Link to="/tech" onClick={() => setIsMenuOpen(false)}>Tech</Link></li>
              <li><Link to="/student-zone" onClick={() => setIsMenuOpen(false)}>🎓 Student Zone</Link></li>
              <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
              )}
            </ul>

            <div className="auth-section">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn">Login</Link>
                  <Link to="/register" className="register-btn">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
