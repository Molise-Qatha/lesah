import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

// Import local images for existing services
import accommodationImg from '../assets/images/accommodation-bg.jpg';
import loansImg from '../assets/images/loans-bg.jpg';
import deliveryImg from '../assets/images/delivery-bg.jpg';

function Services() {
  const services = [
    {
      title: 'Accommodation',
      description:
        'Premium student housing located within walking distance of campus, featuring 24/7 security and high-speed fiber.',
      path: '/accommodation',
      buttonText: 'Explore Listings',
      bgImage: accommodationImg,
      overlayColor: 'rgba(0, 0, 0, 0.65)',
    },
    {
      title: 'Student Loans',
      description:
        'Flexible financial solutions with competitive interest rates tailored for academic success and peace of mind.',
      path: '/loans',
      buttonText: 'Check Eligibility',
      bgImage: loansImg,
      overlayColor: 'rgba(0, 0, 0, 0.7)',
    },
    {
      title: 'Asset Delivery',
      description:
        'Safe and secure transport of your academic materials and personal belongings across the country with real-time tracking.',
      path: '/delivery',
      buttonText: 'Request Delivery',
      bgImage: deliveryImg,
      overlayColor: 'rgba(0, 0, 0, 0.65)',
    },
    // New services – will use solid background until images are available
    {
      title: 'LeSAH Eats',
      description:
        'Order food from trusted local student‑friendly vendors around campus.',
      path: '/eats',
      buttonText: 'Order Now',
      bgImage: null, // no background image yet
      icon: '🍕',
      bgColor: '#f59e0b', // warm orange for food
    },
    {
      title: 'LeSAH Tech',
      description:
        'Buy, repair and upgrade your devices. Reliable student technology support.',
      path: '/tech',
      buttonText: 'Get Support',
      bgImage: null,
      icon: '💻',
      bgColor: '#2DBE8D', // green to match primary
    },
  ];

  return (
    <section id="services-section" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => {
            // Build style based on whether a background image exists
            const style = service.bgImage
              ? {
                  backgroundImage: `linear-gradient(${service.overlayColor}, ${service.overlayColor}), url(${service.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }
              : {
                  backgroundColor: service.bgColor || '#f3f4f6',
                };

            return (
              <Link
                key={index}
                to={service.path}
                className="service-card"
                style={style}
              >
                {/* If no bgImage, show an icon */}
                {!service.bgImage && service.icon && (
                  <div className="service-icon">{service.icon}</div>
                )}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-link">{service.buttonText} →</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;