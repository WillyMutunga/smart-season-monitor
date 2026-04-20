import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FieldModal = ({ isOpen, onClose, onRefresh }) => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    planting_date: new Date().toISOString().split('T')[0],
    assigned_agent: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    try {
      const res = await api.get('agents/');
      setAgents(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, assigned_agent: res.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('fields/', formData);
      onRefresh();
      onClose();
      setFormData({
        name: '',
        crop_type: '',
        planting_date: new Date().toISOString().split('T')[0],
        assigned_agent: agents[0]?.id || ''
      });
    } catch (err) {
      console.error("Failed to create field", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card modal-content"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Add New Field</h2>
          <button onClick={onClose} className="btn" style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Field Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. West Meadow"
              required 
            />
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
            <div className="input-group">
              <label>Crop Type</label>
              <input 
                type="text" 
                value={formData.crop_type} 
                onChange={(e) => setFormData({...formData, crop_type: e.target.value})} 
                placeholder="e.g. Tomatoes"
                required 
              />
            </div>
            <div className="input-group">
              <label>Planting Date</label>
              <input 
                type="date" 
                value={formData.planting_date} 
                onChange={(e) => setFormData({...formData, planting_date: e.target.value})} 
                required 
              />
            </div>
          </div>
          <div className="input-group">
            <label>Assign Agent</label>
            <select 
              value={formData.assigned_agent} 
              onChange={(e) => setFormData({...formData, assigned_agent: e.target.value})}
              required
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.first_name} {agent.last_name} (@{agent.username})
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Creating...' : <><Send size={18} /> Create Field</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FieldModal;
