import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from database
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:3011/api/team-members?tenant=mysass');
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        } else {
          console.error('Failed to fetch team members');
          // Fallback to static data if API fails
          setTeamMembers([
            {
              name: 'Rakib Haidear',
              position: 'Retail Production',
              description: 'Work with ranch-early and fashionable',
              image: null
            },
            {
              name: 'Sourol',
              position: 'Supply Chain',
              description: 'VP management',
              image: null
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Fallback to static data if API fails
        setTeamMembers([
          {
            name: 'Rakib Haidear',
            position: 'Retail Production',
            description: 'Work with ranch-early and fashionable',
            image: null
          },
          {
            name: 'Sourol',
            position: 'Supply Chain',
            description: 'VP management',
            image: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const cultureValues = [
    {
      icon: '🤝',
      title: 'Collaboration across borders',
      description: 'We believe in harnessing the collective strength of our diverse partnerships that transcend borders, languages, and cultures.'
    },
    {
      icon: '💡',
      title: 'Innovation in sourcing and design',
      description: 'Continuously pushing the boundaries of sustainable fashion, using cutting-edge techniques and design innovations.'
    },
    {
      icon: '🔍',
      title: 'Integrity and accountability in every action',
      description: 'We maintain the highest ethical standards, ensuring transparency at every step of our sourcing chain.'
    }
  ];

  const whyWorkWithUs = [
    {
      icon: '👥',
      title: 'People First',
      description: 'We prioritize the wellbeing of our team members and partners, creating a supportive and inclusive environment.'
    },
    {
      icon: '🌍',
      title: 'Planet Protection',
      description: 'Environmental sustainability is woven into every decision we make, protecting our planet for future generations.'
    },
    {
      icon: '⭐',
      title: 'Product Excellence',
      description: 'We deliver superior quality products that meet the highest standards and exceed client expectations.'
    }
  ];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero" style={{ textAlign: 'center', padding: '100px 2rem 80px' }}>
        <h1 style={{ marginBottom: '2rem' }}>
          Meet Our <span className="highlight">Expert Team</span>
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          maxWidth: '700px', 
          margin: '0 auto',
          color: 'var(--mysass-text-secondary)'
        }}>
          Experienced professionals, global supply chain expertise. Harmony 
          Sourcing provides a transparent, reliable, and sustainable sourcing experience.
        </p>
      </section>

      {/* About Section */}
      <section className="mysass-section">
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h2 className="mysass-section-title">
              About Harmony Sourcing
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--mysass-text-secondary)',
              lineHeight: '1.7'
            }}>
              Founded with a vision to bring global buyers and suppliers together. Harmony Sourcing provides a 
              transparent, reliable, and sustainable sourcing experience. We believe in creating lasting partnerships 
              that benefit all stakeholders while protecting our planet for future generations.
            </p>
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
                src="/6.png" 
                alt="Premium Sweater"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
            <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem' }}>
              Premium Sweater Design
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Teams</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--mysass-text-secondary)' }}>
            Loading team members...
          </div>
        ) : teamMembers.filter(member => member.status === 'Active').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--mysass-text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <p>There is no team member available.</p>
          </div>
        ) : (
          <div className="mysass-grid mysass-grid-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {teamMembers
              .filter(member => member.status === 'Active')
              .sort((a, b) => a.order - b.order)
              .map((member, index) => (
                <div key={member._id || index} className="mysass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: member.image ? `url(${member.image})` : 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    margin: '0 auto 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {!member.image && (member.name ? member.name.charAt(0).toUpperCase() : '👨‍💼')}
                  </div>
                  <h3 style={{ 
                    color: 'var(--mysass-text-primary)', 
                    fontSize: '1.3rem',
                    marginBottom: '0.5rem'
                  }}>
                    {member.name}
                  </h3>
                  <p style={{ 
                    color: 'var(--mysass-primary)', 
                    fontWeight: '500',
                    marginBottom: '1rem'
                  }}>
                    {member.position}
                  </p>
                  <p style={{ 
                    color: 'var(--mysass-text-secondary)', 
                    fontSize: '0.95rem'
                  }}>
                    {member.description}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Culture & Values */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Culture & Values</h2>
        
        <div className="mysass-grid mysass-grid-3">
          {cultureValues.map((value, index) => (
            <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1.5rem',
                color: 'var(--mysass-primary)'
              }}>
                {value.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-text-primary)', 
                fontSize: '1.3rem',
                marginBottom: '1rem'
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

      {/* Why Work With Us */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Why Work With Us?</h2>
        <p className="mysass-section-subtitle">
          Because we believe in harmony — between people, planet, and products.
        </p>
        
        <div className="mysass-grid mysass-grid-3">
          {whyWorkWithUs.map((reason, index) => (
            <div key={index} className="mysass-card" style={{ 
              textAlign: 'center', 
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                borderRadius: '20px',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                {reason.icon}
              </div>
              <h3 style={{ 
                color: 'var(--mysass-text-primary)', 
                fontSize: '1.3rem',
                marginBottom: '1rem'
              }}>
                {reason.title}
              </h3>
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                lineHeight: '1.6'
              }}>
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team's Expertise in Action */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Our Team's Expertise in Action</h2>
        <p className="mysass-section-subtitle">
          See the quality and craftsmanship our team delivers across diverse fashion categories
        </p>
        
        <div className="mysass-grid mysass-grid-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {[
            { src: '/3.png', name: 'Business Wear' },
            { src: '/7.png', name: 'Casual Jacket' },
            { src: '/5.png', name: 'Premium Shorts' },
            { src: '/2.png', name: 'Evening Dress' },
            { src: '/6.png', name: 'Knit Sweater' },
            { src: '/4.png', name: 'Cotton Tee' }
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
          <h2 className="mysass-section-title" style={{ color: 'white' }}>
            Join Our Mission
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '3rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Ready to be part of a sustainable fashion future? Let's create something amazing together.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
              Get In Touch ➜
            </Link>
            <Link 
              to="/mysass/services" 
              className="mysass-btn"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                border: '2px solid white',
                fontWeight: '600',
                fontSize: '1.1rem',
                padding: '16px 34px'
              }}
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;