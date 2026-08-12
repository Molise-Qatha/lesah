import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// ── INTERSECTION OBSERVER HOOK ──────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ── GALLERY DATA ────────────────────────
const marketplaceItems = [
  {
    image: '/images/maseeiso/food/1.png',
    title: 'Food & Meals',
    provider: 'Maseeiso Thaanyane',
    link: '/provider/maseeiso',
    color: '#e65100',
  },
  {
    image: '/images/maseeiso/laundry/1.png',
    title: 'Laundry',
    provider: 'Maseeiso Thaanyane',
    link: '/provider/maseeiso',
    color: '#1565C0',
  },
  {
    image: '/images/student-zone/game-morabaraba.jpg',
    title: 'Groceries',
    provider: 'Coming Soon',
    link: '/marketplace',
    color: '#2E7D32',
  },
  {
    image: '/images/student-zone/game-hokalla.jpg',
    title: 'Hair & Beauty',
    provider: 'Coming Soon',
    link: '/marketplace',
    color: '#6A1B9A',
  },
  {
    image: '/images/student-zone/game-lilotho.jpg',
    title: 'Delivery',
    provider: 'Coming Soon',
    link: '/marketplace',
    color: '#C62828',
  },
];

const studentZoneItems = [
  {
    image: '/images/student-zone/game-hokalla.jpg',
    title: 'Ho Kalla',
    desc: 'Stick fighting game',
    link: '/student-zone/hokalla',
    featured: true,
  },
  {
    image: '/images/student-zone/game-morabaraba.jpg',
    title: 'Morabaraba',
    desc: 'Board game',
    link: '/student-zone/morabaraba',
  },
  {
    image: '/images/student-zone/game-lilotho.jpg',
    title: 'Lilotho',
    desc: 'Riddles',
    link: '/student-zone/lilotho',
  },
  {
    image: '/images/student-zone/game-wordsearch.jpg',
    title: 'Word Search',
    desc: 'Puzzles',
    link: '/student-zone/word-search',
  },
];

const studentLifeWords = [
  { word: 'FIND', icon: '🏠', desc: 'Accommodation and useful student services.' },
  { word: 'CONNECT', icon: '🤝', desc: 'Student businesses and service providers.' },
  { word: 'MOVE', icon: '🚚', desc: 'Delivery and transportation.' },
  { word: 'GROW', icon: '📈', desc: 'Entrepreneurship and opportunities.' },
  { word: 'PLAY', icon: '🎮', desc: 'Games and Student Zone.' },
];

