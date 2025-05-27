// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batchYear: '',
    branch: '',
    location: '',
    profession: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
        setFormData({
          name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone || '',
          batchYear: res.data.data.batchYear,
          branch: res.data.data.branch,
          location: res.data.data.location || '',
          profession: res.data.data.profession || '',
          bio: res.data.data.bio || ''
        });
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/updatedetails',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser(res.data.data);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        'http://localhost:5000/api/auth/updatepassword',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setSuccess('Password updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {!editMode && !showPasswordForm && (
          <button
            className="btn btn-primary"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!editMode && !showPasswordForm ? (
        <div className="profile-view">
          <div className="profile-picture">
            <img
              src={user.profilePicture || '/assets/default-profile.png'}
              alt="Profile"
            />
          </div>
          <div className="profile-details">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
            <p><strong>Batch Year:</strong> {user.batchYear}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Location:</strong> {user.location || 'Not provided'}</p>
            <p><strong>Profession:</strong> {user.profession || 'Not provided'}</p>
            <p><strong>Bio:</strong> {user.bio || 'Not provided'}</p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
        </div>
      ) : showPasswordForm ? (
        <form className="password-form" onSubmit={handlePasswordSubmit}>
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowPasswordForm(false);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Batch Year</label>
            <input
              type="text"
              name="batchYear"
              value={formData.batchYear}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: user.name,
                  email: user.email,
                  phone: user.phone || '',
                  batchYear: user.batchYear,
                  branch: user.branch,
                  location: user.location || '',
                  profession: user.profession || '',
                  bio: user.bio || '',
                });
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;