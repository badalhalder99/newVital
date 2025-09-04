import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const TenantHeader = ({ tenantData, settings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { tenantName: urlTenantName } = useParams();

  // Helper function to get tenant name from subdomain or URL params
  const getTenantName = () => {
    const host = window.location.hostname;
    if (host.includes('localhost')) {
      const subdomainMatch = host.match(/^([^.]+)\.localhost$/);
      if (subdomainMatch && subdomainMatch[1] !== 'www') {
        return subdomainMatch[1];
      }
    } else {
      const parts = host.split('.');
      if (parts.length > 2 && parts[0] !== 'www') {
        return parts[0];
      }
    }
    return urlTenantName;
  };

  const tenantName = getTenantName();
  
  // Check if we're on a subdomain
  const isSubdomain = () => {
    const host = window.location.hostname;
    if (host.includes('localhost')) {
      return host.match(/^([^.]+)\.localhost$/) !== null;
    }
    return host.split('.').length > 2;
  };

  const siteName = settings?.site_name || tenantData?.name || 'Your Business';
  const primaryColor = settings?.primary_color || '#10b981';

  // Build navigation URLs based on subdomain vs path-based routing
  const navigation = isSubdomain() ? [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact' }
  ] : [
    { name: 'Home', href: `/${tenantName}` },
    { name: 'About', href: `/${tenantName}/about` },
    { name: 'Services', href: `/${tenantName}/services` },
    { name: 'Testimonials', href: `/${tenantName}/testimonials` },
    { name: 'Contact', href: `/${tenantName}/contact` }
  ];

  return (
    <header className="tenant-header" style={{ '--primary-color': primaryColor }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to={isSubdomain() ? '/' : `/${tenantName}`} className="tenant-brand">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={siteName}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="tenant-logo-placeholder">
                  <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                    {siteName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="ml-3 text-xl font-bold text-white">
                {siteName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="tenant-nav-link"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="tenant-mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TenantHeader;