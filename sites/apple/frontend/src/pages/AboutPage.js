import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .about-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #fff, #f0f8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-content {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 3rem;
        }

        .about-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .section-text {
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .feature-description {
          line-height: 1.6;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .about-title {
            font-size: 2.5rem;
          }
          
          .about-content {
            padding: 2rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">About VitalApp</h1>
          <p className="about-subtitle">
            Empowering businesses with cutting-edge analytics and multi-tenant solutions for the modern web
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              VitalApp was founded with a simple yet powerful vision: to democratize advanced web analytics 
              and make enterprise-grade tracking solutions accessible to businesses of all sizes. We believe 
              that every organization deserves deep insights into their user behavior without the complexity 
              and cost barriers traditionally associated with such tools.
            </p>
          </div>

          <div className="about-section">
            <h2 className="section-title">What We Do</h2>
            <p className="section-text">
              We provide a comprehensive multi-tenant heatmap analytics platform that transforms raw visitor 
              interactions into actionable insights. Our platform combines advanced click tracking, scroll 
              depth analysis, and user behavior visualization with enterprise-grade security and scalability.
            </p>
            <p className="section-text">
              Whether you're a startup looking to understand your first users or an enterprise managing 
              multiple properties, VitalApp provides the tools and insights you need to optimize your 
              digital presence and drive meaningful growth.
            </p>
          </div>

          <div className="about-section">
            <h2 className="section-title">Our Values</h2>
            <p className="section-text">
              <strong>Innovation:</strong> We continuously push the boundaries of what's possible in web analytics, 
              incorporating the latest technologies and methodologies to deliver cutting-edge solutions.
            </p>
            <p className="section-text">
              <strong>Privacy:</strong> User privacy is paramount in everything we do. We ensure all data collection 
              and processing meets the highest standards of privacy protection and compliance.
            </p>
            <p className="section-text">
              <strong>Simplicity:</strong> Complex insights shouldn't require complex tools. We design intuitive 
              interfaces that make powerful analytics accessible to everyone.
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3 className="feature-title">Precision Analytics</h3>
            <p className="feature-description">
              Advanced algorithms provide pixel-perfect tracking and analysis of user interactions across your entire website.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h3 className="feature-title">Enterprise Security</h3>
            <p className="feature-description">
              Bank-level encryption and security protocols ensure your data is always protected and compliant.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3 className="feature-title">Lightning Performance</h3>
            <p className="feature-description">
              Optimized infrastructure delivers real-time insights without impacting your site's performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;