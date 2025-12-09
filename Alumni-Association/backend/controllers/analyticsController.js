const User = require('../models/User');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const Booking = require('../models/Booking');

// Add this helper function at the top
const calculateImpactScore = (mentorships, timeSpent, feedback) => {
  return (mentorships * 0.5 + timeSpent * 0.3 + feedback * 0.2);
};

class AnalyticsController {
  // Get mentorship summary data
  static async getMentorshipSummary(req, res) {
    try {
      const { timeRange = 'monthly' } = req.query;
      
      // Get all approved alumni who are mentors
      const mentors = await User.find({ 
        userType: 'alumni', 
        status: 'approved',
        'mentorship.public': true
      });
      
      // Get all bookings
      const bookings = await Booking.find({}).populate('slotId');
      
      // Calculate statistics
      const totalSessions = bookings.length;
      const activeMentors = mentors.length;
      
      // Calculate average session duration (assuming 30 minutes per slot as default)
      const avgSessionDuration = 30; // This would be more complex in a real implementation
      
      // Department distribution
      const departmentData = await User.aggregate([
        { 
          $match: { 
            userType: 'alumni', 
            status: 'approved',
            'mentorship.public': true
          } 
        },
        { 
          $group: { 
            _id: '$department', 
            sessions: { $sum: { $size: '$mentorship.availability' } },
            mentors: { $sum: 1 }
          } 
        },
        { $sort: { sessions: -1 } }
      ]);
      
      // Batch/graduation year distribution
      const batchData = await User.aggregate([
        { 
          $match: { 
            userType: 'alumni', 
            status: 'approved',
            'mentorship.public': true
          } 
        },
        { 
          $group: { 
            _id: '$graduationYear', 
            sessions: { $sum: { $size: '$mentorship.availability' } },
            mentors: { $sum: 1 }
          } 
        },
        { $sort: { _id: -1 } }
      ]);
      
      // Monthly trend (simplified)
      const monthlyTrend = await Booking.aggregate([
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        },
        {
          $limit: 12
        }
      ]).exec();
      
      // Format monthly trend data
      const formattedMonthlyTrend = monthlyTrend.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        sessions: item.count,
        mentors: Math.floor(item.count * 0.7) // Approximation
      }));
      
      res.json({
        success: true,
        data: {
          totalSessions,
          activeMentors,
          avgSessionDuration,
          departmentData,
          batchData,
          monthlyTrend: formattedMonthlyTrend
        }
      });
    } catch (error) {
      console.error('Get mentorship summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch mentorship summary'
      });
    }
  }
  
  // Get location heatmap data
  static async getLocationHeatmap(req, res) {
    try {
      const { timeRange = 'all' } = req.query;
      
      // Get all approved alumni with location data
      const alumniLocations = await User.find({ 
        userType: 'alumni', 
        status: 'approved',
        location: { $exists: true, $ne: '' }
      }).select('location collegeName graduationYear');
      
      // Process location data
      const locationMap = {};
      
      alumniLocations.forEach(alumni => {
        const location = alumni.location.trim();
        if (location) {
          if (!locationMap[location]) {
            locationMap[location] = {
              alumniCount: 0,
              countries: new Set(),
              colleges: new Set(),
              batches: new Set()
            };
          }
          
          locationMap[location].alumniCount++;
          locationMap[location].colleges.add(alumni.collegeName);
          locationMap[location].batches.add(alumni.graduationYear);
          
          // Extract country from location (simplified)
          const parts = location.split(',');
          if (parts.length > 1) {
            const country = parts[parts.length - 1].trim();
            locationMap[location].countries.add(country);
          }
        }
      });
      
      // Convert to array format
      const locationData = Object.entries(locationMap).map(([location, data]) => ({
        region: location,
        country: Array.from(data.countries)[0] || 'Unknown',
        alumniCount: data.alumniCount,
        colleges: Array.from(data.colleges),
        batches: Array.from(data.batches)
        // Note: In a real implementation, you would geocode the locations to get lat/lng
        // For now, we'll use dummy coordinates
      }));
      
      // Sort by alumni count
      locationData.sort((a, b) => b.alumniCount - a.alumniCount);
      
      res.json({
        success: true,
        data: locationData
      });
    } catch (error) {
      console.error('Get location heatmap error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch location heatmap data'
      });
    }
  }
  
  // Get alumni spotlight data
  static async getAlumniSpotlight(req, res) {
    try {
      // Get spotlight alumni (those with high achievement scores or manually selected)
      const spotlightAlumni = await User.find({ 
        userType: 'alumni', 
        status: 'approved',
        // For demo purposes, we'll select alumni with achievements or high mentorship counts
        $or: [
          { 'badges.0': { $exists: true } },
          { 'mentorship.availability.0': { $exists: true } }
        ]
      }).select('-password')
        .limit(10);
      
      // Get featured alumni (recently active or with notable achievements)
      const featuredAlumni = await User.find({ 
        userType: 'alumni', 
        status: 'approved',
        // For demo purposes, we'll select recently created accounts
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }).select('-password')
        .limit(10);
      
      res.json({
        success: true,
        data: {
          spotlight: spotlightAlumni,
          featured: featuredAlumni
        }
      });
    } catch (error) {
      console.error('Get alumni spotlight error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alumni spotlight data'
      });
    }
  }
  
  // Get overall analytics data (combines multiple metrics)
  static async getOverallAnalytics(req, res) {
    try {
      // Get total alumni count
      const totalAlumni = await User.countDocuments({ 
        userType: 'alumni', 
        status: 'approved'
      });
      
      // Get active users (logged in recently)
      const activeUsers = await User.countDocuments({ 
        userType: 'alumni', 
        status: 'approved',
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      });
      
      // Get events count (would need to import Event model)
      const eventsCount = 0; // Placeholder
      
      // Get job placements (would need separate tracking)
      const jobPlacements = 0; // Placeholder
      
      // Engagement rate (approximation)
      const engagementRate = totalAlumni > 0 ? Math.round((activeUsers / totalAlumni) * 100) : 0;
      
      // Monthly growth (approximation)
      const previousMonth = await User.countDocuments({ 
        userType: 'alumni', 
        status: 'approved',
        createdAt: { 
          $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      });
      
      const currentMonth = await User.countDocuments({ 
        userType: 'alumni', 
        status: 'approved',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      
      const monthlyGrowth = previousMonth > 0 ? 
        Math.round(((currentMonth - previousMonth) / previousMonth) * 100) : 0;
      
      res.json({
        success: true,
        data: {
          totalAlumni,
          activeUsers,
          eventsThisYear: eventsCount,
          jobPlacements,
          engagementRate,
          monthlyGrowth
        }
      });
    } catch (error) {
      console.error('Get overall analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overall analytics'
      });
    }
  }
  
  // Get activity analytics data for both alumni and students
  static async getActivityAnalytics(req, res) {
    try {
      const { type = 'alumni' } = req.query;
      
      let users;
      
      if (type === 'alumni') {
        users = await User.find({ 
          userType: 'alumni', 
          status: 'approved'
        }).select('firstName lastName department graduationYear');
      } else if (type === 'student') {
        users = await User.find({ 
          userType: 'student', 
          status: 'approved'
        }).select('firstName lastName department currentYear');
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid type parameter. Must be "alumni" or "student"'
        });
      }
      
      // Transform users into activity data format
      const activityData = users.map(user => {
        // Generate mock engagement data (in a real app, this would come from actual activity tracking)
        const avgMentorships = Math.floor(Math.random() * 10) + 1;
        const feedback = Math.floor(Math.random() * 5) + 6; // 6-10
        const avgTimeSpent = Math.floor(Math.random() * 8) + 1; // 1-8 hours
        const impactScore = calculateImpactScore(avgMentorships, avgTimeSpent, feedback);
        
        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          batch: type === 'alumni' ? user.graduationYear : user.currentYear,
          department: user.department,
          avgMentorships,
          feedback,
          avgTimeSpent,
          impactScore: parseFloat(impactScore.toFixed(2)),
          initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
        };
      });
      
      // Calculate top performer
      const topPerformer = activityData.reduce((max, current) => 
        current.impactScore > max.impactScore ? current : max, 
        activityData[0]
      );
      
      // Calculate average engagement
      const avgEngagement = activityData.length > 0 
        ? activityData.reduce((sum, user) => sum + user.impactScore, 0) / activityData.length 
        : 0;
      
      res.json({
        success: true,
        data: {
          list: activityData,
          topPerformer,
          avgEngagement: parseFloat(avgEngagement.toFixed(2)),
          totalUsers: activityData.length
        }
      });
    } catch (error) {
      console.error('Get activity analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity analytics'
      });
    }
  }
}

module.exports = { AnalyticsController };