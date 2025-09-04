import React, { useState, useEffect } from 'react';

const AddTestimonialModal = ({ testimonial, onClose, onTestimonialSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    quote: '',
    rating: 5,
    order: 0
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        company: testimonial.company || '',
        quote: testimonial.quote || '',
        rating: testimonial.rating || 5,
        order: testimonial.order || 0
      });
      if (testimonial.profileImage) {
        setProfileImagePreview(testimonial.profileImage);
      }
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'File size must be less than 5MB'
        }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Please select an image file'
        }));
        return;
      }

      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.profileImage) {
        setErrors(prev => ({
          ...prev,
          profileImage: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    if (!formData.quote.trim()) {
      newErrors.quote = 'Quote is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('company', formData.company.trim());
      submitData.append('quote', formData.quote.trim());
      submitData.append('rating', formData.rating);
      submitData.append('order', formData.order);
      submitData.append('tenant', 'mysass');

      if (profileImageFile) {
        submitData.append('profileImage', profileImageFile);
      }

      const url = testimonial
        ? `http://localhost:3005/api/testimonials/${testimonial._id}?tenant=mysass`
        : 'http://localhost:3005/api/testimonials?tenant=mysass';
      
      const method = testimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save testimonial');
      }

      onTestimonialSaved();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderStarOptions = () => {
    const options = [];
    for (let i = 1; i <= 5; i++) {
      options.push(
        <option key={i} value={i}>
          {i} Star{i > 1 ? 's' : ''}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="mysass-modal-overlay" onClick={handleBackdropClick}>
      <div className="mysass-modal-content mysass-add-testimonial-modal">
        <div className="mysass-modal-header">
          <h2>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
          <button className="mysass-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mysass-testimonial-form">
          <div className="mysass-form-row">
            <div className="mysass-form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter client name"
                disabled={loading}
              />
              {errors.name && <span className="mysass-error-text">{errors.name}</span>}
            </div>

            <div className="mysass-form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={errors.company ? 'error' : ''}
                placeholder="Enter company name"
                disabled={loading}
              />
              {errors.company && <span className="mysass-error-text">{errors.company}</span>}
            </div>
          </div>

          <div className="mysass-form-group">
            <label htmlFor="quote">Quote *</label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              className={errors.quote ? 'error' : ''}
              placeholder="Enter testimonial quote..."
              disabled={loading}
              rows={5}
            />
            {errors.quote && <span className="mysass-error-text">{errors.quote}</span>}
          </div>

          <div className="mysass-form-row">
            <div className="mysass-form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className={errors.rating ? 'error' : ''}
                disabled={loading}
              >
                {renderStarOptions()}
              </select>
              {errors.rating && <span className="mysass-error-text">{errors.rating}</span>}
            </div>

            <div className="mysass-form-group">
              <label htmlFor="order">Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
                className={errors.order ? 'error' : ''}
                disabled={loading}
              />
              {errors.order && <span className="mysass-error-text">{errors.order}</span>}
            </div>
          </div>

          <div className="mysass-form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <div className="mysass-profile-upload">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="mysass-file-input"
                disabled={loading}
              />
              <label htmlFor="profileImage" className="mysass-file-label">
                {profileImagePreview ? (
                  <>
                    <div className="mysass-profile-preview">
                      <img src={profileImagePreview} alt="Profile preview" />
                    </div>
                    <div className="file-info">
                      <span className="file-btn">Choose File</span>
                      <span className="file-status">File selected</span>
                    </div>
                  </>
                ) : (
                  <div className="mysass-profile-placeholder">
                    <div className="file-info">
                      <span className="file-btn">Choose File</span>
                      <span className="file-status">No file chosen</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.profileImage && <span className="mysass-error-text">{errors.profileImage}</span>}
          </div>

          {errors.submit && (
            <div className="mysass-error-message">
              {errors.submit}
            </div>
          )}

          <div className="mysass-modal-actions">
            <button
              type="button"
              className="mysass-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mysass-btn-testimonial-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {testimonial ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {testimonial ? 'Update Testimonial' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonialModal;