import React from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const ServicesPage = () => {
  const services = [
    {
      title: 'Product Development',
      description: 'From concept to production-ready designs, we guide your products through every development stage.',
      features: ['Design consultation', 'Technical specifications', 'Sample development', 'Material sourcing'],
      icon: '🎨'
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control measures ensure your products meet international standards.',
      features: ['Pre-production inspection', 'In-line quality checks', 'Final product testing', 'Compliance verification'],
      icon: '✅'
    },
    {
      title: 'Sustainable Sourcing',
      description: 'Ethical and environmentally responsible sourcing solutions for conscious fashion brands.',
      features: ['Certified organic materials', 'Fair trade partnerships', 'Carbon footprint reduction', 'Waste minimization'],
      icon: '🌱'
    },
    {
      title: 'Supply Chain Management',
      description: 'End-to-end supply chain solutions that streamline your manufacturing process.',
      features: ['Vendor management', 'Production planning', 'Logistics coordination', 'Inventory optimization'],
      icon: '🔗'
    },
    {
      title: 'Manufacturing Excellence',
      description: 'Partner with certified factories that deliver consistent quality and reliable production.',
      features: ['Factory auditing', 'Production monitoring', 'Capacity planning', 'Timeline management'],
      icon: '🏭'
    },
    {
      title: 'Global Logistics',
      description: 'Comprehensive shipping and logistics services to get your products to market efficiently.',
      features: ['International shipping', 'Customs clearance', 'Documentation', 'Delivery tracking'],
      icon: '🚢'
    }
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero" style={{ textAlign: 'center', padding: '100px 2rem 80px' }}>
        <h1 style={{ marginBottom: '2rem' }}>
          Our <span className="highlight">Services</span>
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          maxWidth: '700px', 
          margin: '0 auto',
          color: 'var(--mysass-text-secondary)'
        }}>
          Comprehensive sourcing solutions designed to transform your fashion supply chain 
          with sustainability and excellence at every step.
        </p>
      </section>

      {/* Services Grid */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2">
          {services.map((service, index) => (
            <div key={index} className="mysass-card" style={{ padding: '3rem' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {service.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-primary)', 
                fontSize: '1.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {service.title}
              </h3>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                marginBottom: '2rem',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                {service.description}
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: '0', 
                margin: '0'
              }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{ 
                    color: 'var(--mysass-text-secondary)',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: 'var(--mysass-primary)' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Our Process</h2>
        <p className="mysass-section-subtitle">
          A proven methodology that ensures success from concept to delivery
        </p>
        
        <div className="mysass-grid mysass-grid-4">
          {[
            { step: '01', title: 'Consultation', description: 'Understanding your needs and requirements' },
            { step: '02', title: 'Planning', description: 'Developing a comprehensive sourcing strategy' },
            { step: '03', title: 'Execution', description: 'Managing production and quality control' },
            { step: '04', title: 'Delivery', description: 'Ensuring timely and reliable delivery' }
          ].map((process, index) => (
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
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {process.step}
              </div>
              <h4 style={{ 
                color: 'var(--mysass-text-primary)', 
                marginBottom: '1rem',
                fontSize: '1.2rem'
              }}>
                {process.title}
              </h4>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                margin: '0',
                fontSize: '0.95rem'
              }}>
                {process.description}
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
            Ready to Get Started?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '3rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Let's discuss how our services can transform your supply chain
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
            Contact Us Today ➜
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;