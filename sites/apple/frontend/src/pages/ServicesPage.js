import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    {
      icon: '🔥',
      title: 'Heatmap Analytics',
      description: 'Visualize user interactions with comprehensive heatmaps showing clicks, taps, and cursor movement patterns.',
      features: ['Click tracking', 'Scroll depth analysis', 'Mobile touch tracking', 'Real-time updates']
    },
    {
      icon: '📊',
      title: 'Behavioral Analytics',
      description: 'Deep insights into user behavior patterns, session recordings, and conversion funnel analysis.',
      features: ['Session recordings', 'Funnel analysis', 'User journey mapping', 'Conversion optimization']
    },
    {
      icon: '🏢',
      title: 'Multi-Tenant Management',
      description: 'Enterprise-grade multi-tenant architecture allowing multiple organizations to use isolated environments.',
      features: ['Tenant isolation', 'Custom branding', 'Role-based access', 'Scalable infrastructure']
    },
    {
      icon: '📱',
      title: 'Cross-Platform Tracking',
      description: 'Unified analytics across desktop, tablet, and mobile devices with responsive tracking capabilities.',
      features: ['Responsive design', 'Mobile optimization', 'Cross-device tracking', 'Touch interaction analysis']
    },
    {
      icon: '⚡',
      title: 'Real-Time Monitoring',
      description: 'Live tracking and monitoring of user interactions with instant notifications and alerts.',
      features: ['Live tracking', 'Real-time alerts', 'Instant notifications', 'Performance monitoring']
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Advanced security features including data encryption, compliance, and privacy protection.',
      features: ['Data encryption', 'GDPR compliance', 'Privacy protection', 'Secure API access']
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 10,000 page views',
        'Basic heatmap analytics',
        '1 website tracking',
        'Email support',
        'Basic reporting'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 100,000 page views',
        'Advanced heatmap analytics',
        '5 website tracking',
        'Priority support',
        'Custom reports',
        'API access',
        'Team collaboration'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Unlimited page views',
        'Full analytics suite',
        'Unlimited websites',
        '24/7 dedicated support',
        'White-label solution',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="services-page">
      <style jsx>{`
        .services-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
        }

        .services-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .services-hero {
          text-align: center;
          margin-bottom: 5rem;
        }

        .services-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #fff, #f0f8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .services-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .service-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }

        .service-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .service-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .service-features {
          list-style: none;
          padding: 0;
        }

        .service-features li {
          padding: 0.5rem 0;
          position: relative;
          padding-left: 1.5rem;
        }

        .service-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #64ffda;
          font-weight: bold;
        }

        .pricing-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 4rem 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 4rem;
        }

        .pricing-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .pricing-subtitle {
          text-align: center;
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 3rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card.highlighted {
          background: rgba(100, 255, 218, 0.1);
          border: 2px solid #64ffda;
          transform: scale(1.05);
        }

        .pricing-card.highlighted:before {
          content: 'Most Popular';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #64ffda;
          color: #2c3e50;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .plan-price {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .plan-period {
          opacity: 0.7;
          margin-bottom: 1rem;
        }

        .plan-description {
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
          text-align: left;
        }

        .plan-features li {
          padding: 0.7rem 0;
          position: relative;
          padding-left: 1.5rem;
        }

        .plan-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #64ffda;
          font-weight: bold;
        }

        .plan-button {
          background: linear-gradient(45deg, #64ffda, #4ecdc4);
          color: #2c3e50;
          border: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .plan-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(100, 255, 218, 0.3);
        }

        .cta-section {
          text-align: center;
          margin-top: 5rem;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .cta-text {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          padding: 18px 36px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
        }

        @media (max-width: 768px) {
          .services-title {
            font-size: 2.5rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-card.highlighted {
            transform: none;
          }
          
          .service-card {
            padding: 2rem;
          }
          
          .pricing-section {
            padding: 3rem 2rem;
          }
        }
      `}</style>

      <div className="services-container">
        <div className="services-hero">
          <h1 className="services-title">Our Services</h1>
          <p className="services-subtitle">
            Comprehensive analytics solutions designed to transform your business intelligence and drive data-driven decisions
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pricing-section">
          <h2 className="pricing-title">Choose Your Plan</h2>
          <p className="pricing-subtitle">
            Select the perfect plan for your business needs with flexible pricing and scalable features
          </p>
          
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  {plan.price}<span className="plan-period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <Link to="/signup" className="plan-button">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-section">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">
            Join thousands of businesses using VitalApp to optimize their user experience and boost conversions. 
            Start your free trial today and see the difference data-driven insights can make.
          </p>
          <Link to="/signup" className="cta-button">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;