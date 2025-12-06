# Institution Alumni Verification System

This document describes the implementation of the alumni verification system that routes verification requests to specific institutions.

## Overview

The system now links each alumni with their institution and ensures that:
1. Alumni verification requests are sent only to their specific institution
2. Institutions can only see and verify alumni from their own institution
3. Notifications are filtered by institution

## Key Components

### 1. Institution Model
- Created a new Institution model with fields for name, email, contact information
- Institutions are stored separately from users

### 2. User Model Updates
- Added `institutionId` field to link alumni with their institution
- The field is required for alumni users

### 3. Notification Model
- Created a Notification model to track verification requests
- Notifications are linked to specific institutions

### 4. Registration Process
- When alumni register, they are linked to their institution via `institutionId`
- A notification is automatically created for the institution
- Alumni start with `status: 'pending'`

### 5. Institution Controller Updates
- `getPendingAlumni`: Now filters alumni by the logged-in institution
- `verifyAlumni`: Checks that only the correct institution can verify an alumni
- `getNotifications`: Returns notifications specific to the institution

### 6. Routes
- Updated institution routes to use proper authentication middleware

## Implementation Details

### Database Models

#### Institution Schema
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  website: String,
  contactPerson: {
    name: String,
    email: String,
    phone: String
  }
}
```

#### Updated User Schema
```javascript
{
  // ... existing fields ...
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: function() { return this.userType === 'alumni'; }
  }
}
```

#### Notification Schema
```javascript
{
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
  type: String,
  message: String,
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### API Endpoints

#### Institution Routes
- `GET /institution/pending` - Get pending alumni for the institution
- `POST /institution/verify/:alumniId` - Verify an alumni (approve/reject)
- `GET /institution/notifications` - Get notifications for the institution

## Testing

### Scripts
- `npm run add-institutions` - Add mock institutions to the database
- `npm run test-alumni` - Test alumni registration and verification flow

## Security

- Only the correct institution can verify an alumni
- Authentication is required for all institution endpoints
- Data is filtered by institution ID to prevent unauthorized access

## Future Improvements

1. Implement a separate authentication system for institutions
2. Add more sophisticated AI verification logic
3. Implement email notifications for institutions
4. Add institution dashboard UI components
5. Create institution registration process