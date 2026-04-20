import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, ShieldCheck, MapPin, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await api.get('agent-management/');
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm("Are you sure you want to promote this agent to Admin? This action cannot be undone.")) return;
    try {
      await api.post(`promote/${id}/`);
      fetchAgents();
    } catch (err) {
      alert("Failed to promote agent");
    }
  };

  if (loading) return <div>Loading agent management...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Agent Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor agent activity, assignments, and access levels.</p>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <th style={{ padding: '1.5rem' }}>Agent</th>
              <th style={{ padding: '1.5rem' }}>Status</th>
              <th style={{ padding: '1.5rem' }}>Assignments</th>
              <th style={{ padding: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {agents.map((agent) => (
                <motion.tr 
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{agent.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{agent.username}</div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        background: agent.is_online ? 'var(--success)' : '#ccc',
                        boxShadow: agent.is_online ? '0 0 10px rgba(46, 204, 113, 0.5)' : 'none'
                      }} />
                      <span style={{ fontSize: '0.9rem', color: agent.is_online ? 'var(--success)' : 'var(--text-muted)' }}>
                        {agent.is_online ? 'Active Now' : 'Offline'}
                      </span>
                    </div>
                    {agent.last_activity && !agent.is_online && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1.2rem' }}>
                        Last seen: {new Date(agent.last_activity).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {agent.assignments.length > 0 ? (
                        agent.assignments.map(field => (
                          <span key={field} style={{ 
                            background: 'rgba(52, 73, 94, 0.05)', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <MapPin size={10} /> {field}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No fields assigned</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <button 
                      onClick={() => handlePromote(agent.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}
                    >
                      <ShieldCheck size={14} /> Promote to Admin
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AgentManagement;
