import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PostOpportunities = () => {
  const [activeTab, setActiveTab] = useState('job');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
    contactEmail: '',
    website: '',
    type: 'Full-time',
    duration: '',
    stipend: '',
    startDate: '',
    endDate: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    eventVenue: '',
    projectScope: '',
    budget: '',
    timeline: ''
  });
  const [errors, setErrors] = useState({});

  const opportunityTypes = [
    { id: 'job', name: 'Job', icon: '💼', color: 'from-blue-500 to-indigo-600' },
    { id: 'internship', name: 'Internship', icon: '🎓', color: 'from-green-500 to-emerald-600' },
    { id: 'event', name: 'Event', icon: '📅', color: 'from-purple-500 to-pink-600' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: 'from-orange-500 to-red-600' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Common required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Organization/Company is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Type-specific validations
    switch (activeTab) {
      case 'job':
        if (!formData.type) {
          newErrors.type = 'Employment type is required';
        }
        break;
      case 'internship':
        if (!formData.duration.trim()) {
          newErrors.duration = 'Duration is required';
        }
        break;
      case 'event':
        if (!formData.eventType) {
          newErrors.eventType = 'Event type is required';
        }
        if (!formData.eventDate) {
          newErrors.eventDate = 'Event date is required';
        }
        break;
      case 'freelance':
        if (!formData.projectScope.trim()) {
          newErrors.projectScope = 'Project scope is required';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send data to backend
      console.log('Form submitted:', { ...formData, opportunityType: activeTab });
      alert(`${opportunityTypes.find(t => t.id === activeTab)?.name} posted successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary: '',
        deadline: '',
        contactEmail: '',
        website: '',
        type: 'Full-time',
        duration: '',
        stipend: '',
        startDate: '',
        endDate: '',
        eventType: '',
        eventDate: '',
        eventTime: '',
        eventVenue: '',
        projectScope: '',
        budget: '',
        timeline: ''
      });
      
      setErrors({});
    }
  };

  const renderJobForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="e.g., Software Engineer"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.company ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="Company Name"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Bangalore, India"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.type ? 'border-red-500' : 'border-gray-200/70'
            }`}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., ₹8-15 LPA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-200/70'
          }`}
          placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="List required qualifications, skills, and experience"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="contact@company.com"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://company.com"
          />
        </div>
      </div>
    </div>
  );

  const renderInternshipForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="e.g., Marketing Intern"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.company ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="Organization Name"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="e.g., Mumbai, India"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.duration ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="e.g., 3 months"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
          <input
            type="text"
            name="stipend"
            value={formData.stipend}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="e.g., ₹15,000/month"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-200/70'
          }`}
          placeholder="Describe the internship role, learning opportunities, and what students will gain..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="List required qualifications, skills, and academic background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="contact@organization.com"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="https://organization.com"
          />
        </div>
      </div>
    </div>
  );

  const renderEventForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="e.g., Tech Innovation Summit 2024"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizer *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.company ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="Organization Name"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.eventType ? 'border-red-500' : 'border-gray-200/70'
            }`}
          >
            <option value="">Select Event Type</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Networking">Networking</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Seminar">Seminar</option>
            <option value="Meetup">Meetup</option>
          </select>
          {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <input
            type="text"
            name="eventVenue"
            value={formData.eventVenue}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="e.g., IIT Delhi Campus"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.eventDate ? 'border-red-500' : 'border-gray-200/70'
            }`}
          />
          {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="e.g., 2 hours"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-200/70'
          }`}
          placeholder="Describe the event, agenda, speakers, and what attendees will gain..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="List registration requirements, fees, prerequisites, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="contact@event.com"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="https://registration-link.com"
          />
        </div>
      </div>
    </div>
  );

  const renderFreelanceForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="e.g., Website Redesign Project"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client/Organization *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.company ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="Client Name"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Scope *</label>
          <textarea
            name="projectScope"
            value={formData.projectScope}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.projectScope ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="Describe the project scope, deliverables, and objectives"
          />
          {errors.projectScope && <p className="mt-1 text-sm text-red-600">{errors.projectScope}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="List required skills and expertise"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="e.g., ₹50,000 - ₹1,00,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="e.g., 4-6 weeks"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-200/70'
          }`}
          placeholder="Provide detailed project description, goals, and expectations..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-200/70'
            }`}
            placeholder="client@email.com"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Website/Portfolio</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="https://project-website.com"
          />
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'job':
        return renderJobForm();
      case 'internship':
        return renderInternshipForm();
      case 'event':
        return renderEventForm();
      case 'freelance':
        return renderFreelanceForm();
      default:
        return renderJobForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Post Opportunities
          </h1>
          <p className="text-gray-600 mt-2">
            Share valuable opportunities with the alumni community
          </p>
        </motion.div>

        {/* Opportunity Type Selection */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-1">
            <div className="flex flex-wrap gap-2">
              {opportunityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 ${
                    activeTab === type.id
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <span className="text-lg mr-2">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
            <h2 className="text-xl font-bold text-gray-800">
              {opportunityTypes.find(t => t.id === activeTab)?.name} Details
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Fill in the details below to post your {opportunityTypes.find(t => t.id === activeTab)?.name.toLowerCase()}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {renderForm()}
            
            <div className="mt-8 pt-6 border-t border-gray-200/70">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: '',
                      company: '',
                      location: '',
                      description: '',
                      requirements: '',
                      salary: '',
                      deadline: '',
                      contactEmail: '',
                      website: '',
                      type: 'Full-time',
                      duration: '',
                      stipend: '',
                      startDate: '',
                      endDate: '',
                      eventType: '',
                      eventDate: '',
                      eventTime: '',
                      eventVenue: '',
                      projectScope: '',
                      budget: '',
                      timeline: ''
                    });
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Post {opportunityTypes.find(t => t.id === activeTab)?.name}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Posting Tips</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Include specific details to attract qualified candidates</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Highlight unique benefits or learning opportunities</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Provide clear application instructions and deadlines</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Ensure contact information is accurate and accessible</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default PostOpportunities;