import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentZonePage.css';

const quickAccess = [
  { icon: '🎮', title: 'Games', desc: 'Play now', available: true, link: '#games' },
  { icon: '📢', title: 'Campus Notices', desc: 'Coming Soon', available: false },
  { icon: '📚', title: 'Past Papers', desc: 'Coming Soon', available: false },
  { icon: '📅', title: 'Exam Timetable', desc: 'Coming Soon', available: false },
  { icon: '🗺️', title: 'Campus Map', desc: 'Explore NUL', available: true, link: '/student-zone/campus-map' },
  { icon: '💬', title: 'Daily Motivation', desc: 'Coming Soon', available: false },
];

const games = [
  {
    icon: '🕹️',
    title: 'Morabaraba',
    desc: 'Traditional Basotho board game. Challenge a friend or the computer.',
    link: '/student-zone/morabaraba',
    img: '/images/student-zone/game-morabaraba.jpg',
    available: true,
  },
  {
    icon: '🎭',
    title: 'Lilotho',
    desc: 'Sesotho riddle game. Test your wit with proverbs.',
    link: '/student-zone/lilotho',
    img: '/images/student-zone/game-lilotho.jpg',
    available: true,
  },
  {
    icon: '🔍',
    title: 'Word Search',
    desc: 'Find hidden student‑themed words.',
    link: '/student-zone/word-search',
    img: '/images/student-zone/game-wordsearch.jpg',
    available: true,
  },
  {
    icon: '🔤',
    title: 'Word Scramble',
    desc: 'Unscramble student‑themed words as fast as you can.',
    link: '/student-zone/word-scramble',
    img: '/images/student-zone/game-wordscramble.jpg',
    available: true,
  },
  {
    icon: '🧩',
    title: 'Sudoku',
    desc: 'Challenge your logic skills.',
    link: '/student-zone/sudoku',
    img: null,
    available: true,
  },
  // ----- NEW: Ho Kalla game card -----
  {
    icon: '⚔️',   // crossed swords to represent stick fighting
    title: 'Ho Kalla',
    desc: 'Traditional Basotho stick fighting game. 🇱🇸 Basotho Heritage',
    link: '/student-zone/hokalla',
    img: null,   // placeholder – will add later
    available: true,
  },
];

const notices = [
  { title: 'Registration Dates', date: 'Coming Soon' },
  { title: 'Faculty Announcements', date: 'Coming Soon' },
  { title: 'SRC Elections', date: 'Coming Soon' },
  { title: 'Library Updates', date: 'Coming Soon' },
];

const quickLinks = [
  { icon: '🏠', title: 'Accommodation', path: '/accommodation' },
  { icon: '💰', title: 'Student Loans', path: '/loans' },
  { icon: '🚚', title: 'Delivery Services', path: '/delivery' },
  { icon: '📅', title: 'Campus Events', path: null, comingSoon: true },
  { icon: '📆', title: 'Academic Calendar', path: null, comingSoon: true },
];

// ----- FULL‑BLEED BACKGROUND IMAGES FOR HIGHLIGHTS -----
const highlights = [
  {
    id: 'meme',
    title: "Today's Meme",
    emoji: '😂',
    bgImg: '/images/student-zone/highlight-meme.jpg',
    quote: "When you realise the assignment was due yesterday.",
    badge: 'Updated Daily',
  },
  {
    id: 'motivation',
    title: "Today's Motivation",
    emoji: '💡',
    bgImg: '/images/student-zone/highlight-motivation.jpg',
    quote: "Small progress is still progress.",
  },
  {
    id: 'notice',
    title: "Campus Notice",
    emoji: '📢',
    bgImg: null,
    quote: "Coming Soon.",
    badge: 'Notice',
    button: 'More',
  },
];

