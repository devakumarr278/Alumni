import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import API_BASE_URL from '../../utils/api';

const RSVPManagement = () => {
  const [eventData, setEventData] = useState({
    id: Date.now(), // Add event ID for tracking
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    description: '',
    rsvpDeadline: ''
  });
  
  const [alumniList, setAlumniList] = useState([]);
  const [newAlumni, setNewAlumni] = useState({
    firstName: '',
    lastName: '',
    email: '',
    graduationYear: '',
    department: ''
  });
  const [selectedAlumni, setSelectedAlumni] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isAddingAlumni, setIsAddingAlumni] = useState(false);
  const [institutionId, setInstitutionId] = useState(1); // This should come from auth context

  // Fetch alumni list when component mounts
  useEffect(() => {
    fetchAlumniList();
  }, []);

  const fetchAlumniList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alumni/${institutionId}`);
      const data = await response.json();
      if (data.success) {
        setAlumniList(data.alumni);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      id: prev.id, // Keep the ID
      [name]: value
    }));
  };

  const handleAlumniInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlumni(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAlumni = async () => {
    if (!newAlumni.firstName || !newAlumni.lastName || !newAlumni.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAddingAlumni(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/alumni`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAlumni,
          invitedBy: institutionId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Alumni added successfully!');
        setNewAlumni({
          firstName: '',
          lastName: '',
          email: '',
          graduationYear: '',
          department: ''
        });
        fetchAlumniList(); // Refresh the list
      } else {
        alert(data.error || 'Failed to add alumni');
        // Log detailed error for debugging
        if (data.details) {
          console.error('Detailed error:', data.details);
        }
      }
    } catch (error) {
      console.error('Error adding alumni:', error);
      alert('Failed to add alumni. Please try again.');
    } finally {
      setIsAddingAlumni(false);
    }
  };

  const handleSelectAlumni = (id) => {
    setSelectedAlumni(prev => 
      prev.includes(id) 
        ? prev.filter(alumniId => alumniId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlumni.length === alumniList.length) {
      setSelectedAlumni([]);
    } else {
      setSelectedAlumni(alumniList.map(alumni => alumni.id));
    }
  };

  const sendInvitations = async () => {
    if (selectedAlumni.length === 0) return;
    
    setIsSending(true);
    
    try {
      // Send email invitations to selected alumni via backend API
      const selectedAlumniData = alumniList.filter(alumni => 
        selectedAlumni.includes(alumni.id)
      );
      
      let successCount = 0;
      let failureCount = 0;
      
      // Send emails sequentially to avoid rate limiting
      for (const alumni of selectedAlumniData) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/send-rsvp-invitation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toEmail: alumni.email,
              eventData: {
                ...eventData,
                id: eventData.id
              },
              institutionId
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            successCount++;
          } else {
            failureCount++;
            console.error('Failed to send invitation to:', alumni.email, data.error);
          }
        } catch (error) {
          failureCount++;
          console.error('Error sending invitation to:', alumni.email, error);
        }
      }
      
      if (failureCount === 0) {
        alert(`Invitations sent successfully to ${successCount} alumni!`);
      } else if (successCount > 0) {
        alert(`Invitations sent to ${successCount} alumni, but failed to send to ${failureCount} alumni. Please check the console for details.`);
      } else {
        alert(`Failed to send invitations to all selected alumni. Please check the console for details.`);
      }
      
      setSelectedAlumni([]);
      fetchAlumniList(); // Refresh the list to show updated statuses
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">RSVP Management</h1>
        <p className="text-gray-700 mt-1">Send event invitations and manage alumni RSVPs</p>
      </motion.div>

      {/* Add Alumni Form */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={newAlumni.firstName}
              onChange={handleAlumniInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={newAlumni.lastName}
              onChange={handleAlumniInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={newAlumni.email}
              onChange={handleAlumniInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={newAlumni.graduationYear}
              onChange={handleAlumniInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={newAlumni.department}
              onChange={handleAlumniInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="Computer Science"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={handleAddAlumni}
            disabled={isAddingAlumni}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isAddingAlumni ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i> Add Alumni
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Event Details Form */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Event Invitation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="Annual Alumni Meet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="Main Campus Auditorium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
            <input
              type="time"
              name="eventTime"
              value={eventData.eventTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RSVP Deadline</label>
            <input
              type="date"
              name="rsvpDeadline"
              value={eventData.rsvpDeadline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              placeholder="Join us for our annual alumni gathering..."
            ></textarea>
          </div>
        </div>
      </Card>

      {/* Alumni List and Invitation Controls */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Alumni List</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSelectAll}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {selectedAlumni.length === alumniList.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button 
              variant="primary" 
              onClick={sendInvitations}
              disabled={selectedAlumni.length === 0 || isSending}
              className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i> Send Invitations
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedAlumni.length === alumniList.length && alumniList.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Graduation Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {alumniList.map((alumni) => (
                <tr key={alumni.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedAlumni.includes(alumni.id)}
                      onChange={() => handleSelectAlumni(alumni.id)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {alumni.firstName} {alumni.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.department || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.graduationYear || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(alumni.status)}`}>
                      {alumni.status || 'Not Invited'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedAlumni.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
            <i className="fas fa-info-circle mr-2"></i>
            {selectedAlumni.length} alumni selected for invitation
          </div>
        )}
      </Card>

      {/* RSVP Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{alumniList.length}</p>
          <p className="text-sm text-gray-700">Total Alumni</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-lg border border-yellow-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{alumniList.filter(a => !a.status || a.status === 'pending').length}</p>
          <p className="text-sm text-gray-700">Pending</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{alumniList.filter(a => a.status === 'accepted').length}</p>
          <p className="text-sm text-gray-700">Accepted</p>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-lg border border-red-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{alumniList.filter(a => a.status === 'declined').length}</p>
          <p className="text-sm text-gray-700">Declined</p>
        </Card>
      </div>
    </div>
  );
};

export default RSVPManagement;