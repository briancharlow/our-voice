// CitizenConnect.jsx
import React, { useState } from 'react';
import { Bell, MessageCircle, FileText, PieChart, AlertTriangle, LogOut, Menu } from 'lucide-react';
import './citizen.css';

const CitizenConnect = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const activePolls = [
    { id: 1, title: "New Infrastructure Project", participants: 1234, daysLeft: 5 },
    { id: 2, title: "Education Budget 2025", participants: 890, daysLeft: 3 }
  ];

  const recentIncidents = [
    { id: 1, type: "Road Issue", location: "Central District", status: "In Progress" },
    { id: 2, type: "Power Outage", location: "North Zone", status: "Pending" }
  ];

  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-left">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="menu-button"
          >
            <Menu size={24} />
          </button>
          <h1 className="brand">CitizenConnect360</h1>
        </div>
        <div className="nav-right">
          <Bell className="menu-button" />
          <div className="profile-circle">
            <span>JD</span>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <SidebarItem icon={<PieChart size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
            <SidebarItem icon={<FileText size={20} />} label="Documents" isOpen={isSidebarOpen} />
            <SidebarItem icon={<AlertTriangle size={20} />} label="Report Incident" isOpen={isSidebarOpen} />
            <SidebarItem icon={<MessageCircle size={20} />} label="Discussions" isOpen={isSidebarOpen} />
            <div className="sidebar-divider">
              <SidebarItem icon={<LogOut size={20} />} label="Logout" isOpen={isSidebarOpen} />
            </div>
          </nav>
        </aside>

        <main className="main-content">
          <div className="grid">
            <div className="card welcome-card">
              <div className="card-content">
                <h2 className="welcome-title">Welcome back, John!</h2>
                <p className="welcome-text">Stay informed and engaged with your community.</p>
              </div>
            </div>

            <div className="card polls-card">
              <div className="card-header">
                <h2 className="card-title">Active Polls</h2>
              </div>
              <div className="card-content">
                {activePolls.map(poll => (
                  <div key={poll.id} className="poll-item">
                    <div className="poll-header">
                      <div>
                        <h3 className="poll-title">{poll.title}</h3>
                        <p className="poll-participants">{poll.participants} participants</p>
                      </div>
                      <span className="poll-days">{poll.daysLeft} days left</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-value" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Incidents</h2>
              </div>
              <div className="card-content">
                {recentIncidents.map(incident => (
                  <div key={incident.id} className="incident-item">
                    <h3 className="incident-title">{incident.type}</h3>
                    <p className="incident-location">{incident.location}</p>
                    <span className={`status-badge ${
                      incident.status === 'In Progress' ? 'in-progress' : 'pending'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, isOpen }) => (
  <div className="sidebar-item">
    <div>{icon}</div>
    {isOpen && <span>{label}</span>}
  </div>
);

export default CitizenConnect;