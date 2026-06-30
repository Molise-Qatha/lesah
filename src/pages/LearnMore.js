import React from 'react';
import { Link } from 'react-router-dom';
import './LearnMore.css';

function LearnMore() {
  return (
    <div className="learn-more-page">
      {/* Hero Section */}
      <section className="learn-more-hero">
        <div className="container">
          <h1>More Than Just an App</h1>
          <p className="hero-subtitle">LeSAH is a movement to solve real student problems in Lesotho.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p className="mission-text">
              LeSAH was born from firsthand experience. As a student at the National University of Lesotho, 
              I faced the same challenges you do—finding affordable accommodation near campus, 
              stretching a monthly stipend until it runs out, and moving heavy belongings when semesters end.
            </p>
            <p className="mission-text">
              These aren't just inconveniences; they're daily obstacles that affect your ability to focus on 
              what really matters: your education. LeSAH exists to remove those obstacles so you can thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="services-detail">
        <div className="container">
          <h2>How We Help</h2>
          <div className="services-grid">
            {/* Accommodation Card */}
            <div className="service-detail-card">
              <div className="service-icon">🏠</div>
              <h3>Accommodation</h3>
              <p className="service-description">
                Finding safe, affordable housing near campus shouldn't be a gamble. LeSAH connects you with 
                verified landlords and student‑friendly listings in Roma and beyond.
              </p>
              <ul className="service-features">
                <li>✓ Verified properties near NUL, Limkokwing, and other institutions</li>
                <li>✓ Transparent pricing with no hidden fees</li>
                <li>✓ Schedule viewings directly through the app</li>
                <li>✓ Read reviews from fellow students</li>
              </ul>
              <Link to="/accommodation" className="service-link">Explore Listings →</Link>
            </div>

            {/* Student Loans Card */}
            <div className="service-detail-card">
              <div className="service-icon">💰</div>
              <h3>Student Loans</h3>
              <p className="service-description">
                When your stipend runs out before month‑end, a small bridge loan can make all the difference. 
                Our assessment tool helps determine eligibility, and we offer M200–M1000 loans with fair terms.
              </p>
              <ul className="service-features">
                <li>✓ Quick pre‑qualification through the app</li>
                <li>✓ Transparent repayment expectations</li>
                <li>✓ Final approval after in‑person document verification</li>
                <li>✓ Builds your financial reputation for future needs</li>
              </ul>
              <Link to="/loans" className="service-link">Check Eligibility →</Link>
            </div>

            {/* Asset Delivery Card */}
            <div className="service-detail-card">
              <div className="service-icon">🚚</div>
              <h3>Asset Delivery</h3>
              <p className="service-description">
                Moving your belongings shouldn't be a nightmare. Whether you're heading home for the holidays 
                or relocating after graduation, our network of student‑friendly drivers has you covered.
              </p>
              <ul className="service-features">
                <li>✓ Connect with verified drivers in Roma</li>
                <li>✓ Real‑time tracking of your delivery</li>
                <li>✓ Affordable rates designed for students</li>
                <li>✓ Drivers who understand campus logistics</li>
              </ul>
              <Link to="/delivery" className="service-link">Request Delivery →</Link>
            </div>

            {/* LeSAH Eats Card */}
            <div className="service-detail-card">
              <div className="service-icon">🍕</div>
              <h3>LeSAH Eats</h3>
              <p className="service-description">
                Order delicious, affordable meals from student‑friendly vendors around campus. 
                From pizza to local favourites, we connect you with the best food options.
              </p>
              <ul className="service-features">
                <li>✓ Verified local vendors</li>
                <li>✓ Student‑friendly prices</li>
                <li>✓ Quick WhatsApp ordering</li>
                <li>✓ Delivery to your doorstep</li>
              </ul>
              <Link to="/eats" className="service-link">Order Food →</Link>
            </div>

            {/* LeSAH Tech Card */}
            <div className="service-detail-card">
              <div className="service-icon">💻</div>
              <h3>LeSAH Tech</h3>
              <p className="service-description">
                Get reliable technology support from a trusted student partner. 
                Buy laptops, repair screens, install software, or upgrade your system.
              </p>
              <ul className="service-features">
                <li>✓ Laptop repair & sales</li>
                <li>✓ Windows & software installation</li>
                <li>✓ Fast turnaround</li>
                <li>✓ Student‑friendly pricing</li>
              </ul>
              <Link to="/tech" className="service-link">Get Support →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lilotho Game Section */}
      <section className="lilotho-section">
        <div className="container">
          <div className="lilotho-content">
            <h2>🎭 Play Lilotho & Earn Rewards</h2>
            <p>
              Lilotho is a traditional Basotho riddle game. Test your wit with Sesotho proverbs or challenge 
              yourself with our English "Mind Benders" mode. Every correct answer earns you <strong>Lilotho Points</strong> 
              that can be redeemed for discounts on our services.
            </p>
            <Link to="/" className="lilotho-link">Play on the Homepage →</Link>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="founder-section">
        <div className="container">
          <div className="founder-card">
            <div className="founder-icon">👨🏾‍🎓</div>
            <h3>A Note from the Founder</h3>
            <p>
              "I built LeSAH because I've been there. I've struggled to move my things from Roma. 
              I've watched friends stress over accommodation scams. I know what it's like to count every Maloti 
              at month‑end. This app is my promise to make student life in Lesotho just a little bit easier."
            </p>
            <p className="founder-name">— Molise Qatha, NUL Student & LeSAH Founder</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of students already using LeSAH to simplify their campus life.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/" className="btn-secondary">Explore Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearnMore;