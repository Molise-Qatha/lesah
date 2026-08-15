import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// ── INTERSECTION OBSERVER HOOK ──────────
function useInView(threshold = 0.15) {
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

// ── ECOSYSTEM DATA ──────────────────────
const ecosystemPillars = [
  {
    icon: '🛒',
    title: 'Marketplace',
    desc: 'Student opportunity and entrepreneurship',
    color: '#e65100',
  },
  {
    icon: '🎮',
    title: 'Student Zone',
    desc: 'Campus life, culture and entertainment',
    color: '#2E7D32',
  },
  {
    icon: '💰',
    title: 'Financial Literacy',
    desc: 'Building financial capability from childhood to university',
    color: '#1565C0',
  },
  {
    icon: '🛡️',
    title: 'Community',
    desc: 'Safety, awareness and student rights',
    color: '#6A1B9A',
  },
];

const journeySteps = [
  { label: 'IDEA', subtitle: 'Born from NUL student experience', phase: 'Where we started' },
  { label: 'BUILD', subtitle: 'Developing the platform', phase: 'Where we started' },
  { label: 'FIRST STUDENT BUSINESSES', subtitle: 'Maseeiso Thaanyane joins', phase: 'Where we are' },
  { label: 'MARKETPLACE', subtitle: 'Connecting student vendors', phase: 'Where we are' },
  { label: 'STUDENT ZONE', subtitle: 'Games, campus tools, culture', phase: 'Where we are' },
  { label: 'FINANCIAL LITERACY AI', subtitle: 'In development', phase: "Where we're going" },
  { label: 'COMMUNITY', subtitle: 'Safety and rights awareness', phase: "Where we're going" },
  { label: 'EXPANSION ACROSS LESOTHO', subtitle: 'Reaching every student', phase: "Where we're going" },
];

// ── COMPONENT ───────────────────────────
function About() {
  const [storyRef, storyInView] = useInView(0.2);
  const [visionRef, visionInView] = useInView(0.2);
  const [beliefRef, beliefInView] = useInView(0.3);
  const [builtRef, builtInView] = useInView(0.2);
  const [journeyRef, journeyInView] = useInView(0.1);
  const [founderRef, founderInView] = useInView(0.2);

  return (
    <div className="about-page">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-hero-shape about-hero-shape-1" />
          <div className="about-hero-shape about-hero-shape-2" />
        </div>
        <div className="about-hero-content">
          <span className="about-label">About LeSAH</span>
          <h1>
            Built from a student experience.
            <br />
            <span className="about-hero-highlight">Designed for a better one.</span>
          </h1>
          <p>
            LeSAH — Lesotho Students Assistance Hub — was born from the experience of a
            student at the National University of Lesotho who saw how many different
            challenges students face and imagined a better way to connect them with
            opportunities, assistance, knowledge and community.
          </p>
        </div>
      </section>

      {/* ═══════════════ THE STORY ═══════════════ */}
      <section className="about-section" ref={storyRef}>
        <div className={`about-story ${storyInView ? 'visible' : ''}`}>
          <span className="about-label">Why LeSAH Exists</span>
          <h2>Student life should not feel like every problem has to be solved alone.</h2>
          <div className="about-story-body">
            <p>
              LeSAH began with Molise Qatha's experience as a student at the National
              University of Lesotho. Like many students, he saw how many different
              challenges students face — finding accommodation, earning income, getting
              food, understanding finances, staying informed and finding opportunities.
            </p>
            <p>
              The central belief is simple: students need access to opportunities,
              useful services, knowledge, safe communities, spaces to connect, and
              chances to build something of their own.
            </p>
            <p>
              LeSAH was created around that belief. It is not a charity — it is an
              entrepreneurial platform built to create sustainable opportunities and
              practical solutions for students and young people in Lesotho.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ THE VISION / ECOSYSTEM ═══════════════ */}
      <section className="about-section about-vision-section" ref={visionRef}>
        <div className={`about-vision ${visionInView ? 'visible' : ''}`}>
          <span className="about-label">The Vision</span>
          <h2>More Than a Student Platform</h2>
          <p className="about-vision-intro">
            LeSAH is being built as an ecosystem — interconnected parts working
            together to support students at every level.
          </p>

          <div className="about-ecosystem">
            <div className="about-ecosystem-center">
              <span>LeSAH</span>
            </div>
            <svg className="about-ecosystem-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="50" y1="50" x2="0" y2="0" stroke="rgba(46,125,50,0.25)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="100" y2="0" stroke="rgba(46,125,50,0.25)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="rgba(46,125,50,0.25)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="100" y2="100" stroke="rgba(46,125,50,0.25)" strokeWidth="0.5" />
            </svg>
            {ecosystemPillars.map((pillar, i) => (
              <div
                key={i}
                className={`about-pillar about-pillar-${i}`}
                style={{ '--pillar-color': pillar.color }}
              >
                <span className="about-pillar-icon">{pillar.icon}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ OUR BELIEF ═══════════════ */}
      <section className="about-section about-belief-section" ref={beliefRef}>
        <div className={`about-belief ${beliefInView ? 'visible' : ''}`}>
          <h2>We Believe Students Deserve More Than Survival.</h2>
          <p>
            Students should have opportunities to discover, build, learn, connect,
            create, participate and support one another.
          </p>
          <div className="about-belief-words">
            {['DISCOVER', 'BUILD', 'LEARN', 'CONNECT', 'CREATE', 'SUPPORT'].map((word, i) => (
              <span key={i} className="about-belief-word" style={{ transitionDelay: `${i * 0.1}s` }}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BUILT IN LESOTHO ═══════════════ */}
      <section className="about-section" ref={builtRef}>
        <div className={`about-built ${builtInView ? 'visible' : ''}`}>
          <span className="about-label">Built From Lesotho</span>
          <h2>Built From Lesotho, For Its People</h2>
          <p>
            LeSAH is being developed with the realities of students and communities in
            Lesotho in mind. The National University of Lesotho is where the idea was
            born.
          </p>
          <p>
            But the vision extends beyond one university. LeSAH is intended to
            eventually reach students and young people across Lesotho — connecting
            communities, creating opportunities and building a stronger future.
          </p>
        </div>
      </section>

      {/* ═══════════════ THE JOURNEY ═══════════════ */}
      <section className="about-section about-journey-section" ref={journeyRef}>
        <div className={`about-journey ${journeyInView ? 'visible' : ''}`}>
          <span className="about-label">The Journey</span>
          <h2>Where We've Been & Where We're Going</h2>

          <div className="about-timeline">
            <div className="about-timeline-line" />
            {journeySteps.map((step, i) => (
              <div
                key={i}
                className="about-timeline-step"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="about-timeline-dot" />
                <div className="about-timeline-content">
                  <span className="about-timeline-phase">{step.phase}</span>
                  <h4>{step.label}</h4>
                  <p>{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOUNDER ═══════════════ */}
      <section className="about-section about-founder-section" ref={founderRef}>
        <div className={`about-founder ${founderInView ? 'visible' : ''}`}>
          <span className="about-label">Meet the Founder</span>
          <div className="about-founder-grid">
            <div className="about-founder-image">
              <div className="about-founder-placeholder">
                <span>MQ</span>
              </div>
            </div>
            <div className="about-founder-info">
              <h2>Molise Qatha</h2>
              <p className="about-founder-role">Founder, LeSAH</p>
              <p className="about-founder-bio">
                LeSAH was founded by Molise Qatha, an NUL student whose own experiences
                helped shape the idea behind the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CLOSING ═══════════════ */}
      <section className="about-closing">
        <div className="about-closing-inner">
          <h2>LeSAH is still being built.</h2>
          <p className="about-closing-sub">And the journey has only just begun.</p>
          <div className="about-closing-actions">
            <Link to="/marketplace" className="about-cta-btn">Explore Marketplace</Link>
            <Link to="/student-zone" className="about-cta-btn about-cta-secondary">Enter Student Zone</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;