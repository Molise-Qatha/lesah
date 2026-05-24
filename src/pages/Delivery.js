import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import './Delivery.css';

import { useNearbyDrivers } from '../hooks/useNearbyDrivers';
import { deliveryService } from '../services/deliveryService';
import TrackingResult from '../components/Delivery/TrackingResult';
import DeliveryMap from '../components/Delivery/DeliveryMap';

const ROMA_COORDINATES = { lat: -29.4422, lng: 27.7148 };

function Delivery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userLocation, setUserLocation] = useState(ROMA_COORDINATES);
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Your WhatsApp number
  const whatsappNumber = '26656613551';

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(ROMA_COORDINATES)
      );
    }
  }, []);

  // Fetch nearby drivers using React Query
  const { data: nearbyDrivers = [], isLoading: driversLoading } = useNearbyDrivers(
    userLocation.lat,
    userLocation.lng,
    true
  );

  // Fetch real delivery requests from backend when logged in
  const fetchMyDeliveries = async () => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem('recentDeliveries');
      if (saved) setRecentRequests(JSON.parse(saved));
      return;
    }
    try {
      const data = await deliveryService.getMyRequests();
      setRecentRequests(data);
    } catch (error) {
      const saved = localStorage.getItem('recentDeliveries');
      if (saved) setRecentRequests(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchMyDeliveries();
  }, [isLoggedIn]);

  // General delivery request via WhatsApp
  const handleWhatsAppDelivery = () => {
    const message = "Hi LeSAH, I need a delivery service. Can you assist me with the details?";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Small property / combine delivery request via WhatsApp
  const handleCombineDelivery = () => {
    const message = "Hi LeSAH, I have a small property to deliver. Can you combine it with other students going to the same place to reduce costs? Let's discuss.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Track delivery
  const handleTrackDelivery = async (e) => {
    e.preventDefault();
    const trackingId = e.target.trackingId?.value;
    if (!trackingId) {
      toast.error('Please enter a tracking ID');
      return;
    }
    try {
      const data = await deliveryService.getTrackingStatus(trackingId);
      setTrackedDelivery(data);
    } catch (error) {
      toast.error('Tracking ID not found');
      setTrackedDelivery(null);
    }
  };

  return (
    <div className="delivery-page">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="delivery-container">
        {/* Hero Section */}
        <div className="delivery-hero">
          <div className="hero-icon">🚚</div>
          <h1 className="delivery-title">
            Fast & Reliable <span className="highlight">Student Delivery</span>
          </h1>
          <p className="delivery-subtitle">
            Chat with us directly on WhatsApp to request a delivery or combine small properties.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleWhatsAppDelivery}>
              💬 Request Delivery via WhatsApp
            </button>
            <button className="btn-secondary" onClick={handleCombineDelivery}>
              📦 Small Property? Let's Combine
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-value">{nearbyDrivers.length || '...'}</span>
              <span className="stat-label">Active Drivers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">&lt;20min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Live Map Section */}
        <div className="live-map-section">
          <h2>📍 Live Map - Nearby Drivers</h2>
          <p>See available drivers in Roma</p>
          <DeliveryMap 
            userLocation={userLocation} 
            drivers={nearbyDrivers} 
            loading={driversLoading} 
          />
          <p className="map-note">
            ✨ {nearbyDrivers.length} drivers available nearby<br />
            🏫 <strong>National University of Lesotho (NUL) area</strong>
          </p>
        </div>

        {/* Features Cards */}
        <div className="delivery-features">
          <div className="delivery-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Door-to-door in under 20 minutes</p>
          </div>
          <div className="delivery-card">
            <div className="feature-icon">📍</div>
            <h3>Real-time Location</h3>
            <p>Watch your delivery move live</p>
          </div>
          <div className="delivery-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Trusted</h3>
            <p>All couriers are verified students</p>
          </div>
          <div className="delivery-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable</h3>
            <p>Student-friendly rates</p>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="tracking-section">
          <h2>Track Your Delivery</h2>
          <p>Enter your tracking ID to see real-time status</p>
          <form className="tracking-form" onSubmit={handleTrackDelivery}>
            <input
              type="text"
              name="trackingId"
              placeholder="Tracking ID (e.g., DEL123456)"
            />
            <button type="submit">
              Track Package
            </button>
          </form>
          {trackedDelivery && <TrackingResult delivery={trackedDelivery} />}
        </div>

        {/* Recent Requests (from backend) */}
        {recentRequests.length > 0 && (
          <div className="recent-requests">
            <h2>Recent Delivery Requests</h2>
            <div className="requests-list">
              {recentRequests.map((req) => (
                <div key={req.id} className="request-item">
                  <div className="request-icon">📦</div>
                  <div className="request-details">
                    <p><strong>From:</strong> {req.pickup_location || req.pickupLocation || 'N/A'}</p>
                    <p><strong>To:</strong> {req.dropoff_location || req.dropoffLocation || 'N/A'}</p>
                    <p><strong>Item:</strong> {(req.item_description || req.itemDescription || '').substring(0, 50)}...</p>
                    <small>Status: {req.status || 'Pending'}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Become Driver CTA */}
        <div className="become-driver">
          <div className="driver-content">
            <div className="driver-icon">🚚</div>
            <h2>Earn While You Study on Campus</h2>
            <p>Join our community of student couriers making money on their own schedule.</p>
            <ul className="driver-benefits">
              <li>✓ Flexible hours around your classes</li>
              <li>✓ Instant payouts after every delivery</li>
              <li>✓ Exclusive campus gear & rewards</li>
            </ul>
            <button className="driver-btn" onClick={handleWhatsAppDelivery}>
              💬 Chat on WhatsApp to Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delivery;