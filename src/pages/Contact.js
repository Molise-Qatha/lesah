import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission is currently handled in the console.
    // You can later connect it to a backend or simply replace it with a WhatsApp chat.
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const phoneNumber = '+266 56613551';
  const whatsappLink = 'https://wa.me/26656613551';

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-container">
          <div className="contact-header">
            <h1>Contact Us</h1>
            <p>
              Have questions? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
            </p>
          </div>

          <div className="contact-grid">
            {/* Contact Info – real details */}
            <div className="contact-info">
              <h2>Get in Touch</h2>

              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Visit Us</h3>
                  <p>National University of Lesotho<br />Roma, Maseru<br />Lesotho</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h3>Email Us</h3>
                  <p>moliqatha@gmail.com</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h3>Call / WhatsApp</h3>
                  <p>{phoneNumber}</p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <h3>Office Hours</h3>
                  <p>Monday – Friday: 9:00 AM – 5:00 PM</p>
                  <p>Saturday: 9:00 AM – 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form (optional – can be kept or replaced later) */}
            <div className="contact-form-container">
              <h2>Send a Message</h2>
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We’ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map removed to keep page simple – can be added back later */}
        </div>
      </div>
    </div>
  );
}

export default Contact;