// ── COMPONENT ───────────────────────────
function LandingPage() {
  const [heroReady, setHeroReady] = useState(false);
  const [aboutRef, aboutInView] = useInView(0.3);
  const [marketRef, marketInView] = useInView(0.15);
  const [zoneRef, zoneInView] = useInView(0.15);
  const [lifeRef, lifeInView] = useInView(0.2);
  const [visionRef, visionInView] = useInView(0.2);
  const [ctaRef, ctaInView] = useInView(0.2);

  useEffect(() => {
    // Stagger hero entrance
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-hero-gradient" />
          <div className="lp-hero-shapes">
            <div className="lp-shape lp-shape-1" />
            <div className="lp-shape lp-shape-2" />
            <div className="lp-shape lp-shape-3" />
          </div>
        </div>

        <div className="lp-hero-content">
          <div className={`lp-hero-stage ${heroReady ? 'visible' : ''}`}>
            <img
              src="/images/logo.png"
              alt="LeSAH"
              className="lp-hero-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div className={`lp-hero-stage ${heroReady ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <h1>
              Everything Students Need.
              <br />
              <span className="lp-hero-highlight">In One Place.</span>
            </h1>
          </div>

          <div className={`lp-hero-stage ${heroReady ? 'visible' : ''}`} style={{ transitionDelay: '0.55s' }}>
            <p className="lp-hero-desc">
              Discover services, connect with student businesses, find opportunities
              and make university life easier with LeSAH.
            </p>
          </div>

          <div className={`lp-hero-stage ${heroReady ? 'visible' : ''}`} style={{ transitionDelay: '0.75s' }}>
            <div className="lp-hero-actions">
              <Link to="/marketplace" className="lp-btn lp-btn-primary">
                Explore Marketplace →
              </Link>
              <Link to="/student-zone" className="lp-btn lp-btn-secondary">
                Enter Student Zone →
              </Link>
            </div>
          </div>

          <div className={`lp-hero-stage ${heroReady ? 'visible' : ''}`} style={{ transitionDelay: '0.95s' }}>
            <div className="lp-hero-scroll" onClick={() => scrollTo('about')}>
              <span>Discover LeSAH</span>
              <span className="lp-scroll-arrow">↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" className="lp-section lp-about" ref={aboutRef}>
        <div className={`lp-about-grid ${aboutInView ? 'visible' : ''}`}>
          <div className="lp-about-text">
            <span className="lp-label">What is LeSAH?</span>
            <h2>
              Built around the
              <br />
              <span className="lp-highlight-green">real life</span>
              <br />
              of a student.
            </h2>
            <p>
              LeSAH — the Lesotho Students Assistance Hub — connects students with
              the people, businesses, services and opportunities that make university
              life better.
            </p>
            <p>
              From finding accommodation to discovering student-run food businesses,
              from playing Basotho games to navigating campus — LeSAH brings
              everything together.
            </p>
          </div>

          <div className="lp-about-visual">
            <div className="lp-connection-ring">
              <div className="lp-ring-node lp-node-student">Student</div>
              <div className="lp-ring-node lp-node-business">Business</div>
              <div className="lp-ring-node lp-node-service">Service</div>
              <div className="lp-ring-node lp-node-community">Community</div>
              <div className="lp-ring-center">LeSAH</div>
              <svg className="lp-ring-lines" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(46,125,50,0.2)" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(46,125,50,0.15)" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(46,125,50,0.1)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARKETPLACE PREVIEW ═══════════════ */}
      <section className="lp-section lp-marketplace" ref={marketRef}>
        <div className={`lp-marketplace-inner ${marketInView ? 'visible' : ''}`}>
          <div className="lp-section-head">
            <span className="lp-label">Marketplace</span>
            <h2>Discover Student Businesses.</h2>
            <p>Find people around you who provide the products and services students actually need.</p>
            <Link to="/marketplace" className="lp-link">View All →</Link>
          </div>

          <div className="lp-gallery-scroll">
            {marketplaceItems.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="lp-gallery-item"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="lp-gallery-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="lp-gallery-overlay" style={{ background: `linear-gradient(transparent 50%, ${item.color}dd)` }}>
                    <span className="lp-gallery-title">{item.title}</span>
                    <span className="lp-gallery-provider">{item.provider}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STUDENT ZONE PREVIEW ═══════════════ */}
      <section className="lp-section lp-zone" ref={zoneRef}>
        <div className={`lp-zone-inner ${zoneInView ? 'visible' : ''}`}>
          <div className="lp-section-head">
            <span className="lp-label">Student Zone</span>
            <h2>Your Student Space.</h2>
            <p>Games, campus resources, and things that make student life more enjoyable.</p>
            <Link to="/student-zone" className="lp-link">Enter →</Link>
          </div>

          <div className="lp-zone-gallery">
            {studentZoneItems.map((game, i) => (
              <Link
                key={i}
                to={game.link}
                className={`lp-zone-item ${game.featured ? 'featured' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="lp-zone-image">
                  <img src={game.image} alt={game.title} loading="lazy" />
                  <div className="lp-zone-overlay">
                    <span className="lp-zone-title">{game.title}</span>
                    <span className="lp-zone-desc">{game.desc}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STUDENT LIFE ═══════════════ */}
      <section className="lp-section lp-life" ref={lifeRef}>
        <div className={`lp-life-inner ${lifeInView ? 'visible' : ''}`}>
          <div className="lp-life-words">
            {studentLifeWords.map((item, i) => (
              <div
                key={i}
                className="lp-life-word"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <span className="lp-life-icon">{item.icon}</span>
                <h3 className="lp-life-title">{item.word}</h3>
                <p className="lp-life-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VISION ═══════════════ */}
      <section className="lp-section lp-vision" ref={visionRef}>
        <div className={`lp-vision-inner ${visionInView ? 'visible' : ''}`}>
          <h2>
            Built by <span className="lp-highlight-green">students</span>.
            <br />
            For <span className="lp-highlight-green">students</span>.
          </h2>
          <p>
            LeSAH is a growing community of students, alumni and young entrepreneurs
            creating real opportunities for university students across Lesotho.
          </p>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="lp-section lp-cta" ref={ctaRef}>
        <div className={`lp-cta-inner ${ctaInView ? 'visible' : ''}`}>
          <div className="lp-cta-bg-shapes">
            <div className="lp-cta-shape lp-cta-shape-1" />
            <div className="lp-cta-shape lp-cta-shape-2" />
          </div>
          <h2>Be Part of the Student Movement.</h2>
          <p>
            Discover what LeSAH can do for you — or become part of the people building
            opportunities for students across Lesotho.
          </p>
          <div className="lp-cta-actions">
            <Link to="/marketplace" className="lp-btn lp-btn-primary">
              Explore LeSAH →
            </Link>
            <a
              href="https://wa.me/26656613551?text=Hello%20LeSAH%2C%20I%20want%20to%20join%20the%20Marketplace."
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-outline"
            >
              Join the Marketplace →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;