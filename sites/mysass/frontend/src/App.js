import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MySaaSLayout from './components/layout/MySaaSLayout';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import DashboardPage from './components/pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useHeatmapTracking } from './hooks/useHeatmapTracking';
import screenshotService from './services/screenshotService';
import './App.css';
import './styles/mysass-custom.css';

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
      <Routes>
        {/* MySaaS Website Routes - wrapped with layout */}
        <Route path="/" element={<MySaaSLayout><HomePage /></MySaaSLayout>} />
        <Route path="/about" element={<MySaaSLayout><AboutPage /></MySaaSLayout>} />
        <Route path="/services" element={<MySaaSLayout><ServicesPage /></MySaaSLayout>} />
        <Route path="/products" element={<MySaaSLayout><div>Products Page Coming Soon</div></MySaaSLayout>} />
        <Route path="/team" element={<MySaaSLayout><div>Team Page Coming Soon</div></MySaaSLayout>} />
        <Route path="/contact" element={<MySaaSLayout><div>Contact Page Coming Soon</div></MySaaSLayout>} />
        
        {/* Auth Routes - no layout */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        
        {/* Dashboard Routes - no layout */}
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
      </Routes>
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