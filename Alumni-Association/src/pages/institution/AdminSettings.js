import React, { useState } from 'react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    institutionName: 'Example University',
    contactEmail: 'admin@example.edu',
    notificationEmail: 'notifications@example.edu',
    timeZone: 'UTC-05:00',
    dateFormat: 'MM/DD/YYYY',
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maxMentorshipRequests: 5,
    eventReminderDays: 3
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Institution Settings</h3>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label>Institution Name</label>
            <input
              type="text"
              name="institutionName"
              value={settings.institutionName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Notification Email</label>
            <input
              type="email"
              name="notificationEmail"
              value={settings.notificationEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Time Zone</label>
            <select
              name="timeZone"
              value={settings.timeZone}
              onChange={handleChange}
              className="form-input"
            >
              <option value="UTC-05:00">Eastern Time (UTC-05:00)</option>
              <option value="UTC-06:00">Central Time (UTC-06:00)</option>
              <option value="UTC-07:00">Mountain Time (UTC-07:00)</option>
              <option value="UTC-08:00">Pacific Time (UTC-08:00)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Date Format</label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="form-input"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableEmailNotifications"
                checked={settings.enableEmailNotifications}
                onChange={handleChange}
              />
              Enable Email Notifications
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableSMSNotifications"
                checked={settings.enableSMSNotifications}
                onChange={handleChange}
              />
              Enable SMS Notifications
            </label>
          </div>
          
          <div className="form-group">
            <label>Max Mentorship Requests per Student</label>
            <input
              type="number"
              name="maxMentorshipRequests"
              value={settings.maxMentorshipRequests}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="20"
            />
          </div>
          
          <div className="form-group">
            <label>Event Reminder Days</label>
            <input
              type="number"
              name="eventReminderDays"
              value={settings.eventReminderDays}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="14"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Settings</button>
            <button type="button" className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .settings-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .form-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          grid-column: 1 / -1;
        }
        @media (max-width: 768px) {
          .settings-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;