import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SuccessStories.css';
import Navbar from '../components/Navbar';

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStory, setNewStory] = useState({
    storyTitle: '',
    content: '',
    image: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Get user info to check if admin
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setIsAdmin(userRes.data.data.isAdmin);

        // Get approved success stories
        const storiesRes = await axios.get('http://localhost:5000/api/stories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setStories(storiesRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load success stories');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchStories();
  }, [navigate]);

  const handleAddStory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/stories', newStory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStories([res.data.data, ...stories]);
      setNewStory({
        storyTitle: '',
        content: '',
        image: ''
      });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add success story');
    }
  };

  const handleApproveStory = async (storyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/stories/approve/${storyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStories(stories.map(story => 
        story._id === storyId ? { ...story, approved: true } : story
      ));
    } catch (err) {
      console.error(err);
      setError('Failed to approve story');
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStories(stories.filter(story => story._id !== storyId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete story');
    }
  };

  if (loading) return <div className="loading">Loading success stories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="success-stories-container">
        <div className="stories-header">
          <h1>Alumni Success Stories</h1>
          <p>Inspirational stories from our alumni community</p>
          
          <button 
            className="add-story-btn"
            onClick={() => setShowAddModal(true)}
          >
            Share Your Story
          </button>
        </div>

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Share Your Success Story</h2>
              <form onSubmit={handleAddStory}>
                <div className="form-group">
                  <label>Story Title</label>
                  <input
                    type="text"
                    placeholder="Title of your success story"
                    value={newStory.storyTitle}
                    onChange={(e) => setNewStory({...newStory, storyTitle: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Your Story</label>
                  <textarea
                    placeholder="Tell us about your journey..."
                    value={newStory.content}
                    onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                    required
                    rows={8}
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={newStory.image}
                    onChange={(e) => setNewStory({...newStory, image: e.target.value})}
                  />
                </div>
                
                <div className="modal-buttons">
                  <button type="submit">Submit Story</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="stories-grid">
          {stories.map((story) => (
            <div 
              key={story._id} 
              className={`story-card ${story.approved ? '' : 'pending'}`}
            >
              {story.image && (
                <div className="story-image">
                  <img src={story.image} alt={story.storyTitle} />
                </div>
              )}
              
              <div className="story-content">
                <div className="story-header">
                  <h3>{story.storyTitle}</h3>
                  {!story.approved && (
                    <span className="status-badge">Pending Approval</span>
                  )}
                </div>
                
                <div className="author-info">
                  <img 
                    src={story.user.profilePicture || '/assets/default-profile.png'} 
                    alt={story.user.name} 
                  />
                  <div>
                    <h4>{story.user.name}</h4>
                    <p>
                      {story.user.batchYear} • {story.user.branch}
                    </p>
                  </div>
                </div>
                
                <div className="story-text">
                  {story.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="story-date">
                  {new Date(story.createdAt).toLocaleDateString()}
                </div>
                
                {isAdmin && !story.approved && (
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleApproveStory(story._id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleDeleteStory(story._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;