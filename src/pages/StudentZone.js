import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentZone.css';

// ── DATA ──────────────────────────────────
const games = [
  {
    id: 'morabaraba',
    name: 'Morabaraba',
    desc: 'Traditional Basotho board game',
    icon: '🕹️',
    image: '/images/student-zone/game-morabaraba.jpg',
    link: '/student-zone/morabaraba',
    badge: '🇱🇸 Heritage',
    color: '#8B4513',
  },
  {
    id: 'hokalla',
    name: 'Ho Kalla',
    desc: 'Stick fighting game',
    icon: '⚔️',
    image: '/images/student-zone/game-hokalla.jpg',
    link: '/student-zone/hokalla',
    badge: '🥊 Fighting',
    color: '#C62828',
  },
  {
    id: 'lilotho',
    name: 'Lilotho',
    desc: 'Sesotho riddle challenge',
    icon: '🎭',
    image: '/images/student-zone/game-lilotho.jpg',
    link: '/student-zone/lilotho',
    badge: '🧠 Riddles',
    color: '#6A1B9A',
  },
  {
    id: 'wordsearch',
    name: 'Word Search',
    desc: 'Find hidden words',
    icon: '🔍',
    image: '/images/student-zone/game-wordsearch.jpg',
    link: '/student-zone/word-search',
    badge: '📖 Words',
    color: '#1565C0',
  },
  {
    id: 'wordscramble',
    name: 'Word Scramble',
    desc: 'Unscramble as fast as you can',
    icon: '🔤',
    image: '/images/student-zone/game-wordscramble.jpg',
    link: '/student-zone/word-scramble',
    badge: '⏱️ Speed',
    color: '#2E7D32',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    desc: 'Challenge your logic',
    icon: '🧩',
    image: null,
    link: '/student-zone/sudoku',
    badge: '🔢 Logic',
    color: '#F57C00',
  },
];

const campusFeatures = [
  {
    id: 'map',
    icon: '🗺️',
    title: 'Campus Map',
    desc: 'Find lecture halls, residences, and services around NUL campus.',
    link: '/student-zone/campus-map',
    available: true,
    cta: 'Explore Campus',
  },
  {
    id: 'notices',
    icon: '📢',
    title: 'Campus Notices',
    desc: 'Stay updated with announcements, events, and deadlines around campus.',
    link: null,
    available: false,
    cta: 'Coming Soon',
  },
  {
    id: 'papers',
    icon: '📚',
    title: 'Past Papers',
    desc: 'Prepare for exams using previous examination papers.',
    link: null,
    available: false,
    cta: 'Coming Soon',
  },
  {
    id: 'timetable',
    icon: '📅',
    title: 'Exam Timetable',
    desc: 'Keep track of your upcoming examination schedule.',
    link: null,
    available: false,
    cta: 'Coming Soon',
  },
];

const dailyQuotes = [
  {
    sesotho: '"Molapo o tlatsoa ke melatsoana."',
    english: 'Small consistent actions create great achievements.',
  },
  {
    sesotho: '"Lefu ha le jwetse."',
    english: 'Death does not announce its arrival — make each day count.',
  },
  {
    sesotho: '"Motho ke motho ka batho."',
    english: 'A person is a person through other people.',
  },
];

