import React from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const AboutPage = () => {
  const sustainabilityGoals = [
    {
      title: 'Reduce CO₂ footprint by 30% by 2030',
      progress: 65,
      description: 'Implementing renewable energy and sustainable manufacturing practices'
    },
    {
      title: '100% of fabrics sourced from certified suppliers',
      progress: 84,
      description: 'Working with GOTS and OEKO-TEX certified fabric suppliers'
    },
    {
      title: 'Zero hazardous chemicals in production',
      progress: 92,
      description: 'Strict chemical management and testing protocols'
    }
  ];

  const ethicalValues = [
    {
      icon: '👥',
      title: 'Fair Wages and Safe Working Conditions',
      description: 'Ensuring fair compensation for all workers in our manufacturing network and maintaining safe working environments.'
    },
    {
      icon: '🔍',
      title: 'Third-party Audits (BSCI Rated)',
      description: 'Regular independent audits to maintain the highest ethical standards across all our partner facilities.'
    },
    {
      icon: '🏭',
      title: 'Partnership with Compliant Factories',
      description: 'Working exclusively with certified factories that uphold international labor and safety standards.'
    }
  ];

  const certifications = [
    'GOTS Certification',
    'OEKO-TEX Standard 100',
    'Fair Trade Verified',
    'ISO 9001:2015',
    'WRAP Certification',
    'BSCI Compliant'
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero" style={{ textAlign: 'center', padding: '100px 2rem 80px' }}>
        <h1 style={{ marginBottom: '2rem' }}>
          <span className="highlight">Sustainability & Values</span>
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          maxWidth: '700px', 
          margin: '0 auto',
          color: 'var(--mysass-text-secondary)'
        }}>
          Creating sustainable sourcing solutions that respect people, protect the planet, 
          and empower global fashion brands to build a better future.
        </p>
      </section>

      {/* Our Mission */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          margin: '0 auto',
          padding: '4rem 3rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
        }}>
          <h2 className="mysass-section-title">
            Our Mission
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--mysass-text-secondary)',
            lineHeight: '1.7'
          }}>
            To create sustainable sourcing solutions that respect people, protect the 
            planet, and empower global fashion brands to build a better future.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h2 className="mysass-section-title" style={{ color: 'var(--mysass-primary)' }}>
              Our Story: Seasoned Professionals, Fresh Vision
            </h2>
            <div style={{ color: 'var(--mysass-text-secondary)', fontSize: '1.1rem', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Harmony Sourcing was born from a vision that took shape over 
                decades of industry experience. Each member of our founding 
                team brought their expertise from different corners of the 
                apparel world - from fabric sourcing to manufacturing, from 
                compliance to ethical apparel sourcing, having witnessed 
                firsthand the urgent need for change in the fashion industry.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                After decades of working with major brands and suppliers across 
                Asia, our team recognized that the traditional model of fashion 
                sourcing was due for a transformation. We witnessed practices 
                that prioritized profit over people and planet, and we knew 
                we needed to build something different. A sourcing company that provides 
                comprehensive services while prioritizing sustainability and 
                ethical practices above all else.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Our collective decades-long experience has equipped us with 
                deep industry knowledge, fostering innovation, and understanding 
                of international business practices, and the commitment to 
                change. We've built relationships with manufacturers across 
                continents, established quality systems that exceed industry 
                standards, fostering innovation, and building value for our 
                partners beyond conventional limits.
              </p>
              <p>
                Today, as a true company with seasoned professionals at the 
                helm, we're combining decades of international sourcing 
                knowledge with fresh thinking, sustainable practices, and 
                technology-driven approach to reshape the entire industry, 
                navigating the evolving landscape of sustainable fashion sourcing.
              </p>
            </div>
          </div>
          <div className="mysass-card" style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))'
          }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              margin: '0 auto 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <img 
                src="/7.png" 
                alt="Premium Jacket"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: 'white', 
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              20+ Years
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
              Industry Experience
            </p>
          </div>
        </div>
      </section>

      {/* Sustainability Goals */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Sustainability Goals</h2>
        <p className="mysass-section-subtitle">
          Measurable commitments toward a more sustainable future
        </p>
        
        <div className="mysass-grid mysass-grid-3">
          {sustainabilityGoals.map((goal, index) => (
            <div key={index} className="mysass-card">
              <h3 style={{ 
                color: 'var(--mysass-primary)', 
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                {goal.title}
              </h3>
              <div className="mysass-progress">
                <div 
                  className="mysass-progress-bar" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                fontSize: '0.95rem',
                marginTop: '1rem'
              }}>
                {goal.progress}% - {goal.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical Supply Chain */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Ethical Supply Chain</h2>
        <p className="mysass-section-subtitle">
          Ensuring human rights and fair practices throughout our network
        </p>
        
        <div className="mysass-grid mysass-grid-3">
          {ethicalValues.map((value, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1.5rem'
              }}>
                {value.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-text-primary)', 
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                {value.title}
              </h3>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                lineHeight: '1.6'
              }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Certifications & Partnerships</h2>
        <p className="mysass-section-subtitle">
          Recognized standards and trusted partnerships that validate our commitment
        </p>
        
        <div className="mysass-grid mysass-grid-3" style={{ marginBottom: '4rem' }}>
          {certifications.map((cert, index) => (
            <div key={index} className="mysass-card" style={{ 
              textAlign: 'center', 
              padding: '2rem',
              transition: 'all 0.3s ease'
            }}>
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
              <h4 style={{ 
                color: 'var(--mysass-text-primary)', 
                margin: '0',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {cert}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Our Sustainable Collections */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Our Sustainable Collections</h2>
        <p className="mysass-section-subtitle">
          Showcasing our commitment to sustainable fashion through diverse product ranges
        </p>
        
        <div className="mysass-grid mysass-grid-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {[
            { src: '/7.png', name: 'Eco Jacket' },
            { src: '/5.png', name: 'Sustainable Shorts' },
            { src: '/4.png', name: 'Organic Tee' },
            { src: '/6.png', name: 'Wool Sweater' },
            { src: '/2.png', name: 'Casual Dress' },
            { src: '/3.png', name: 'Graphic Tee' }
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

      {/* Call to Action */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'linear-gradient(135deg, var(--mysass-surface), var(--mysass-card))',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 className="mysass-section-title">
            Join Our Sustainability Journey
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--mysass-text-secondary)',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            Partner with us to create a more sustainable and ethical fashion industry
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/mysass/contact" className="mysass-btn mysass-btn-primary">
              Become a Partner ➜
            </Link>
            <Link to="/mysass/services" className="mysass-btn mysass-btn-secondary">
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;