function StudentZone() {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const recentGames = [];

  const scrollToGames = () => {
    const el = document.getElementById('games-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const heroStyle = heroImgFailed ? {} : {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/student-zone/hero-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="student-zone-page">
      <div className="sz-hero" style={heroStyle}>
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
            <Link to="/student-zone" className="sz-btn-secondary" onClick={scrollToGames}>
              Play Games
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <section className="sz-section">
        <h2 className="sz-section-title">Quick Access</h2>
        <div className="sz-quick-grid">
          {quickAccess.map((item, idx) => (
            <div key={idx} className={`sz-quick-card ${!item.available ? 'coming-soon' : ''}`}>
              <span className="sz-quick-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {item.available && item.link ? (
                <Link to={item.link} className="sz-play-btn">Open</Link>
              ) : !item.available && (
                <span className="sz-badge">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Games Section */}
      <section className="sz-section" id="games-section">
        <h2 className="sz-section-title">🎮 Games</h2>
        <div className="sz-games-grid">
          {games.map((game, idx) => (
            <div key={idx} className={`sz-game-card ${!game.available ? 'disabled' : ''}`}>
              <div className="sz-game-image">
                {game.img ? (
                  <img src={game.img} alt={game.title} className="game-card-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : null}
                <span className="sz-game-icon">{game.icon}</span>
              </div>
              <h3>{game.title}</h3>
              <p>{game.desc}</p>
              {game.available ? (
                <Link to={game.link} className="sz-game-btn">Play Now</Link>
              ) : (
                <span className="sz-badge">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Daily Highlights – full‑bleed images */}
      <section className="sz-section">
        <h2 className="sz-section-title">✨ Daily Highlights</h2>
        <div className="sz-highlights-grid">
          {highlights.map(card => (
            <div
              key={card.id}
              className="sz-highlight-card"
              style={card.bgImg ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${card.bgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              <div className="sz-highlight-overlay" />
              <div className="sz-highlight-content">
                {card.badge && <span className="sz-badge highlight-badge">{card.badge}</span>}
                <p className="sz-highlight-quote">"{card.quote}"</p>
                <button className="sz-highlight-btn">{card.button}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Basotho Motivation */}
      <section className="sz-section">
        <h2 className="sz-section-title">Today's Motivation</h2>
        <div className="sz-motivation-card">
          <p className="sz-quote">"Molapo o tlatsoa ke melatsoana."</p>
          <p className="sz-quote-translation">Small consistent actions create great achievements.</p>
          <button className="sz-refresh-icon" aria-label="Refresh quote" onClick={() => {}}>🔄</button>
        </div>
      </section>

      {/* Campus Notices */}
      <section className="sz-section">
        <h2 className="sz-section-title">Campus Notices</h2>
        <div className="sz-notices-grid">
          {notices.map((notice, idx) => (
            <div key={idx} className="sz-notice-card">
              <h4>{notice.title}</h4>
              <p>{notice.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Continue Playing */}
      <section className="sz-section">
        <h2 className="sz-section-title">Continue Playing</h2>
        {recentGames.length > 0 ? (
          <div className="sz-recent-grid">
            {recentGames.map((game, idx) => (
              <div key={idx} className="sz-recent-card">{game.title}</div>
            ))}
          </div>
        ) : (
          <div className="sz-empty-state">
            <p>You haven't played any games yet.</p>
            <Link to="/student-zone/morabaraba" className="sz-btn-primary">Start with Morabaraba</Link>
            <Link to="/student-zone/lilotho" className="sz-btn-secondary">or Lilotho</Link>
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="sz-section">
        <h2 className="sz-section-title">Quick Links</h2>
        <div className="sz-links-grid">
          {quickLinks.map((link, idx) => (
            <div key={idx} className={`sz-link-card ${link.comingSoon ? 'coming-soon' : ''}`}>
              <span className="sz-link-icon">{link.icon}</span>
              <span className="sz-link-title">{link.title}</span>
              {link.path ? (
                <Link to={link.path} className="sz-link-arrow">→</Link>
              ) : (
                <span className="sz-badge">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="sz-footer">
        <h3>LeSAH Student Zone</h3>
        <p>Home isn't just where you sleep. It's where you belong.</p>
      </footer>
    </div>
  );
}

export default StudentZone;