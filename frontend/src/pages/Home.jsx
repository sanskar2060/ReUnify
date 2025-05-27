// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      title: 'Alumni Network',
      description: 'Connect with fellow alumni from your institution',
      icon: '👥'
    },
    {
      title: 'Job Portal',
      description: 'Find and post job opportunities within the alumni community',
      icon: '💼'
    },
    {
      title: 'Events',
      description: 'Stay updated on upcoming alumni events and reunions',
      icon: '🎉'
    },
    {
      title: 'Success Stories',
      description: 'Get inspired by the achievements of your peers',
      icon: '🌟'
    }
  ];

  const testimonials = [
    {
      name: 'Sanskar Singh',
      role: 'Class of 2024, Software Engineer',
      quote: 'ReUnify helped me reconnect with old classmates and even land my current job!',
      avatar: '👩‍💻'
    },
    {
      name: 'ABCD EFGH',
      role: 'Class of 2010, Product Manager',
      quote: 'The alumni network is incredibly supportive and valuable for professional growth.',
      avatar: '👨‍💼'
    },
    {
      name: 'Vaibhavi Kadam',
      role: 'Class of 2018, Data Scientist',
      quote: 'I found my mentor through ReUnify and it changed my career trajectory.',
      avatar: '👨‍🔬'
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ReUnify</h1>
          <p>Your alumni network platform to connect, collaborate, and grow together</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Join Now</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Join ReUnify?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Alumni Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;