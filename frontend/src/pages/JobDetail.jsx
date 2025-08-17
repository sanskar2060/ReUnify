import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobDetail.css';
import Navbar from '../components/Navbar';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJob(jobRes.data.data);
        setIsOwner(jobRes.data.data.postedBy._id === userRes.data.data._id || userRes.data.data.isAdmin);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch job details');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to delete job');
    }
  };

  const handleEdit = () => {
    navigate(`/jobs/${id}/edit`);
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div className="not-found">Job not found</div>;

  return (
    <div>
      <Navbar />
      <div className="job-detail-container">
        <div className="job-header">
          <h1>{job.title}</h1>
          <h2>{job.company}</h2>
          <div className="job-meta">
            <span className="location">{job.location}</span>
            <span className="posted-date">
              Posted: {new Date(job.postedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="job-actions">
            <button onClick={handleEdit} className="edit-btn">
              Edit Job
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="delete-btn"
            >
              Delete Job
            </button>
          </div>
        )}

        <div className="job-content">
          <div className="job-description">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="posted-by">
            <h3>Posted By</h3>
            <div className="poster-info">
              <img 
                src={job.postedBy?.profilePicture || '/assets/default-profile.png'} 
                alt={job.postedBy?.name} 
                className="poster-avatar"
              />
              <div>
                <h4>{job.postedBy?.name || 'Alumni'}</h4>
                <p>{job.postedBy?.profession || ''}</p>
                <p>{job.postedBy?.batchYear} • {job.postedBy?.branch}</p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="confirm-modal">
            <div className="confirm-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this job posting?</p>
              <div className="confirm-buttons">
                <button onClick={handleDelete} className="confirm-delete">
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  className="cancel-delete"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;