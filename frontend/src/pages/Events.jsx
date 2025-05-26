import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import Navbar from '../components/Navbar';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
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

        // Get events
        const eventsRes = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(eventsRes.data.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/events', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents([...events, res.data.data]);
      setNewEvent({
        name: '',
        description: '',
        date: '',
        location: ''
      });
      setShowAddEventModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add event');
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/events/register/${eventId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Successfully registered for the event!');
    } catch (err) {
      console.error(err);
      alert('Failed to join event');
    }
  };

  return (
    <div>
      <Navbar></Navbar>
    <div className="events-container">
      {isAdmin && (
        <button 
          className="add-btn"
          onClick={() => setShowAddEventModal(true)}
        >
          Add new event
        </button>
      )}

      {showAddEventModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Event</h2>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                required
              />
              <input
                type="datetime-local"
                placeholder="Date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Add Event</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        
      )}

      {events.map((event, index) => (
        <div className="event-card" key={index}>
          <div className="event-header">
            <strong>{event.name}</strong> &nbsp;
            <span>Date: {new Date(event.date).toLocaleDateString()}</span>
          </div>
          <span className="badge">ONGOING</span>
          <p>{event.description}</p>
          <p>Location: {event.location}</p>
          <button 
            className="join-btn"
            onClick={() => handleJoinEvent(event._id)}
          >
            Join the event
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Events;