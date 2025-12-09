import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './InstitutionAdminLayout.css';

const InstitutionAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/institution/admin/dashboard', icon: '🏠' },
    { name: 'Verification', path: '/institution/admin/verification', icon: '✅' },
    { name: 'Alumni', path: '/institution/admin/alumni', icon: '👥' },
    { name: 'Mentorship', path: '/institution/admin/mentorship', icon: '🤝' },
    { name: 'Events', path: '/institution/admin/events', icon: '📅' },
    { name: 'Analytics', path: '/institution/admin/analytics', icon: '📊' },
    { name: 'Settings', path: '/institution/admin/settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirect if not authenticated or not an institution
  if (!user || user.role !== 'institution') {
    navigate('/login');
    return null;
  }

  return (
    <div className="app">
      <div className="institution-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">Institution Admin</div>
          <nav>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main">
          {/* Top Bar */}
          <header className="page-header">
            <h1 className="page-title">
              {navItems.find(item => location.pathname.includes(item.path.split('/').pop()))?.name || 'Dashboard'}
            </h1>
            <div className="top-bar-actions">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
              />
              <button className="btn btn-ghost">📅 Last 30 days</button>
              <div className="user-avatar" onClick={handleLogout}>
                {user?.institutionalEmail?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstitutionAdminLayout;