import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditJob.css';
import Navbar from '../components/Navbar';

const EditJob = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if current user is the job poster
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.data.data._id !== res.data.data.postedBy._id) {
          navigate('/jobs');
          return;
        }

        setFormData({
          title: res.data.data.title,
          company: res.data.data.company,
          description: res.data.data.description,
          location: res.data.data.location
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Job updated successfully!');
      setError('');
      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update job');
      setSuccess('');
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;

  return (
    <div>
      <Navbar />
      <div className="edit-job-container">
        <h1>Edit Job Posting</h1>
        
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company*</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="8"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Update Job
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/jobs/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;