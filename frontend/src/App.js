import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import TenantHomePage from './pages/tenant/TenantHomePage';
import TenantPage from './pages/tenant/TenantPage';
import { useHeatmapTracking } from './hooks/useHeatmapTracking';
import screenshotService from './services/screenshotService';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/tenant');
  const isTenantSite = location.pathname.match(/^\/[^\/]+$/) || location.pathname.match(/^\/[^\/]+\/(about|services|testimonials|contact)$/);
  const isGlobalSite = location.pathname === '/' || location.pathname.includes('/signin') || location.pathname.includes('/signup') || location.pathname.includes('/auth');
  
  // Initialize heatmap tracking for all pages
  useHeatmapTracking({
    enableClicks: true,
    enableMouse: true,
    autoStart: true
  });

  // Auto-capture screenshot on first load (only for non-dashboard pages)
  useEffect(() => {
    if (!isDashboard && !isTenantSite) {
      // Add small delay to ensure page is fully rendered
      const timer = setTimeout(() => {
        screenshotService.captureViewportOnLoad(location.pathname);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isDashboard, isTenantSite]);

  return (
    <div className="App">
      {isGlobalSite && <Header />}
      <main className={(isDashboard || isTenantSite) ? "" : "main-content"}>
        <Routes>
          {/* Global Site Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tenant" 
            element={
              <ProtectedRoute requiredRole="tenant">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Tenant Website Routes */}
          <Route path="/:tenantName" element={<TenantHomePage />} />
          <Route path="/:tenantName/about" element={<TenantPage pageType="about" />} />
          <Route path="/:tenantName/services" element={<TenantPage pageType="services" />} />
          <Route path="/:tenantName/testimonials" element={<TenantPage pageType="testimonials" />} />
          <Route path="/:tenantName/contact" element={<TenantPage pageType="contact" />} />
        </Routes>
      </main>
      {isGlobalSite && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;