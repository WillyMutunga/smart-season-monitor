import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FieldCard = ({ field }) => {
  const statusClass = field.status.toLowerCase().replace(' ', '-');
  
  return (
    <motion.div 
      layout
      className={`glass-card field-card ${statusClass}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ marginBottom: '0.2rem' }}>{field.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={14} /> {field.crop_type}
          </p>
        </div>
        <span className={`badge badge-${statusClass}`}>
          {field.status}
        </span>
      </div>

      <div style={{ margin: '1.5rem 0', display: 'flex', gap: '1.5rem' }}>
        <div className="stat-item" style={{ textAlign: 'left' }}>
          <div className="stat-label">Stage</div>
          <div style={{ fontWeight: 600 }}>{field.current_stage}</div>
        </div>
        <div className="stat-item" style={{ textAlign: 'left' }}>
          <div className="stat-label">Planted</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} /> {field.planting_date}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Agent: {field.assigned_agent_name || 'Unassigned'}
        </div>
        <Link to={`/field/${field.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          View Details <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default FieldCard;
