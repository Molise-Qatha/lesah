import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Newsletter from './components/Newsletter';
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
import StudentZone from './pages/StudentZone';
import LilothoGame from './pages/LilothoGame';
import WordScrambleGame from './pages/WordScrambleGame';
import WordSearchGame from './pages/WordSearchGame';
import MorabarabaGame from './pages/MorabarabaGame';   // ✅ new
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
  // 🔁 Record site visit once per browser session
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
          {/* Home Page – GameSection removed */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <Newsletter />
              </>
            }
          />

          {/* Service Pages */}
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/eats" element={<Eats />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/learn-more" element={<LearnMore />} />

          {/* Student Zone – hub */}
          <Route path="/student-zone" element={<StudentZone />} />

          {/* Individual game pages */}
          <Route path="/student-zone/lilotho" element={<LilothoGame />} />
          <Route path="/student-zone/word-scramble" element={<WordScrambleGame />} />
          <Route path="/student-zone/word-search" element={<WordSearchGame />} />
          <Route path="/student-zone/morabaraba" element={<MorabarabaGame />} />

          {/* Legal & Support Pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect to home (404 handling) */}
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