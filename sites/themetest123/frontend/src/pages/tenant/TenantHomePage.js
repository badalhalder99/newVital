import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TenantLayout from '../../components/tenant/TenantLayout';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import api from '../../services/api';

const TenantHomePage = () => {
  const { tenantName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await api.get(`/api/tenant-website/${tenantName}`);
        if (response.data.success) {
          setTenantData(response.data.data.tenant);
          setSettings(response.data.data.settings);
          setPageContent(response.data.data.page);
          setTestimonials(response.data.data.testimonials || []);
        } else {
          setError('Tenant not found');
        }
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    if (tenantName) {
      fetchTenantData();
    }
  }, [tenantName]);

  if (loading) {
    return (
      <div className="tenant-loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="tenant-error">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const siteName = settings?.site_name || tenantData?.name || 'Your Business';
  const primaryColor = settings?.primary_color || '#10b981';

  return (
    <TenantLayout tenantData={tenantData} settings={settings}>
      {/* Hero Section */}
      <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
        <div className="container mx-auto px-4">
          <div className="tenant-hero tenant-glass">
            <div className="tenant-hero-content">
              <h1>
                {pageContent?.title || 'Welcome to'}{' '}
                <span className="highlight">{siteName}</span>
              </h1>
              <p>
                {pageContent?.content || settings?.site_tagline || 
                'Your trusted partner for quality solutions. We provide exceptional services tailored to your needs.'}
              </p>
              <div className="tenant-hero-buttons">
                <a href={`/${tenantName}/services`} className="tenant-cta-button">
                  Our Services
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </a>
                <a href={`/${tenantName}/contact`} className="tenant-cta-button tenant-cta-secondary">
                  Get In Touch
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-green-500/10 rounded-full mx-auto flex items-center justify-center border-2 border-green-500/20">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <div className="text-white font-semibold">Quality</div>
                  <div className="text-green-300 text-sm">Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose {siteName}?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We provide comprehensive solutions tailored to your specific needs
            </p>
          </div>
          <div className="tenant-features">
            <div className="tenant-feature-card tenant-glass">
              <div className="tenant-feature-icon">
                <CheckCircle className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              <h3>Quality Assured</h3>
              <p>We maintain the highest standards in all our services and deliverables.</p>
            </div>
            <div className="tenant-feature-card tenant-glass">
              <div className="tenant-feature-icon">
                <Star className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              <h3>Expert Team</h3>
              <p>Our experienced professionals bring expertise and dedication to every project.</p>
            </div>
            <div className="tenant-feature-card tenant-glass">
              <div className="tenant-feature-icon">
                <ArrowRight className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              <h3>Results Driven</h3>
              <p>We focus on delivering tangible results that drive your business forward.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive solutions designed to meet your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="tenant-glass-green p-8">
              <h3 className="text-xl font-bold text-white mb-4">Consulting</h3>
              <ul className="space-y-3 text-white/80 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Strategic planning
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Business analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Process optimization
                </li>
              </ul>
            </div>
            
            <div className="tenant-glass-green p-8">
              <h3 className="text-xl font-bold text-white mb-4">Implementation</h3>
              <ul className="space-y-3 text-white/80 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Project management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Quality assurance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Timeline delivery
                </li>
              </ul>
            </div>
            
            <div className="tenant-glass-green p-8">
              <h3 className="text-xl font-bold text-white mb-4">Support</h3>
              <ul className="space-y-3 text-white/80 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  24/7 assistance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Maintenance services
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                  Ongoing optimization
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <a href={`/${tenantName}/services`} className="tenant-cta-button">
              Learn More About Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
          <div className="container mx-auto px-4">
            <div className="tenant-glass text-center p-12">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonials[0].rating || 5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-yellow-300 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-white mb-6">
                  "{testimonials[0].quote}"
                </blockquote>
                <cite className="text-lg" style={{ color: primaryColor }}>
                  — {testimonials[0].name}, {testimonials[0].company}
                </cite>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
        <div className="container mx-auto px-4">
          <div className="tenant-glass text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how we can help your business grow
            </p>
            <a href={`/${tenantName}/contact`} className="tenant-cta-button">
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </TenantLayout>
  );
};

export default TenantHomePage;