import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Sprout, User, Lock, Mail, ChevronLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: ''
  });
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: '#e74c3c' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
    
    setStrength({
      score,
      label: labels[score],
      color: colors[score]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') calculateStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength.score < 3) {
      setError('Please use a stronger password (at least Good)');
      return;
    }
    try {
      await api.post('register/', formData);
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        // Extract the first error message available
        const errorData = err.response.data;
        const firstError = typeof errorData === 'object' 
          ? Object.values(errorData).flat()[0] 
          : 'Registration failed';
        setError(firstError);
      } else {
        setError('Registration failed. Please check your connection.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Link to="/login" className="btn" style={{ paddingLeft: 0, marginBottom: '1rem', color: 'var(--text-muted)' }}>
          <ChevronLeft size={20} /> Back to Login
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Agent Registration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the SmartSeason network</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
            <div className="input-group">
              <label>First Name</label>
              <input name="first_name" type="text" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input name="last_name" type="text" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="input-group">
            <label><User size={16} /> Username</label>
            <input name="username" type="text" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label><Mail size={16} /> Email</label>
            <input name="email" type="email" onChange={handleChange} required />
          </div>

          <div className="input-group" style={{ marginBottom: '0.5rem' }}>
            <label><Lock size={16} /> Password</label>
            <input name="password" type="password" onChange={handleChange} required />
          </div>

          {/* Strength Meter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Password Strength</span>
              <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{ 
                  flex: 1, 
                  background: i <= strength.score ? strength.color : '#eee',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }} />
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Use 8+ chars, with mix of uppercase, numbers, and symbols.
            </p>
          </div>

          {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Create Account
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
