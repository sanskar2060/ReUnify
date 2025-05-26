import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Navbar />
    <header className="hero">
      <img src="/assets/hero.png" alt="alumni" />
    </header>

    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="cards">
        {[1, 2, 3].map((i) => (
          <div key={i} className="testimonial-card">
            <div className="profile">
              <img src="/assets/profile.png" alt="user" />
              <div>
                <h4>Leo</h4>
                <p>Lead Designer</p>
              </div>
            </div>
            <p><strong>It was a very good experience</strong></p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada neque.</p>
          </div>
        ))}
      </div>
    </section>

    <section className="features">
      <h2>Features</h2>
      <div className="feature-list">
        {[...Array(6)].map((_, i) => (
          <div className="feature" key={i}>
            <div className="dot" />
            <div>
              <h4>Platea lectus sit.</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus ipsum viverra etiam.</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <Footer />
  </>
);

export default Home;
