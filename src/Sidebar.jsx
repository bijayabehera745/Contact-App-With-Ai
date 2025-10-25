

import React from 'react';

const Sidebar = ({ onAddContactClick }) => {
  return (
    <div className="sidebar">
      <h1><span style={{ color: 'var(--accent-blue)' }}>Aloy</span> Contacts</h1> {/* Assuming "Aloy" as a logo */}
      
      <div className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        <div className="sidebar-nav-item active">
          {/* Example SVG icon - replace with actual icon library */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 19H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"></path><rect x="7" y="7" width="10" height="10" rx="2" ry="2"></rect></svg>
          All People
        </div>
        <div className="sidebar-nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          Businesses
        </div>

        <div className="sidebar-section-title">Tags</div>
        {/* Placeholder tags - these would dynamically load from backend */}
        <div className="sidebar-nav-item">Family</div>
        <div className="sidebar-nav-item">Friends</div>
        <div className="sidebar-nav-item">Work</div>

        <div className="sidebar-section-title">Events</div>
        <div className="sidebar-nav-item">Birthdays</div>
        <div className="sidebar-nav-item">Reminders</div>
      </div>

      <button className="sidebar-add-button" onClick={onAddContactClick}>
        Add Contact +
      </button>
    </div>
  );
};

export default Sidebar;