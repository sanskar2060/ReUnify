// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import SuccessStories from './pages/SuccessStories';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/network" element={<Network />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/edit/:id" element={<EditJob />} />
            <Route path="/stories" element={<SuccessStories />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;