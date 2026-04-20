import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, History, Send, AlertCircle, Info } from 'lucide-react';

const FieldDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [newUpdate, setNewUpdate] = useState({ stage: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchField();
  }, [id]);

  const fetchField = async () => {
    try {
      const res = await api.get(`fields/${id}/`);
      setField(res.data);
      setNewUpdate({ ...newUpdate, stage: res.data.current_stage });
    } catch (err) {
      console.error("Failed to fetch field", err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('updates/', {
        field: id,
        stage: newUpdate.stage,
        notes: newUpdate.notes
      });
      setNewUpdate({ ...newUpdate, notes: '' });
      fetchField();
    } catch (err) {
      console.error("Failed to post update", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading details...</div>;
  if (!field) return <div>Field not found.</div>;

  const statusClass = field.status.toLowerCase().replace(' ', '-');

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <button onClick={() => navigate('/')} className="btn" style={{ marginBottom: '2rem', paddingLeft: 0, color: 'var(--text-muted)' }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ margin: 0 }}>{field.name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{field.crop_type} • Seeded on {field.planting_date}</p>
              </div>
              <span className={`badge badge-${statusClass}`} style={{ fontSize: '1rem', padding: '0.5rem 1.2rem' }}>
                {field.status}
              </span>
            </div>

            {field.status === 'At Risk' && (
              <div style={{ 
                background: 'rgba(231, 76, 60, 0.1)', 
                color: 'var(--danger)', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid rgba(231, 76, 60, 0.2)'
              }}>
                <AlertCircle size={24} />
                <div>
                  <div style={{ fontWeight: 700 }}>Health Warning</div>
                  <div style={{ fontSize: '0.9rem' }}>This field has been flagged based on recent observations. Immediate attention may be required.</div>
                </div>
              </div>
            )}

            <section>
              <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} /> Update History
              </h2>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {field.updates && field.updates.length > 0 ? (
                  field.updates.map((update, idx) => (
                    <div key={update.id} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'white', 
                        border: '2px solid var(--primary)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        zIndex: 1
                      }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />
                      </div>
                      {idx !== (field.updates.length - 1) && (
                        <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-20px', width: '2px', background: 'rgba(46, 204, 113, 0.2)' }} />
                      )}
                      <div className="glass-card" style={{ padding: '1rem', flex: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{update.stage}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(update.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{update.notes}</p>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Logged by: {update.created_by_name}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No updates logged yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> Log Observation
            </h2>
            <form onSubmit={handleUpdate} style={{ marginTop: '1.5rem' }}>
              <div className="input-group">
                <label>Current Stage</label>
                <select 
                  value={newUpdate.stage} 
                  onChange={(e) => setNewUpdate({ ...newUpdate, stage: e.target.value })}
                  required
                >
                  <option value="PLANTED">Planted</option>
                  <option value="GROWING">Growing</option>
                  <option value="READY">Ready</option>
                  <option value="HARVESTED">Harvested</option>
                </select>
              </div>
              <div className="input-group">
                <label>Observations / Notes</label>
                <textarea 
                  rows="5"
                  value={newUpdate.notes}
                  onChange={(e) => setNewUpdate({ ...newUpdate, notes: e.target.value })}
                  placeholder="Describe crop health, weather impacts, or stage details..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={submitting}
              >
                {submitting ? 'Posting...' : <><Send size={18} /> Post Update</>}
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(52, 73, 94, 0.05)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Info size={14} /> System Logic
              </div>
              <p>Keywords like "pest", "disease", or "yellow" will automatically flag the field as <strong>At Risk</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FieldDetail;
