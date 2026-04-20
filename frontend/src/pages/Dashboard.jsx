import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import FieldCard from '../components/FieldCard';
import FieldModal from '../components/FieldModal';
import { Plus, LayoutGrid, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fieldsRes, statsRes] = await Promise.all([
        api.get('fields/'),
        api.get('stats/')
      ]);
      setFields(fieldsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Dashboard...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.username}. Here is what's happening today.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Add New Field</span>
          </button>
        )}
      </header>

      {/* Stats Summary */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '3rem' }}>
        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Activity size={24} />
          </div>
          <div className="stat-value">{stats?.total_fields}</div>
          <div className="stat-label">Total Fields</div>
        </div>
        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Activity size={24} />
          </div>
          <div className="stat-value">{stats?.status_breakdown.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--warning)', marginBottom: '0.5rem' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.status_breakdown.at_risk}</div>
          <div className="stat-label">At Risk</div>
        </div>
        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>{stats?.status_breakdown.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <LayoutGrid size={20} color="var(--text-muted)" />
        <h2 style={{ margin: 0 }}>Field Monitoring</h2>
      </div>

      <div className="grid">
        {fields.map(field => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
      
      {fields.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No fields found.
        </div>
      )}

      <FieldModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchData} 
      />
    </motion.div>
  );
};

export default Dashboard;
