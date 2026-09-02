import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import Accommodation from './pages/Accommodation';
import Loans from './pages/Loans';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import LearnMore from './pages/LearnMore';
import Eats from './pages/Eats';
import Tech from './pages/Tech';
import FinancialLiteracy from './pages/FinancialLiteracy';
import StudentZone from './pages/StudentZone';
import LilothoGame from './pages/LilothoGame';
import WordScrambleGame from './pages/WordScrambleGame';
import WordSearchGame from './pages/WordSearchGame';
import About from './pages/About';
import Morabaraba from './pages/Morabaraba';
import SudokuGame from './pages/SudokuGame';
import CampusMap from './pages/CampusMap';
import Marketplace from './pages/Marketplace';
import CommunitySafety from './pages/CommunitySafety';
import VendorGuidelines from './pages/VendorGuidelines';
import ProviderProfile from './pages/ProviderProfile';
import HoKallaEntry from './pages/HoKallaEntry';
import AnimationLab from './pages/animation-lab/AnimationLab';
import KopanangTest from './pages/animation-lab/KopanangTest';
import Scene01CameraTest from './pages/animation-lab/scenes/Scene01CameraTest';

import './App.css';

// Protected route wrapper for admin-only pages
function AdminRoute({ children }) {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  // Record site visit once per browser session
  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem('visit_recorded');
    if (!alreadyVisited) {
      sessionStorage.setItem('visit_recorded', 'true');
      fetch(`${process.env.REACT_APP_API_URL}/api/v1/analytics/visit?path=/`, {
        method: 'POST',
      }).catch(() => {});
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Animation Lab — UNLISTED development routes */}
          <Route path="/animation-lab" element={<AnimationLab />} />
          <Route path="/animation-lab/kopanang-test" element={<KopanangTest />} />
          <Route path="/animation-lab/scene01-camera-test" element={<Scene01CameraTest />} />

          {/* Service Pages */}
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/eats" element={<Eats />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/provider/:providerId" element={<ProviderProfile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/financial-literacy" element={<FinancialLiteracy />} />

          {/* Student Zone */}
          <Route path="/student-zone" element={<StudentZone />} />

          {/* Game pages */}
          <Route path="/student-zone/lilotho" element={<LilothoGame />} />
          <Route path="/student-zone/word-scramble" element={<WordScrambleGame />} />
          <Route path="/student-zone/word-search" element={<WordSearchGame />} />
          <Route path="/student-zone/morabaraba" element={<Morabaraba />} />
          <Route path="/student-zone/sudoku" element={<SudokuGame />} />
          <Route path="/student-zone/campus-map" element={<CampusMap />} />
          <Route path="/student-zone/hokalla" element={<HoKallaEntry />} />

          {/* Legal & Support Pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/community-safety" element={<CommunitySafety />} />
          <Route path="/vendor-guidelines" element={<VendorGuidelines />} />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="not-found-page">
                <div className="container">
                  <h1>404</h1>
                  <h2>Page Not Found</h2>
                  <p>The page you are looking for does not exist.</p>
                  <a href="/" className="home-btn">Go Back Home</a>
                </div>
              </div>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;