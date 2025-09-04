import React, { useState } from 'react';
import '../../mysass-custom.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'General Inquiry',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
  };

  const inquiryTypes = [
    'General Inquiry',
    'Product Development',
    'Sourcing & Procurement',
    'Quality Assurance',
    'Logistics & Distribution',
    'Partnership Opportunity',
    'Other'
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero" style={{ textAlign: 'center', padding: '100px 2rem 80px' }}>
        <h1 style={{ marginBottom: '2rem' }}>
          Get In <span className="highlight">Touch</span>
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          maxWidth: '700px', 
          margin: '0 auto',
          color: 'var(--mysass-text-secondary)'
        }}>
          Ready to start your sustainable sourcing journey? We're here to help you every 
          step of the way.
        </p>
      </section>

      {/* Contact Form and Info */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2" style={{ gap: '4rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div>
            <h2 className="mysass-section-title">
              Send us a message
            </h2>
            
            <form onSubmit={handleSubmit} className="mysass-form">
              <div className="mysass-grid mysass-grid-2" style={{ gap: '1rem' }}>
                <div className="mysass-form-group">
                  <label className="mysass-form-label">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mysass-form-input"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: 'var(--mysass-text-primary)',
                      width: '100%'
                    }}
                  />
                </div>

                <div className="mysass-form-group">
                  <label className="mysass-form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mysass-form-input"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: 'var(--mysass-text-primary)',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div className="mysass-form-group">
                <label className="mysass-form-label">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mysass-form-input"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--mysass-text-primary)',
                    width: '100%'
                  }}
                />
              </div>

              <div className="mysass-form-group">
                <label className="mysass-form-label">
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="mysass-form-input"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--mysass-text-primary)',
                    width: '100%'
                  }}
                >
                  {inquiryTypes.map((type, index) => (
                    <option key={index} value={type} style={{ background: 'var(--mysass-surface)' }}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mysass-form-group">
                <label className="mysass-form-label">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mysass-form-textarea"
                  rows="6"
                  placeholder="Tell us about your project or inquiry..."
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--mysass-text-primary)',
                    width: '100%',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
              </div>

              <button
                type="submit"
                className="mysass-btn mysass-btn-primary"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>📤</span>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="mysass-section-title">
              Contact Information
            </h2>

            <div className="mysass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--mysass-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📍
                  </div>
                  <div>
                    <h4 style={{ 
                      color: 'var(--mysass-text-primary)', 
                      margin: '0 0 0.25rem 0'
                    }}>
                      Head Office
                    </h4>
                    <p style={{ 
                      color: 'var(--mysass-text-secondary)', 
                      margin: '0'
                    }}>
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--mysass-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📞
                  </div>
                  <div>
                    <h4 style={{ 
                      color: 'var(--mysass-text-primary)', 
                      margin: '0 0 0.25rem 0'
                    }}>
                      Phone
                    </h4>
                    <p style={{ 
                      color: 'var(--mysass-text-secondary)', 
                      margin: '0'
                    }}>
                      +880 13 1876 2553
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--mysass-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    ✉️
                  </div>
                  <div>
                    <h4 style={{ 
                      color: 'var(--mysass-text-primary)', 
                      margin: '0 0 0.25rem 0'
                    }}>
                      Email
                    </h4>
                    <p style={{ 
                      color: 'var(--mysass-text-secondary)', 
                      margin: '0'
                    }}>
                      marketing@harmonysourcingbd.com
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--mysass-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    🕐
                  </div>
                  <div>
                    <h4 style={{ 
                      color: 'var(--mysass-text-primary)', 
                      margin: '0 0 0.25rem 0'
                    }}>
                      Business Hours
                    </h4>
                    <p style={{ 
                      color: 'var(--mysass-text-secondary)', 
                      margin: '0'
                    }}>
                      24×7 Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Details */}
            <div className="mysass-card" style={{ 
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
            }}>
              <h3 style={{ 
                color: 'var(--mysass-text-primary)', 
                marginBottom: '1rem'
              }}>
                Our Office
              </h3>
              <p style={{ 
                color: 'var(--mysass-primary)', 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Dhaka, Bangladesh
              </p>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                margin: '0 0 1rem 0'
              }}>
                House 123, Road 456, Gulshan-2, Dhaka 1212
              </p>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                margin: '0 0 0.5rem 0'
              }}>
                +880 13 1876 2553
              </p>
              <p style={{ 
                color: 'var(--mysass-primary)', 
                margin: '0'
              }}>
                marketing@harmonysourcingbd.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Product Showcase */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Our Product Showcase</h2>
        <p className="mysass-section-subtitle">
          Explore our latest collection of sustainable and high-quality products
        </p>
        
        <div className="mysass-grid mysass-grid-3">
          {[
            { src: '/1.png', name: 'Kids Romper' },
            { src: '/7.png', name: 'Winter Jacket' },
            { src: '/3.png', name: 'Graphic Tee' }
          ].map((product, index) => (
            <div key={index} className="mysass-card" style={{ 
              textAlign: 'center', 
              padding: '3rem',
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={product.src} 
                alt={product.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}
              />
              <h4 style={{ 
                color: 'var(--mysass-text-primary)', 
                fontSize: '1.2rem',
                margin: '0'
              }}>
                {product.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
            🗺️
          </div>
          <h3 style={{ 
            color: 'var(--mysass-text-primary)', 
            marginBottom: '1rem'
          }}>
            Interactive map integration will be added here
          </h3>
          <p style={{ 
            color: 'var(--mysass-text-secondary)' 
          }}>
            Google Maps API integration required
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;