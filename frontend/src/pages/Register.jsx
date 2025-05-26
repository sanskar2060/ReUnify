import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '',phone:'',batchYear:0,branch:'',location:'',profession:'',bio:'',profilePicture:'' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);

      localStorage.setItem('token', res.data.token); // Save JWT token
      navigate('/events'); // Redirect to events
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      /><br />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      /><br />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      /><br />
      <input
        type="text"
        name="phone"
        placeholder="phone"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        type="number"
        name="batchYear"
        placeholder="Batch year"
        value={form.batchYear}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="branch"
        placeholder="Branch"
        value={form.branch}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="location"
        value={form.location}
        onChange={handleChange}
      />
      
     
      
      <input
        type="text"
        name="profession"
        placeholder="profession"
        value={form.profession}
        onChange={handleChange}
      />

      <input
        type="text"
        name="bio"
        placeholder="bio"
        value={form.bio}
        onChange={handleChange}
      />
      
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
