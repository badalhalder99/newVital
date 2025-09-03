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
// MySaaS Components
import MySaaSLayout from './components/mysass/MySaaSLayout';
import MySaaSHomePage from './components/mysass/HomePage';
import MySaaSAboutPage from './components/mysass/AboutPage';
import MySaaSServicesPage from './components/mysass/ServicesPage';
import MySaaSProductsPage from './components/mysass/ProductsPage';
import MySaaSTeamPage from './components/mysass/TeamPage';
import MySaaSContactPage from './components/mysass/ContactPage';
import MySaaSDashboardPage from './components/mysass/DashboardPage';
import MySaaSTeamManagement from './components/mysass/TeamManagement';
import MySaaSProductCategoriesManagement from './components/mysass/ProductCategoriesManagement';
import MySaaSProductsManagement from './components/mysass/ProductsManagement';
import MySaaSClientsManagement from './components/mysass/ClientsManagement';
import MySaaSCertificatesManagement from './components/mysass/CertificatesManagement';
import MySaaSTestimonialsManagement from './components/mysass/TestimonialsManagement';
import MySaaSUsersManagement from './components/mysass/UsersManagement';
import MySaaSContactsManagement from './components/mysass/ContactsManagement';
import ScrollToTop from './components/ScrollToTop';
import { useHeatmapTracking } from './hooks/useHeatmapTracking';
import screenshotService from './services/screenshotService';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/tenant');
  const isMySaaS = location.pathname.startsWith('/mysass');
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
    if (!isDashboard && !isTenantSite && !isMySaaS) {
      // Add small delay to ensure page is fully rendered
      const timer = setTimeout(() => {
        screenshotService.captureViewportOnLoad(location.pathname);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isDashboard, isTenantSite, isMySaaS]);

  return (
    <div className="App">
      {isGlobalSite && <Header />}
      <main className={(isDashboard || isTenantSite || isMySaaS) ? "" : "main-content"}>
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

          {/* MySaaS Routes */}
          <Route 
            path="/mysass" 
            element={
              <MySaaSLayout>
                <MySaaSHomePage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/about" 
            element={
              <MySaaSLayout>
                <MySaaSAboutPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/services" 
            element={
              <MySaaSLayout>
                <MySaaSServicesPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/products" 
            element={
              <MySaaSLayout>
                <MySaaSProductsPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/team" 
            element={
              <MySaaSLayout>
                <MySaaSTeamPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/contact" 
            element={
              <MySaaSLayout>
                <MySaaSContactPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/mysass/dashboard" 
            element={<MySaaSDashboardPage />} 
          />
          <Route 
            path="/mysass/dashboard/team" 
            element={<MySaaSTeamManagement />} 
          />
          <Route 
            path="/mysass/dashboard/categories" 
            element={<MySaaSProductCategoriesManagement />} 
          />
          <Route 
            path="/mysass/dashboard/products" 
            element={<MySaaSProductsManagement />} 
          />
          <Route 
            path="/mysass/dashboard/clients" 
            element={<MySaaSClientsManagement />} 
          />
          <Route 
            path="/mysass/dashboard/certificates" 
            element={<MySaaSCertificatesManagement />} 
          />
          <Route 
            path="/mysass/dashboard/testimonials" 
            element={<MySaaSTestimonialsManagement />} 
          />
          <Route 
            path="/mysass/dashboard/users" 
            element={<MySaaSUsersManagement />} 
          />
          <Route 
            path="/mysass/dashboard/contacts" 
            element={<MySaaSContactsManagement />} 
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
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;