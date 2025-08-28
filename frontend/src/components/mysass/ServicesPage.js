import React from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const ServicesPage = () => {
  const coreServices = [
    {
      title: 'Design & Development',
      description: 'From concept to reality, taking your vision to life with precision and care across product lines.',
      features: [
        'Trend research & trend boards',
        'Technical specifications',
        'Tech pack development',
        'Prototype creation & grading',
        'Fabric development',
        'Color matching services',
        '3D & pattern',
        'Fabric & design QA'
      ],
      icon: '🎨',
      color: 'var(--mysass-primary)'
    },
    {
      title: 'Sourcing & Procurement',
      description: 'Access to our expert network of suppliers and comprehensive vendor management solutions.',
      features: [
        'Access to vetted supplier network',
        'Fabric & trim sourcing',
        'Cost negotiation & optimization',
        'Vendor compliance management',
        'Supply chain risk assessment',
        'Alternative supplier identification'
      ],
      icon: '🔍',
      color: 'var(--mysass-accent-cyan)'
    },
    {
      title: 'Production & Quality Assurance',
      description: 'End-to-end quality control with international safety standards to meet exceptional quality.',
      features: [
        'On-site inspections at every stage',
        'Quality control standards',
        'Compliance with international standards',
        'Pre-production approval',
        'In-line quality monitoring',
        'Final inspection & reporting'
      ],
      icon: '✅',
      color: 'var(--mysass-accent-purple)'
    },
    {
      title: 'Logistics & Distribution',
      description: 'End-to-end logistics solutions for seamless global delivery from factory to your customers.',
      features: [
        'Global forwarding & customs clearance',
        'Dock-to-door delivery solutions',
        'Order consolidation',
        'Consolidation services',
        'Last-mile logistics solutions'
      ],
      icon: '🚢',
      color: 'var(--mysass-accent-orange)'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Concept',
      description: 'Understanding your vision and requirements through detailed consultation.',
      color: 'var(--mysass-primary)'
    },
    {
      step: '02',
      title: 'Connect',
      description: 'Linking you with our network of trusted manufacturing partners.',
      color: 'var(--mysass-accent-blue)'
    },
    {
      step: '03',
      title: 'Production',
      description: 'Overseeing manufacturing with rigorous quality control measures.',
      color: 'var(--mysass-accent-purple)'
    },
    {
      step: '04',
      title: 'Quality',
      description: 'Comprehensive testing and final inspection before shipment.',
      color: 'var(--mysass-accent-cyan)'
    },
    {
      step: '05',
      title: 'Delivery',
      description: 'Global logistics and on-time delivery to your destination.',
      color: 'var(--mysass-accent-orange)'
    }
  ];

  const additionalServices = [
    {
      title: 'Supply Chain Analytics',
      description: 'Data-driven insights to optimize your supply chain performance and reduce costs.',
      icon: '📊'
    },
    {
      title: 'Global Compliance',
      description: 'Ensure your products meet all regulatory requirements across international markets.',
      icon: '🌍'
    },
    {
      title: 'Process Optimization',
      description: 'Streamline your manufacturing processes for enhanced efficiency and quality.',
      icon: '⚙️'
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
          Comprehensive design and development solutions tailored to your needs. From 
          concept to delivery, we handle every aspect of your supply chain.
        </p>
      </section>

      {/* Core Services */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Core Services</h2>
        <p className="mysass-section-subtitle">
          End-to-end solutions for sustainable apparel manufacturing
        </p>
        
        <div className="mysass-grid mysass-grid-2">
          {coreServices.map((service, index) => (
            <div key={index} className="mysass-card" style={{ padding: '3rem' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1.5rem',
                color: service.color
              }}>
                {service.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-primary)', 
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                {service.title}
              </h3>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                marginBottom: '2rem',
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
          A streamlined approach from concept to delivery
        </p>
        
        <div className="mysass-grid mysass-grid-4" style={{ marginBottom: '2rem' }}>
          {processSteps.map((process, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: process.color,
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

      {/* Additional Services */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Additional Services</h2>
        <p className="mysass-section-subtitle">
          Specialized solutions to enhance your supply chain
        </p>
        
        <div className="mysass-grid mysass-grid-3">
          {additionalServices.map((service, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                color: 'var(--mysass-primary)'
              }}>
                {service.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-text-primary)', 
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                {service.title}
              </h3>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                lineHeight: '1.6'
              }}>
                {service.description}
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
            Contact Us Today ➜
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;