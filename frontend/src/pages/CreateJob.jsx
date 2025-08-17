import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateJob.css';
import Navbar from '../components/Navbar';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
      const res = await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Job posted successfully!');
      setError('');
      setTimeout(() => {
        navigate(`/jobs/${res.data.data._id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to post job');
      setSuccess('');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="create-job-container">
        <h1>Post a Job Opportunity</h1>
        
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
              placeholder="e.g., Software Engineer"
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
              placeholder="Company name"
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
              placeholder="e.g., Remote, New York, etc."
            />
          </div>

          <div className="form-group">
            <label>Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the job responsibilities, requirements, etc."
              rows="8"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Post Job
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;