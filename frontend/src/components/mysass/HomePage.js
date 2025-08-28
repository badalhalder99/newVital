import React from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const HomePage = () => {
  const features = [
    {
      icon: '🌱',
      title: 'Sustainability at our core',
      description: 'Environmental responsibility in every sourcing decision, promoting eco-friendly practices throughout the supply chain.'
    },
    {
      icon: '🤝',
      title: 'Ethical partnerships',
      description: 'Building fair and transparent relationships with manufacturers and suppliers who share our values.'
    },
    {
      icon: '🔍',
      title: 'Quality assurance',
      description: 'Rigorous testing and inspection processes ensure consistent product quality and international compliance standards.'
    },
    {
      icon: '⚡',
      title: 'Fast delivery',
      description: 'Streamlined logistics and efficient supply chain management for timely delivery across global markets.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Global Partners' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Countries Served' }
  ];

  const certifications = [
    'GOTS Certified',
    'Fair Trade',
    'OEKO-TEX',
    'ISO 9001',
    'WRAP',
    'BSCI'
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'EcoFashion Co.',
      text: 'Harmony Sourcing transformed our supply chain with their sustainable approach and reliable partnerships.',
      rating: 5
    },
    {
      name: 'David Chen',
      company: 'Global Apparel Inc.',
      text: 'Outstanding service and quality. Their attention to ethical sourcing aligns perfectly with our values.',
      rating: 5
    }
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero">
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h1>
              Sustainable Apparel Sourcing, <span className="highlight">Seamless Global Supply</span>
            </h1>
            <p>
              Your trusted partner in ethical fashion sourcing. We connect global brands with reliable, sustainable manufacturing partners across Asia.
            </p>
            <div className="mysass-cta-group">
              <Link to="/mysass/services" className="mysass-btn mysass-btn-primary">
                Explore Our Services
              </Link>
              <Link to="/mysass/products" className="mysass-btn mysass-btn-secondary">
                View Our Products
              </Link>
            </div>
          </div>
          
          {/* Product Images Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/7.png" 
                alt="Premium Jacket"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Premium Jacket
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/5.png" 
                alt="Sustainable Shorts"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Sustainable Shorts
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/6.png" 
                alt="Organic Sweater"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Organic Sweater
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/3.png" 
                alt="Graphic Tee"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Graphic Tee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--mysass-text-primary)' }}>
              About Harmony Sourcing
            </h2>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Founded with a vision for revolutionary sustainable fashion sourcing, Harmony Sourcing has emerged as a leading player for ethical apparel manufacturing. From concept to delivery, we provide comprehensive solutions that bridge the gap between brands and responsible manufacturers worldwide.
            </p>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Based in Dhaka, Bangladesh, we leverage our deep understanding of Asian manufacturing capabilities while maintaining the highest standards of quality, compliance, and environmental responsibility.
            </p>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Our mission is to bridge the gap between international fashion brands and sustainable manufacturing partners, creating value for all stakeholders while protecting our planet for future generations.
            </p>
            <Link to="/mysass/about" className="mysass-btn mysass-btn-primary">
              Learn More About Us
            </Link>
          </div>
          <div className="mysass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/4.png" 
                alt="Quality T-shirt"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem' }}>
              Quality T-shirt Manufacturing
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Why Choose Harmony Sourcing?</h2>
        <div className="mysass-grid mysass-grid-4">
          {features.map((feature, index) => (
            <div key={index} className="mysass-feature">
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
        <div className="mysass-stats">
          {stats.map((stat, index) => (
            <div key={index} className="mysass-stat">
              <span className="mysass-stat-number">{stat.number}</span>
              <span className="mysass-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Trusted Certifications</h2>
        <p className="mysass-section-subtitle">
          Our commitment to quality and sustainability is validated by industry-leading certifications
        </p>
        <div className="mysass-grid mysass-grid-3">
          {certifications.map((cert, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: '700'
              }}>
                ✓
              </div>
              <h4 style={{ color: 'var(--mysass-text-primary)', margin: '0', fontSize: '1.1rem' }}>
                {cert}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">What Our Clients Say</h2>
        <div className="mysass-grid mysass-grid-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="mysass-card" style={{ padding: '3rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--mysass-primary)', fontSize: '1.5rem' }}>★</span>
                ))}
              </div>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                fontSize: '1.1rem', 
                lineHeight: '1.6', 
                marginBottom: '2rem',
                fontStyle: 'italic'
              }}>
                "{testimonial.text}"
              </p>
              <div>
                <h4 style={{ color: 'var(--mysass-text-primary)', margin: '0 0 0.5rem 0' }}>
                  {testimonial.name}
                </h4>
                <p style={{ color: 'var(--mysass-primary)', margin: '0', fontWeight: '500' }}>
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Collections Section */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Our Collections</h2>
        <p className="mysass-section-subtitle">
          Explore our diverse range of sustainable fashion products
        </p>
        
        <div className="mysass-grid mysass-grid-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {[
            { src: '/4.png', name: 'Casual Tee' },
            { src: '/7.png', name: 'Comfort Jacket' },
            { src: '/3.png', name: 'Graphic Tee' },
            { src: '/6.png', name: 'Wool Sweater' },
            { src: '/2.png', name: 'Summer Dress' },
            { src: '/1.png', name: 'Kids Romper' }
          ].map((product, index) => (
            <div key={index} className="mysass-card" style={{ 
              textAlign: 'center', 
              padding: '1.5rem 1rem',
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={product.src} 
                alt={product.name}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                fontSize: '0.85rem',
                margin: '0'
              }}>
                {product.name}
              </p>
            </div>
          ))}
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
            to="/mysass/contact" 
            className="mysass-btn"
            style={{ 
              background: 'white', 
              color: 'var(--mysass-primary)',
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '18px 36px'
            }}
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;