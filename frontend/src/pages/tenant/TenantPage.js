import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TenantLayout from '../../components/tenant/TenantLayout';
import api from '../../services/api';

const TenantPage = ({ pageType = 'home' }) => {
  const { tenantName: urlTenantName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  // Helper function to get tenant name from subdomain or URL params
  const getTenantName = () => {
    // Check if we're on a subdomain first
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
    
    // Fallback to URL params (for path-based routing)
    return urlTenantName;
  };

  const tenantName = getTenantName();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        let url = `/api/tenant-website/${tenantName}`;
        if (pageType !== 'home') {
          url = `/api/tenant-website/${tenantName}/${pageType}`;
        }
        
        const response = await api.get(url);
        if (response.data.success) {
          setTenantData(response.data.data.tenant);
          setSettings(response.data.data.settings);
          setPageContent(response.data.data.page);
          setTestimonials(response.data.data.testimonials || []);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        if (err.response?.status === 404) {
          setError('Tenant not found');
        } else {
          setError('Failed to load page data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tenantName) {
      fetchTenantData();
    }
  }, [tenantName, pageType]);

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

  const getDefaultContent = () => {
    switch (pageType) {
      case 'about':
        return {
          title: `About ${siteName}`,
          content: `Welcome to ${siteName}. We are dedicated to providing exceptional services and solutions to our clients. Our team of professionals is committed to excellence and delivering results that exceed expectations.`
        };
      case 'services':
        return {
          title: 'Our Services',
          content: `At ${siteName}, we offer a comprehensive range of services designed to meet your needs. Our expert team works closely with you to deliver customized solutions that drive results.`
        };
      case 'contact':
        return {
          title: 'Contact Us',
          content: `Get in touch with ${siteName}. We'd love to hear from you and discuss how we can help with your needs.`
        };
      case 'testimonials':
        return {
          title: 'What Our Clients Say',
          content: `See what our satisfied clients have to say about working with ${siteName}.`
        };
      default:
        return {
          title: `Welcome to ${siteName}`,
          content: `Welcome to our website. We're here to serve you with quality and dedication.`
        };
    }
  };

  const content = pageContent || getDefaultContent();

  return (
    <TenantLayout tenantData={tenantData} settings={settings}>
      <section className="tenant-section" style={{ '--primary-color': primaryColor }}>
        <div className="container mx-auto px-4">
          <div className="tenant-glass">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {content.title}
              </h1>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div 
                className="text-lg text-white/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>

            {/* Contact Form for Contact Page */}
            {pageType === 'contact' && (
              <div className="mt-12 max-w-2xl mx-auto">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Message</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400 resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="tenant-cta-button w-full"
                  >
                    Send Message
                  </button>
                </form>
                
                {/* Contact Information */}
                {(settings?.contact_email || settings?.contact_phone || settings?.address) && (
                  <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                    <div className="space-y-4 text-white/80">
                      {settings.contact_email && (
                        <p>Email: <a href={`mailto:${settings.contact_email}`} className="text-green-300 hover:text-green-200">{settings.contact_email}</a></p>
                      )}
                      {settings.contact_phone && (
                        <p>Phone: <a href={`tel:${settings.contact_phone}`} className="text-green-300 hover:text-green-200">{settings.contact_phone}</a></p>
                      )}
                      {settings.address && (
                        <p>Address: {settings.address}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials for Testimonials Page */}
            {pageType === 'testimonials' && testimonials.length > 0 && (
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="tenant-glass p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <span key={i} className="text-yellow-300 text-lg">★</span>
                        ))}
                      </div>
                      <blockquote className="text-white/90 mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-green-300 font-medium">
                        — {testimonial.name}
                        {testimonial.company && <span className="text-white/60">, {testimonial.company}</span>}
                      </cite>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </TenantLayout>
  );
};

export default TenantPage;