import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart3, PieChart, Users, TrendingUp, Shell } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('analytics/');
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const getMax = (arr, key) => Math.max(...arr.map(i => i[key] || 0), 1);

  if (loading) return <div>Analyzing farm data...</div>;
  if (!data) return <div>No data available.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Farm Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep insights into crop performance, stage progress, and agent activity.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Crop Distribution */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <PieChart size={20} color="var(--primary)" /> Crop Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.crop_distribution.map(crop => (
              <div key={crop.crop_type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>{crop.crop_type}</span>
                  <span style={{ fontWeight: 700 }}>{crop.count} fields</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(crop.count / data.crop_distribution.reduce((acc, c) => acc + c.count, 0)) * 100}%` }}
                    style={{ height: '100%', background: 'var(--primary)' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Progress */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <TrendingUp size={20} color="var(--accent)" /> Progress Stages
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', height: '200px', paddingTop: '2rem' }}>
            {data.stage_breakdown.map(stage => (
              <div key={stage.current_stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{stage.count}</div>
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${(stage.count / getMax(data.stage_breakdown, 'count')) * 150}px` }}
                  style={{ width: '100%', background: 'var(--secondary)', borderRadius: '4px 4px 0 0' }} 
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'capitalize' }}>
                  {stage.current_stage.toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <Users size={20} color="var(--primary)" /> Monitoring Activity (Updates Logged)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {data.agent_activity.map(agent => (
              <div key={agent.username} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{agent.first_name} {agent.last_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{agent.username}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{agent.update_count}</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Updates</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
