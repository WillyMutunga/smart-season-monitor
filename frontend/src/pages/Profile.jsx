import React, { useState, useEffect } from 'react';
import api from '../api';
import { User, Mail, Lock, Shield, Save, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', username: '' });
  const [passData, setPassData] = useState({ old_password: '', new_password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('profile/');
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch('profile/', profile);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('change-password/', passData);
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setPassData({ old_password: '', new_password: '' });
    } catch (err) {
      const errorText = err.response?.data?.old_password?.[0] || 'Failed to change password.';
      setMsg({ type: 'error', text: errorText });
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Personal Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account details and security settings.</p>
      </header>

      {msg.text && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem',
          background: msg.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
          color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}`
        }}>
          {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Info Section */}
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem', marginBottom: '2rem' }}>
            <User size={20} color="var(--primary)" /> Basic Information
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="input-group">
              <label>Username</label>
              <input type="text" value={profile.username} disabled style={{ background: 'rgba(0,0,0,0.02)', cursor: 'not-allowed' }} />
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
              <div className="input-group">
                <label>First Name</label>
                <input type="text" value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} required />
              </div>
            </div>
            <div className="input-group">
              <label><Mail size={16} /> Email Address</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem', marginBottom: '2rem' }}>
            <Shield size={20} color="var(--accent)" /> Security & Password
          </h2>
          <form onSubmit={handleChangePassword}>
            <div className="input-group">
              <label><KeyRound size={16} /> Current Password</label>
              <input type="password" value={passData.old_password} onChange={(e) => setPassData({...passData, old_password: e.target.value})} required />
            </div>
            <div className="input-group">
              <label><Lock size={16} /> New Password</label>
              <input type="password" value={passData.new_password} onChange={(e) => setPassData({...passData, new_password: e.target.value})} required />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              For your security, once you change your password, you should use the new one for future logins.
            </p>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
               Update Password
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
