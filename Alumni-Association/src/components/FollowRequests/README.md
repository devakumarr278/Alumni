# Follow Requests Component

This component implements the follow requests management system for alumni users.

## Features

1. **Dual Panel Interface**
   - Follow Requests tab: Shows pending student connection requests
   - Followers tab: Shows approved followers

2. **Request Management**
   - Accept follow requests (✅ button)
   - Reject follow requests (❌ button)
   - View detailed student profiles

3. **Animations & UX**
   - Smooth transitions between tabs
   - Animated card hover effects
   - Profile modal with scale and rotate animations
   - Skill tag floating animations
   - Avatar breathing glow effect
   - Button press pop effects
   - Smooth accept/reject removal animations

4. **Responsive Design**
   - Works on mobile devices (350-420px width)
   - Scalable avatars
   - Chip wrapping for skills

## Components

### FollowRequests.jsx
Main container component that manages state and fetches data from the backend.

### FollowRequestItem.jsx
Individual request item component with accept/reject buttons.

### ProfileModal.jsx
Detailed profile modal with glass UI design.

## API Endpoints

- `GET /api/follow/requests` - Get pending follow requests
- `GET /api/follow/followers` - Get approved followers
- `POST /api/follow/requests/:id/approve` - Approve a follow request
- `POST /api/follow/requests/:id/reject` - Reject a follow request

## Data Structure

### FollowRequest
```javascript
{
  from: ObjectId(User),    // Student requesting to follow
  to: ObjectId(User),      // Alumni being requested
  createdAt: Date
}
```

### Followers
```javascript
{
  follower: ObjectId(User),    // Student following
  following: ObjectId(User),   // Alumni being followed
  createdAt: Date
}
```

## Styling

- Dark navy premium theme (#101c2c)
- Soft glass overlay blur
- Rounded 14-18px corners
- Subtle shadows
- Chip-based skills
- Neon hover glow for links