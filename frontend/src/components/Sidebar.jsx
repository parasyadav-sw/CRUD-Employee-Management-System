import React from 'react';
import { LayoutDashboard, Users, Award } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Award size={22} />
        </div>
        <span className="sidebar-logo-text">TechNova HR</span>
      </div>

      <nav style={{ flexGrow: 1 }}>
        <ul className="sidebar-menu">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('employees')}
              className={`sidebar-item ${activeTab === 'employees' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <Users size={18} />
              <span>Employees</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">
          HR
        </div>
        <div className="sidebar-footer-info">
          <span className="sidebar-footer-name">Paras Admin</span>
          <span className="sidebar-footer-role">HR Administrator</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
