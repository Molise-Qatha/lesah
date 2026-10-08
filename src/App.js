import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminAnalytics from './pages/AdminAnalytics';
import AdminVendors from './pages/AdminVendors';
import LearnMore from './pages/LearnMore';
import Eats from './pages/Eats';
import Tech from './pages/Tech';
import FinancialLiteracy from './pages/FinancialLiteracy';
import FinancialLiteracyAI from './pages/FinancialLiteracyAI';
import StudentZone from './pages/StudentZone';
import LilothoGame from './pages/LilothoGame';
import WordScrambleGame from './pages/WordScrambleGame';
import WordSearchGame from './pages/WordSearchGame';
import About from './pages/About';
import Morabaraba from './pages/Morabaraba';
import SudokuGame from './pages/SudokuGame';
import CampusMap from './pages/CampusMap';
import Marketplace from './pages/Marketplace';
import ProductPage from './pages/ProductPage';
import ServicePage from './pages/ServicePage';
import CommunitySafety from './pages/CommunitySafety';
import VendorGuidelines from './pages/VendorGuidelines';
import ProviderRouter from './pages/ProviderRouter';
import HoKallaEntry from './pages/HoKallaEntry';
import AnimationLab from './pages/animation-lab/AnimationLab';
import KopanangTest from './pages/animation-lab/KopanangTest';
import SelibaSaTsebo from './pages/SelibaSaTsebo';
import Scene01CameraTest from './pages/animation-lab/scenes/Scene01CameraTest';
import SelibaUpload from './pages/seliba/SelibaUpload';
import SelibaAdminQueue from './pages/seliba/SelibaAdminQueue';
import MultiplayerTest from './pages/MultiplayerTest';
import VendorRegister from './pages/VendorRegister';
import VendorDashboard from './pages/VendorDashboard';
import { logPageVisit } from './data/analytics';
import { supabase } from './lib/supabaseClient';

import './App.css';

// ---------- Admin email whitelist ----------
// Add more admin emails here as needed.
const ADMIN_EMAILS = ['customaryqatha@gmail.com'];

// ---------- Page-visit tracker ----------
function RouteAnalytics() {
  const location = useLocation();
  useEffect(() => {
    logPageVisit(location.pathname);
  }, [location.pathname]);
  return null;
}

// ---------- Layout ----------
function AppLayout({ children }) {
  const location = useLocation();
  const isSceneTest = location.pathname === '/animation-lab/scene01-camera-test';
  const isAIChat = location.pathname === '/financial-literacy';

  return (
    <div className="App">
      {!isSceneTest && <Header />}
      <RouteAnalytics />
      {children}
      {!isSceneTest && !isAIChat && <Footer />}
    </div>
  );
}

// ---------- Admin gate (Supabase session + email whitelist) ----------
function AdminRoute({ children }) {
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    let mounted = true;

    async function check(session) {
      const email = session?.user?.email;
      const isAdmin = !!email && ADMIN_EMAILS.includes(email);
      if (mounted) setState({ loading: false, isAdmin });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) check(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) check(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (state.loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading...
      </div>
    );
  }

  if (!state.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ---------- App ----------
function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Animation Lab — UNLISTED development routes */}
          <Route path="/animation-lab" element={<AnimationLab />} />
          <Route path="/animation-lab/kopanang" element={<KopanangTest />} />
          <Route path="/animation-lab/scene01-camera-test" element={<Scene01CameraTest />} />
          <Route path="/multiplayer-test" element={<MultiplayerTest />} />
          <Route path="/multiplayer-test/play/:roomCode" element={<MultiplayerTest />} />

          {/* Service Pages */}
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/eats" element={<Eats />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/provider/:providerId" element={<ProviderRouter />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/services" element={<Navigate to="/marketplace" replace />} />
          <Route path="/services/:serviceId" element={<ServicePage />} />

          {/* Financial Literacy — AI chat is main, lessons live at /learn */}
          <Route path="/financial-literacy" element={<FinancialLiteracyAI />} />
          <Route path="/financial-literacy/learn" element={<FinancialLiteracy />} />

          {/* Student Zone */}
          <Route path="/student-zone" element={<StudentZone />} />
          <Route path="/student-zone/lilotho" element={<LilothoGame />} />
          <Route path="/student-zone/word-scramble" element={<WordScrambleGame />} />
          <Route path="/student-zone/word-search" element={<WordSearchGame />} />
          <Route path="/student-zone/morabaraba" element={<Morabaraba />} />
          <Route path="/student-zone/sudoku" element={<SudokuGame />} />
          <Route path="/student-zone/campus-map" element={<CampusMap />} />
          <Route path="/student-zone/hokalla" element={<HoKallaEntry />} />

          <Route path="/student-zone/seliba-sa-tsebo" element={<SelibaSaTsebo />} />
          <Route path="/student-zone/seliba-sa-tsebo/upload" element={<SelibaUpload />} />
          <Route path="/student-zone/seliba-sa-tsebo/admin" element={<SelibaAdminQueue />} />

          {/* Vendor */}
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />

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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <AdminRoute>
                <AdminVendors />
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
      </AppLayout>
    </Router>
  );
}

export default App;