// ── COMPONENT ────────────────────────────
function StudentZone() {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const scrollToGames = () => {
    const el = document.getElementById('sz-games');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const refreshQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % dailyQuotes.length);
  };

  const heroStyle = heroImgFailed
    ? {}
    : {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/student-zone/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <div className="sz-new">
      {/* ═══════════ HERO (PRESERVED) ═══════════ */}
      <section className="sz-hero" style={heroStyle}>
        <img
          src="/images/student-zone/hero-bg.jpg"
          alt=""
          style={{ display: 'none' }}
          onLoad={() => setHeroImgFailed(false)}
          onError={() => setHeroImgFailed(true)}
        />
        <div className="sz-hero-overlay" />
        <div className="sz-hero-content">
          <h1>Student Zone</h1>
          <p className="sz-hero-subtitle">Your campus. Your community. Your space.</p>
          <p className="sz-hero-desc">
            Discover games, campus notices, accommodation updates and student resources—all in one place.
          </p>
          <div className="sz-hero-buttons">
            <button className="sz-btn-primary" onClick={scrollToGames}>
              Explore Student Zone
            </button>
            <button className="sz-btn-secondary" onClick={scrollToGames}>
              Play Games
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK DISCOVERY ═══════════ */}
      <section className="sz-section">
        <div className="sz-discovery">
          <div className="sz-discovery-item" onClick={scrollToGames}>
            <span className="sz-discovery-icon">🎮</span>
            <span className="sz-discovery-label">Play</span>
          </div>
          <Link to="/student-zone/campus-map" className="sz-discovery-item">
            <span className="sz-discovery-icon">🗺️</span>
            <span className="sz-discovery-label">Campus</span>
          </Link>
          <div className="sz-discovery-item" onClick={refreshQuote}>
            <span className="sz-discovery-icon">💡</span>
            <span className="sz-discovery-label">Motivate</span>
          </div>
          <Link to="/marketplace" className="sz-discovery-item">
            <span className="sz-discovery-icon">🛒</span>
            <span className="sz-discovery-label">Market</span>
          </Link>
        </div>
      </section>

      {/* ═══════════ GAMES — HORIZONTAL SHELF ═══════════ */}
      <section className="sz-section" id="sz-games">
        <div className="sz-section-intro">
          <h2>🎮 Games</h2>
          <p>Swipe to discover Basotho and classic student games.</p>
        </div>

        <div className="sz-game-shelf">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.link}
              className="sz-game-item"
              style={{ '--game-color': game.color }}
            >
              <div className="sz-game-image-wrap">
                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="sz-game-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="sz-game-fallback">
                    <span>{game.icon}</span>
                  </div>
                )}
                <span className="sz-game-badge">{game.badge}</span>
              </div>
              <div className="sz-game-meta">
                <h3>{game.name}</h3>
                <p>{game.desc}</p>
                <span className="sz-game-play">Play Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ CAMPUS RESOURCES ═══════════ */}
      <section className="sz-section sz-section-alt">
        <div className="sz-section-intro">
          <h2>🏫 Campus Resources</h2>
          <p>Tools and services to help you navigate student life.</p>
        </div>

        <div className="sz-resources-list">
          {campusFeatures.map((feature) => (
            <div key={feature.id} className="sz-resource-row">
              <span className="sz-resource-icon">{feature.icon}</span>
              <div className="sz-resource-info">
                <h3>
                  {feature.title}
                  {!feature.available && (
                    <span className="sz-coming-tag">Coming Soon</span>
                  )}
                </h3>
                <p>{feature.desc}</p>
              </div>
              <div className="sz-resource-action">
                {feature.available ? (
                  <Link to={feature.link} className="sz-resource-btn">
                    {feature.cta}
                  </Link>
                ) : (
                  <span className="sz-resource-btn disabled">{feature.cta}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DAILY MOTIVATION ═══════════ */}
      <section className="sz-section sz-motivation">
        <div className="sz-motivation-inner">
          <span className="sz-motivation-label">Today's Motivation</span>
          <blockquote className="sz-motivation-quote">
            {dailyQuotes[quoteIndex].sesotho}
          </blockquote>
          <p className="sz-motivation-translation">
            {dailyQuotes[quoteIndex].english}
          </p>
          <button className="sz-motivation-refresh" onClick={refreshQuote}>
            🔄 New Quote
          </button>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="sz-footer">
        <h3>LeSAH Student Zone</h3>
        <p>Home isn't just where you sleep. It's where you belong.</p>
      </footer>
    </div>
  );
}

export default StudentZone;