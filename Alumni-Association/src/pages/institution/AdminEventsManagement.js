import React from 'react';

const AdminEventsManagement = () => {
  // Mock data for upcoming events
  const eventsData = [
    { id: 1, title: 'Tech Career Fair 2024', date: '2023-06-15', time: '10:00 AM', type: 'Meetup', organiser: 'Career Services', status: 'Published' },
    { id: 2, title: 'Alumni Networking Night', date: '2023-06-20', time: '6:00 PM', type: 'Networking', organiser: 'Alumni Relations', status: 'Draft' },
    { id: 3, title: 'Industry Trends Webinar', date: '2023-06-25', time: '2:00 PM', type: 'Webinar', organiser: 'Professional Development', status: 'Published' },
    { id: 4, title: 'Startup Pitch Competition', date: '2023-07-01', time: '1:00 PM', type: 'Competition', organiser: 'Entrepreneurship Center', status: 'Published' }
  ];

  // Mock data for RSVPs
  const rsvpStats = [
    { eventId: 1, alumni: 42, students: 28, capacity: 100, checkin: '65%' },
    { eventId: 2, alumni: 15, students: 10, capacity: 50, checkin: 'N/A' },
    { eventId: 3, alumni: 30, students: 45, capacity: 150, checkin: '78%' },
    { eventId: 4, alumni: 20, students: 25, capacity: 75, checkin: 'N/A' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published': return 'chip approved';
      case 'Draft': return 'chip pending';
      default: return 'chip';
    }
  };

  return (
    <div>
      {/* Upcoming Events List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Upcoming Events</h3>
          <button className="btn btn-primary">+ New Event</button>
        </div>
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date/Time</th>
                <th>Type</th>
                <th>Organiser</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date} at {event.time}</td>
                  <td>{event.type}</td>
                  <td>{event.organiser}</td>
                  <td>
                    <span className={getStatusClass(event.status)}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost">Edit</button>
                    <button className="btn btn-ghost">Details</button>
                    <button className="btn btn-ghost">Remind</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RSVP Management */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">RSVP Management</h3>
        </div>
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Alumni RSVPs</th>
                <th>Student RSVPs</th>
                <th>Capacity</th>
                <th>Check-in Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.map(event => {
                const stats = rsvpStats.find(s => s.eventId === event.id);
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{stats?.alumni || 0}</td>
                    <td>{stats?.students || 0}</td>
                    <td>{stats?.capacity || 0}</td>
                    <td>{stats?.checkin || 'N/A'}</td>
                    <td>
                      <button className="btn btn-ghost">Send Reminders</button>
                      <button className="btn btn-ghost">View Attendees</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gallery/Highlights */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Event Highlights</h3>
        </div>
        <div className="card-content">
          <div className="gallery-grid">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="gallery-item">
                <div className="image-placeholder">
                  <span>Event Photo {id}</span>
                </div>
                <div className="gallery-stats">
                  <span>👍 24 Likes</span>
                  <span>💬 8 Comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .gallery-item {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .image-placeholder {
          height: 150px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }
        .gallery-stats {
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          background: white;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default AdminEventsManagement;