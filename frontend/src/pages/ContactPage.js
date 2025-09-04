import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@vitalapp.com',
      action: 'mailto:support@vitalapp.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9 AM - 6 PM EST',
      action: '#'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: '📍',
      title: 'Office Location',
      description: 'Visit us at our headquarters',
      contact: '123 Analytics Ave, Tech City, TC 12345',
      action: '#'
    }
  ];

  const faqs = [
    {
      question: 'How quickly can I get started with VitalApp?',
      answer: 'You can be up and running within minutes! Simply sign up, add our tracking script to your website, and start collecting data immediately.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started.'
    },
    {
      question: 'How does the multi-tenant system work?',
      answer: 'Our multi-tenant architecture allows multiple organizations to use isolated environments with their own data, users, and customizations while sharing the same underlying infrastructure.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We provide comprehensive support including email, live chat, phone support, and extensive documentation. Enterprise customers get dedicated account managers and 24/7 support.'
    }
  ];

  return (
    <div className="contact-page">
      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contact-hero {
          text-align: center;
          margin-bottom: 5rem;
        }

        .contact-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #fff, #f0f8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }

        .contact-form {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #64ffda;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #64ffda;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #64ffda;
          background: rgba(255, 255, 255, 0.15);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-button {
          background: linear-gradient(45deg, #64ffda, #4ecdc4);
          color: #2c3e50;
          border: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .form-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(100, 255, 218, 0.3);
        }

        .form-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 1rem;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }

        .status-success {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .status-error {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .contact-methods {
          display: grid;
          gap: 1.5rem;
        }

        .method-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .method-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          color: inherit;
        }

        .method-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .method-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #64ffda;
        }

        .method-description {
          opacity: 0.9;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .method-contact {
          font-weight: 500;
          color: #64ffda;
        }

        .faq-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 4rem 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 4rem;
        }

        .faq-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #64ffda;
        }

        .faq-grid {
          display: grid;
          gap: 2rem;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .faq-question {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #64ffda;
        }

        .faq-answer {
          line-height: 1.6;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .contact-title {
            font-size: 2.5rem;
          }
          
          .contact-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .contact-form {
            padding: 2rem;
          }
          
          .faq-section {
            padding: 3rem 2rem;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Get in touch with our team for support, questions, or to learn more about how VitalApp can help your business
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-form">
            <h2 className="form-title">Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@company.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your needs..."
                  className="form-textarea"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-button"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="status-message status-success">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="status-message status-error">
                  Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </div>

          <div className="contact-methods">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="method-card"
                onClick={method.action === '#' ? (e) => e.preventDefault() : undefined}
              >
                <span className="method-icon">{method.icon}</span>
                <h3 className="method-title">{method.title}</h3>
                <p className="method-description">{method.description}</p>
                <div className="method-contact">{method.contact}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;