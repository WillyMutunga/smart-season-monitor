import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, Sprout, User, Users, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <Sprout size={32} />
        <span>SmartSeason</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {user?.role === 'ADMIN' && (
          <Link to="/analytics" className="btn btn-secondary" style={{ background: 'transparent', color: 'var(--secondary)', border: '1px solid var(--secondary)', padding: '0.5rem 1rem' }}>
            <BarChart3 size={18} /> Analytics
          </Link>
        )}
        {user?.role === 'ADMIN' && (
          <Link to="/agents" className="btn btn-secondary" style={{ background: 'transparent', color: 'var(--secondary)', border: '1px solid var(--secondary)', padding: '0.5rem 1rem' }}>
            <Users size={18} /> Manage Agents
          </Link>
        )}
        <Link to="/profile" className="btn btn-secondary" style={{ background: 'transparent', color: 'var(--secondary)', border: '1px solid var(--secondary)', padding: '0.5rem 1rem' }}>
          <User size={18} /> Profile
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <User size={20} />
          <span>{user?.username} ({user?.role})</span>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
