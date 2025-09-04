import React, { useState, useEffect } from 'react';
import AddTestimonialModal from './AddTestimonialModal';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3010/api/testimonials?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setShowAddModal(true);
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTestimonial(null);
  };

  const handleTestimonialSaved = () => {
    fetchTestimonials();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalTestimonials = [...testimonials];
      setTestimonials(testimonials.filter(testimonial => testimonial._id !== id));
      
      const response = await fetch(`http://localhost:3010/api/testimonials/${id}?tenant=mysass`, {
        method: 'DELETE'
      });
      
      // Always refresh the list regardless of response status
      await fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      await fetchTestimonials();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ⭐
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  return (
    <div className="mysass-testimonials-container">
      <div className="mysass-testimonials-header">
        <div className="mysass-header-left">
          <button className="mysass-back-btn" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="mysass-header-text">
            <h2>Manage Testimonials</h2>
            <p>Add, edit, and manage client testimonials</p>
          </div>
        </div>
        <button className="mysass-add-testimonial-btn" onClick={handleAddTestimonial}>
          <i className="fas fa-plus"></i> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="mysass-loading">
          <div className="mysass-spinner"></div>
          <p>Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="mysass-empty-state">
          <div className="mysass-empty-icon">
            <i className="fas fa-quote-left"></i>
          </div>
          <h3>No testimonials yet</h3>
          <p>Add your first testimonial to get started</p>
          <button className="mysass-add-btn-empty" onClick={handleAddTestimonial}>
            <i className="fas fa-plus"></i> Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="mysass-testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="mysass-testimonial-card">
              <div className="mysass-testimonial-header">
                <div className="mysass-testimonial-profile">
                  <div className="mysass-testimonial-avatar">
                    {testimonial.profileImage ? (
                      <img src={testimonial.profileImage} alt={testimonial.name} />
                    ) : (
                      <div className="mysass-testimonial-avatar-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="mysass-testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <p className="mysass-testimonial-company">{testimonial.company}</p>
                  </div>
                </div>
                <div className="mysass-testimonial-actions">
                  <button
                    className="mysass-edit-btn"
                    onClick={() => handleEditTestimonial(testimonial)}
                    title="Edit testimonial"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="mysass-delete-btn"
                    onClick={() => handleDelete(testimonial._id)}
                    title="Delete testimonial"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="mysass-testimonial-rating">
                {renderStarRating(testimonial.rating)}
              </div>
              
              <div className="mysass-testimonial-quote">
                <p>"{testimonial.quote}"</p>
              </div>
              
              <div className="mysass-testimonial-meta">
                <span className="mysass-testimonial-date">
                  Created: {formatDate(testimonial.createdAt)}
                </span>
                <span className="mysass-testimonial-order">
                  Order: {testimonial.order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddTestimonialModal
          testimonial={editingTestimonial}
          onClose={handleCloseModal}
          onTestimonialSaved={handleTestimonialSaved}
        />
      )}
    </div>
  );
};

export default TestimonialsManagement;