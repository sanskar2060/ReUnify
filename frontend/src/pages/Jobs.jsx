import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Jobs.css';
import Navbar from '../components/Navbar';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('title', searchTerm);
        if (filters.title) params.append('title', filters.title);
        if (filters.company) params.append('company', filters.company);
        if (filters.location) params.append('location', filters.location);

        const res = await axios.get(
          `http://localhost:5000/api/jobs/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch jobs');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchJobs();
  }, [navigate, searchTerm, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      company: '',
      location: ''
    });
    setSearchTerm('');
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="jobs-container">
        <h1>Job Portal</h1>
        
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search jobs..."
              defaultValue={searchTerm}
            />
            <button type="submit">Search</button>
          </form>

          <div className="filters">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Job Title:</label>
              <input
                type="text"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="filter-group">
              <label>Company:</label>
              <input
                type="text"
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
                placeholder="e.g., Google"
              />
            </div>
            <div className="filter-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g., Remote"
              />
            </div>
            <div className="filter-buttons">
              <button type="button" onClick={() => setSearchTerm('')}>
                Apply Filters
              </button>
              <button type="button" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="jobs-list">
          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="company">{job.company}</span>
                </div>
                <div className="job-details">
                  <span className="location">{job.location}</span>
                  <span className="posted-date">
                    Posted: {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="job-description">
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
                </div>
                <div className="posted-by">
                  Posted by: {job.postedBy?.name || 'Alumni'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;