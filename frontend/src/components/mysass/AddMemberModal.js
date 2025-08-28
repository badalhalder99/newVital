import React, { useState, useEffect, useRef } from 'react';

const AddMemberModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    order: 0,
    status: 'Active'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        description: member.description || '',
        order: member.order || 0,
        status: member.status || 'Active'
      });
      if (member.image) {
        setImagePreview(member.image);
      }
    }
    // Reset validation when modal opens/closes
    setShowValidation(false);
  }, [member]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('position', formData.position.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('order', formData.order);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('tenant', 'mysass');

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = member 
        ? `http://localhost:3011/api/team-members/${member._id}`
        : 'http://localhost:3011/api/team-members';
      
      const method = member ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save team member');
      }

      setShowValidation(false);
      onSave();
    } catch (err) {
      console.error('Error saving team member:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="mysass-modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div 
        className="mysass-modal"
        style={{
          background: '#374151',
          borderRadius: '12px',
          padding: '2rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <h2 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 2rem 0'
        }}>
          {member ? 'Edit Team Member' : 'Add Team Member'}
        </h2>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter member name"
              required
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Position Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Position
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter position/role"
              required
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Description Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <div style={{
              background: '#4b5563',
              border: '1px solid #6b7280',
              borderRadius: '8px',
              minHeight: '120px'
            }}>
              <div style={{
                borderBottom: '1px solid #6b7280',
                padding: '8px 12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <select style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.85rem'
                }}>
                  <option>Normal</option>
                </select>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>B</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline' }}>U</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>S</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>•</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>1.</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>A</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>🔗</button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter team member description..."
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>
            {showValidation && !formData.description.trim() && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                marginTop: '0.5rem'
              }}>
                This field is required
              </div>
            )}
          </div>

          {/* Picture Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Picture
            </label>
            <div style={{
              background: '#4b5563',
              border: '1px solid #6b7280',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Choose File
              </button>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                {imageFile ? imageFile.name : (member?.image ? 'Current image selected' : 'No file chosen')}
              </span>
            </div>
            {imagePreview && (
              <div style={{ marginTop: '0.5rem' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Order Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#6b7280' : '#4F83F5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;