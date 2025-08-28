import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🌱',
      title: 'Sustainability at our core',
      description: 'Environmental responsibility in every sourcing decision, from materials to manufacturing partners.'
    },
    {
      icon: '👥',
      title: 'Expertise across all apparel categories',
      description: 'From knitwear to accessories, we handle every aspect of your supply chain with specialist knowledge.'
    },
    {
      icon: '🔗',
      title: 'End-to-end supply chain solutions',
      description: 'Complete sourcing to delivery solutions, ensuring seamless global supply chain management.'
    },
    {
      icon: '💰',
      title: 'Trusted by international brands',
      description: 'Proven track record with global partners, delivering consistent quality and reliable partnerships.'
    },
    {
      icon: '✅',
      title: 'Quality assurance & compliance',
      description: 'Rigorous testing and international standards compliance, maintaining the highest quality benchmarks.'
    },
    {
      icon: '🌍',
      title: 'Global network & local expertise',
      description: 'Worldwide reach with deep regional knowledge, connecting brands with the best manufacturing partners.'
    }
  ];

  const stats = [
    { number: '20+', label: 'Years of Experience' },
    { number: '500+', label: 'Global Partners' },
    { number: '100%', label: 'Quality Guaranteed' },
    { number: '50+', label: 'Countries Served' }
  ];

  const certifications = [
    'GOTS Certified',
    'OEKO-TEX Standard',
    'Fair Trade Verified',
    'ISO 9001:2015',
    'WRAP Certification',
    'BSCI Compliant'
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className={`mysass-hero ${isVisible ? 'mysass-fade-in' : ''}`}>
        <div className="mysass-hero-content">
          <h1>
            Sustainable Apparel Sourcing, <br />
            <span className="highlight">Seamless Global Supply</span>
          </h1>
          <p>
            Your trusted partner in ethical fashion sourcing. We connect global brands with reliable, sustainable 
            manufacturing partners, ensuring quality and responsibility throughout the supply chain.
          </p>
          <div className="mysass-cta-group">
            <Link to="/services" className="mysass-btn mysass-btn-primary">
              Explore Our Services ➜
            </Link>
            <Link to="/products" className="mysass-btn mysass-btn-secondary">
              View Our Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h2 className="mysass-section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              About Harmony Sourcing
            </h2>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Founded with a vision for revolutionary sustainable fashion sourcing, 
              Harmony Sourcing has emerged as a leading player for ethical 
              apparel manufacturing. From concept to delivery, we provide 
              comprehensive solutions that bridge the gap between brands and 
              responsible manufacturers worldwide.
            </p>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Based in Dhaka, Bangladesh, we leverage our deep understanding of 
              Asia's manufacturing capabilities while maintaining the highest 
              standards of quality, sustainability, and ethical practices. Our 
              commitment to building lasting relationships, fostering innovation, and 
              creating value for all stakeholders sets us apart in the industry.
            </p>
            <Link to="/about" className="mysass-btn mysass-btn-primary">
              Learn More About Us ➜
            </Link>
          </div>
          <div className="mysass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              🌱
            </div>
            <h3 style={{ color: 'var(--mysass-primary)', fontSize: '2rem', marginBottom: '1rem' }}>
              Sustainable Sourcing
            </h3>
            <p style={{ color: 'var(--mysass-text-secondary)' }}>
              Committed to environmental responsibility and ethical manufacturing practices
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Why Choose Harmony Sourcing?</h2>
        <div className="mysass-grid mysass-grid-3">
          {features.map((feature, index) => (
            <div key={index} className="mysass-feature mysass-card">
              <div className="mysass-feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Trusted by Leading Brands</h2>
        <p className="mysass-section-subtitle">
          Our numbers speak for themselves - years of excellence in sustainable apparel sourcing
        </p>
        <div className="mysass-stats">
          {stats.map((stat, index) => (
            <div key={index} className="mysass-stat">
              <span className="mysass-stat-number">{stat.number}</span>
              <span className="mysass-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Our Fabrics Are Certified All Along the Way</h2>
        <p className="mysass-section-subtitle">
          We maintain the highest standards of quality and sustainability through 
          internationally recognized certifications
        </p>
        <div className="mysass-grid mysass-grid-3">
          {certifications.map((cert, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--mysass-primary)',
                borderRadius: '12px',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                ✓
              </div>
              <h4 style={{ color: 'var(--mysass-text-primary)', margin: '0' }}>{cert}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Comprehensive Solutions */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Comprehensive Sourcing Solutions</h2>
        <p className="mysass-section-subtitle">
          From concept to delivery, we handle every aspect of your supply chain
        </p>
        <div className="mysass-grid mysass-grid-3">
          <div className="mysass-card">
            <h3 style={{ color: 'var(--mysass-primary)', marginBottom: '1.5rem' }}>Design & Development</h3>
            <ul style={{ color: 'var(--mysass-text-secondary)', paddingLeft: '1rem' }}>
              <li>✓ Product development</li>
              <li>✓ Sampling & prototypes</li>
              <li>✓ Tech pack creation</li>
            </ul>
          </div>
          <div className="mysass-card">
            <h3 style={{ color: 'var(--mysass-primary)', marginBottom: '1.5rem' }}>Production & QA</h3>
            <ul style={{ color: 'var(--mysass-text-secondary)', paddingLeft: '1rem' }}>
              <li>✓ On-site production</li>
              <li>✓ Independent lab testing</li>
              <li>✓ Compliance monitoring</li>
            </ul>
          </div>
          <div className="mysass-card">
            <h3 style={{ color: 'var(--mysass-primary)', marginBottom: '1.5rem' }}>Logistics & Distribution</h3>
            <ul style={{ color: 'var(--mysass-text-secondary)', paddingLeft: '1rem' }}>
              <li>✓ Freight forwarding</li>
              <li>✓ Customs clearance</li>
              <li>✓ Digital tracking</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/services" className="mysass-btn mysass-btn-primary">
            Learn More About Our Services ➜
          </Link>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
          padding: '4rem 3rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '2rem' }}>⭐⭐⭐⭐⭐</div>
          <blockquote style={{ 
            fontSize: '1.5rem', 
            fontStyle: 'italic', 
            color: 'var(--mysass-text-primary)',
            marginBottom: '2rem',
            lineHeight: '1.4'
          }}>
            "Harmony Sourcing has been our most reliable partner — 
            delivering consistent quality and on-time shipments."
          </blockquote>
          <p style={{ color: 'var(--mysass-text-secondary)', fontWeight: '500' }}>
            — Apparel Supplier Expert
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>
            Ready to Transform Your Supply Chain?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '3rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Join the growing number of brands choosing sustainable, reliable sourcing solutions
          </p>
          <Link 
            to="/contact" 
            className="mysass-btn"
            style={{ 
              background: 'white', 
              color: 'var(--mysass-primary)',
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '18px 36px'
            }}
          >
            Get Started Today ➜
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;