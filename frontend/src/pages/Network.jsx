import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Network.css';

const Network = () => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    batchYear: '',
    branch: '',
    profession: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNetworkData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch all users
        const usersRes = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch current user's connections
        const connectionsRes = await axios.get(
          'http://localhost:5000/api/users/connections/all',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(usersRes.data.data);
        setConnections(connectionsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load network data');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchNetworkData();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (filters.batchYear) params.append('batchYear', filters.batchYear);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.profession) params.append('profession', filters.profession);
      if (filters.location) params.append('location', filters.location);

      const res = await axios.get(
        `http://localhost:5000/api/users/search?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to search users');
    }
  };

  const handleConnect = async (userId) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `http://localhost:5000/api/users/connect/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update connections list
      const userToAdd = users.find(user => user._id === userId);
      if (userToAdd) {
        setConnections([...connections, userToAdd]);
      }

      // Update users list to show connection status
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isConnected: true } : user
      ));
    } catch (err) {
      console.error(err);
      setError('Failed to connect with user');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      batchYear: '',
      branch: '',
      profession: '',
      location: ''
    });
  };

  if (loading) return <div className="loading">Loading network...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="network-container">
      <h1>Alumni Network</h1>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Batch Year:</label>
            <input
              type="text"
              name="batchYear"
              value={filters.batchYear}
              onChange={handleFilterChange}
              placeholder="e.g., 2015"
            />
          </div>
          <div className="filter-group">
            <label>Branch:</label>
            <input
              type="text"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div className="filter-group">
            <label>Profession:</label>
            <input
              type="text"
              name="profession"
              value={filters.profession}
              onChange={handleFilterChange}
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="filter-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., New York"
            />
          </div>
          <div className="filter-buttons">
            <button type="button" onClick={handleSearch}>
              Apply Filters
            </button>
            <button type="button" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="network-content">
        <div className="connections-section">
          <h2>Your Connections ({connections.length})</h2>
          {connections.length === 0 ? (
            <p>You haven't connected with anyone yet.</p>
          ) : (
            <div className="connections-grid">
              {connections.map(user => (
                <div key={user._id} className="connection-card">
                  <img
                    src={user.profilePicture || '/assets/default-profile.png'}
                    alt={user.name}
                    className="profile-pic"
                  />
                  <div className="connection-info">
                    <h3>{user.name}</h3>
                    <p>{user.profession || 'Profession not specified'}</p>
                    <p>{user.batchYear} • {user.branch}</p>
                    <p>{user.location || 'Location not specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="all-users-section">
          <h2>All Alumni ({users.length})</h2>
          <div className="users-grid">
            {users.map(user => {
              const isConnected = connections.some(conn => conn._id === user._id);
              return (
                <div key={user._id} className="user-card">
                  <img
                    src={user.profilePicture || '/assets/default-profile.png'}
                    alt={user.name}
                    className="profile-pic"
                  />
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.profession || 'Profession not specified'}</p>
                    <p>{user.batchYear} • {user.branch}</p>
                    <p>{user.location || 'Location not specified'}</p>
                  </div>
                  <div className="user-actions">
                    {isConnected ? (
                      <span className="connected-badge">Connected</span>
                    ) : (
                      <button
                        onClick={() => handleConnect(user._id)}
                        className="connect-btn"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;