const express = require('express');
const cors = require('cors');
const app = express();

// Mock data for pending alumni
let mockPendingAlumni = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    collegeName: 'Test University',
    rollNumber: 'CS12345',
    department: 'Computer Science',
    graduationYear: 2020,
    status: 'pending',
    userType: 'alumni',
    aiScore: 92,
    createdAt: new Date('2025-10-01')
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    collegeName: 'Test University',
    rollNumber: 'EE98765',
    department: 'Electrical Engineering',
    graduationYear: 2019,
    status: 'pending',
    userType: 'alumni',
    aiScore: 78,
    createdAt: new Date('2025-10-05')
  },
  {
    _id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    collegeName: 'Test University',
    rollNumber: 'ME45678',
    department: 'Mechanical Engineering',
    graduationYear: 2021,
    status: 'pending',
    userType: 'alumni',
    aiScore: 85,
    createdAt: new Date('2025-10-06')
  }
];

// Mock notifications
let mockNotifications = [
  {
    id: 1,
    message: 'You have 3 alumni awaiting verification.',
    type: 'pending_approval',
    timestamp: new Date()
  }
];

app.use(cors());
app.use(express.json());

// Mock endpoint to get pending alumni
app.get('/api/institution/pending', (req, res) => {
  console.log('📥 Institution requested pending alumni list');
  res.json({
    success: true,
    data: mockPendingAlumni
  });
});

// Mock endpoint to verify alumni
app.post('/api/institution/verify/:alumniId', (req, res) => {
  const { alumniId } = req.params;
  const { method, decision } = req.body;
  
  console.log(`✅ Institution ${decision} alumni ID: ${alumniId} using ${method} method`);
  
  // Update the mock data
  mockPendingAlumni = mockPendingAlumni.map(alumni => {
    if (alumni._id === alumniId) {
      return {
        ...alumni,
        status: decision === 'approve' ? (method === 'ai' ? 'auto-approved' : 'approved') : 'rejected'
      };
    }
    return alumni;
  });
  
  // Update notifications
  const pendingCount = mockPendingAlumni.filter(a => a.status === 'pending').length;
  mockNotifications = pendingCount > 0 ? 
    [{ 
      id: Date.now(), 
      message: `You have ${pendingCount} alumni awaiting verification.`, 
      type: 'pending_approval', 
      timestamp: new Date() 
    }] : [];
  
  res.json({
    success: true,
    message: `Alumni ${decision === 'approve' ? 'approved' : 'rejected'} successfully`,
    data: mockPendingAlumni.find(a => a._id === alumniId)
  });
});

// Mock endpoint to get notifications
app.get('/api/institution/notifications', (req, res) => {
  console.log('🔔 Institution requested notifications');
  res.json({
    success: true,
    data: mockNotifications
  });
});

// Mock endpoint to simulate a new alumni registration
app.post('/api/mock/new-alumni', (req, res) => {
  const newAlumni = {
    _id: (mockPendingAlumni.length + 1).toString(),
    ...req.body,
    status: 'pending',
    userType: 'alumni',
    createdAt: new Date()
  };
  
  mockPendingAlumni.push(newAlumni);
  
  // Add notification
  mockNotifications = [{
    id: Date.now(),
    message: `New alumni registration: ${newAlumni.firstName} ${newAlumni.lastName}`,
    type: 'new_registration',
    timestamp: new Date()
  }];
  
  console.log(`🆕 New alumni registered: ${newAlumni.firstName} ${newAlumni.lastName}`);
  
  res.json({
    success: true,
    message: 'New alumni registration simulated successfully',
    data: newAlumni
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Mock Institution API Server running on port ${PORT}`);
  console.log(`📝 Endpoints available:`);
  console.log(`   GET  /api/institution/pending`);
  console.log(`   POST /api/institution/verify/:alumniId`);
  console.log(`   GET  /api/institution/notifications`);
  console.log(`   POST /api/mock/new-alumni`);
  console.log(`\n🧪 To test with a new alumni registration:`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/mock/new-alumni \\`);
  console.log(`        -H "Content-Type: application/json" \\`);
  console.log(`        -d '{"firstName":"Test","lastName":"User","email":"test@example.com","collegeName":"Test University","rollNumber":"TEST001","department":"Testing","graduationYear":2025}'`);
});