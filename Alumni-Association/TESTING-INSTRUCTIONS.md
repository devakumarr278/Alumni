# Testing the Alumni Registration and Approval Workflow

This document explains how to test the alumni registration and approval workflow using the mock system.

## Prerequisites

Make sure the following servers are running:
1. Frontend server (http://localhost:3000)
2. Backend server (port 5000)
3. Mock API server (port 3001)

## Servers Setup

### 1. Start the Mock API Server
```bash
cd D:\alumini\Alumni-Association
node mock-institution-api.js
```

### 2. Make sure the frontend is running
The frontend should be running at http://localhost:3000

## Testing Steps

### Step 1: Add Mock Alumni Registration
Run the following command to add a mock alumni registration:
```bash
node add-mock-alumni.js
```

This will add "Alice Johnson" as a pending alumni registration.

### Step 2: Test the Institution Dashboard
1. Open your browser and go to http://localhost:3000
2. Log in as an institution user (you'll need institution credentials)
3. Navigate to the Alumni Verification page
4. You should see the pending alumni list with "Alice Johnson"

### Step 3: Approve the Alumni
1. In the Alumni Verification page, find "Alice Johnson"
2. Click on "View Details"
3. Review the alumni information
4. Click the "Approve" button
5. The alumni status should now be updated

### Step 4: Verify Approval
1. You can run the test script to verify the approval:
```bash
node test-mock-api.js
```

## Using the Mock Alumni Verification Component

To use the mock component instead of the real one:

1. Rename the current AlumniVerification component:
```bash
mv src/pages/institution/AlumniVerification.js src/pages/institution/AlumniVerification.backup.js
```

2. Rename the mock component to replace it:
```bash
mv src/pages/institution/MockAlumniVerification.js src/pages/institution/AlumniVerification.js
```

3. Now when you navigate to the Alumni Verification page in the institution dashboard, it will use the mock component that connects to our mock API.

## Simulating New Registrations

When using the MockAlumniVerification component, you can:
1. Click the "Simulate New Registration" button to add a new mock alumni
2. Use the search and filter functionality to find specific alumni
3. Approve or reject alumni registrations
4. See real-time updates in the UI

## API Endpoints

The mock API provides the following endpoints:
- `GET /api/institution/pending` - Get all pending alumni
- `POST /api/institution/verify/:alumniId` - Approve/reject an alumni
- `GET /api/institution/notifications` - Get institution notifications
- `POST /api/mock/new-alumni` - Add a new mock alumni registration

## Troubleshooting

If you don't see pending alumni in the institution dashboard:
1. Make sure the mock API server is running on port 3001
2. Check that you're using the MockAlumniVerification component
3. Verify that mock data has been added using add-mock-alumni.js or the "Simulate New Registration" button

If you encounter any issues, you can run the test scripts to verify each component:
```bash
node test-mock-api.js     # Test the mock API
node add-mock-alumni.js   # Add a mock alumni registration
```