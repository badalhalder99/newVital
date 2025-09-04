import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
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

// Helper function to determine if current host is a subdomain
function getSubdomain() {
  const host = window.location.hostname;
  const parts = host.split('.');
  
  // For localhost development, check if subdomain exists
  if (host.includes('localhost')) {
    const subdomainMatch = host.match(/^([^.]+)\.localhost$/);
    return subdomainMatch ? subdomainMatch[1] : null;
  }
  
  // For production domains
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

function AppContent() {
  const location = useLocation();
  const subdomain = getSubdomain();
  const isSubdomainSite = !!subdomain && subdomain !== 'www';
  
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/tenant');
  const isMySaaS = location.pathname.startsWith('/mysass') || (isSubdomainSite && subdomain === 'mysass');
  const isTenantSite = location.pathname.match(/^\/[^/]+$/) || location.pathname.match(/^\/[^/]+\/(about|services|testimonials|contact)$/) || isSubdomainSite;
  
  // Only show global header/footer for main public pages (not subdomains)
  const isGlobalSite = !isSubdomainSite && (
    location.pathname === '/' || 
    location.pathname === '/about' || 
    location.pathname === '/services' || 
    location.pathname === '/contact' || 
    location.pathname === '/signin' || 
    location.pathname === '/signup' || 
    location.pathname === '/auth/success'
  );
  
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

  // Handle subdomain routing for MySaaS
  if (isSubdomainSite && subdomain === 'mysass') {
    return (
      <div className="App">
        <Routes>
          {/* MySaaS Subdomain Routes */}
          <Route 
            path="/" 
            element={
              <MySaaSLayout>
                <MySaaSHomePage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/about" 
            element={
              <MySaaSLayout>
                <MySaaSAboutPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/services" 
            element={
              <MySaaSLayout>
                <MySaaSServicesPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/products" 
            element={
              <MySaaSLayout>
                <MySaaSProductsPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/team" 
            element={
              <MySaaSLayout>
                <MySaaSTeamPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <MySaaSLayout>
                <MySaaSContactPage />
              </MySaaSLayout>
            } 
          />
          <Route 
            path="/dashboard" 
            element={<MySaaSDashboardPage />} 
          />
          <Route 
            path="/dashboard/team" 
            element={<MySaaSTeamManagement />} 
          />
          <Route 
            path="/dashboard/categories" 
            element={<MySaaSProductCategoriesManagement />} 
          />
          <Route 
            path="/dashboard/products" 
            element={<MySaaSProductsManagement />} 
          />
          <Route 
            path="/dashboard/clients" 
            element={<MySaaSClientsManagement />} 
          />
          <Route 
            path="/dashboard/certificates" 
            element={<MySaaSCertificatesManagement />} 
          />
          <Route 
            path="/dashboard/testimonials" 
            element={<MySaaSTestimonialsManagement />} 
          />
          <Route 
            path="/dashboard/users" 
            element={<MySaaSUsersManagement />} 
          />
          <Route 
            path="/dashboard/contacts" 
            element={<MySaaSContactsManagement />} 
          />
          {/* Auth Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
        </Routes>
      </div>
    );
  }

  // Handle other tenant subdomains
  if (isSubdomainSite && subdomain !== 'mysass') {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<TenantHomePage />} />
          <Route path="/about" element={<TenantPage pageType="about" />} />
          <Route path="/services" element={<TenantPage pageType="services" />} />
          <Route path="/testimonials" element={<TenantPage pageType="testimonials" />} />
          <Route path="/contact" element={<TenantPage pageType="contact" />} />
          {/* Auth Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App">
      {isGlobalSite && <Header />}
      <main className={(isDashboard || isTenantSite || isMySaaS) ? "" : "main-content"}>
        <Routes>
          {/* Global Site Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
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

          {/* MySaaS Routes (keep for backward compatibility) */}
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