# Unified Activity Analytics

## Overview

The Unified Activity Analytics feature provides a single page that displays activity analytics for both Alumni and Students with the same UI and features, but switches data sources based on user selection.

## Features

- Toggle between Alumni and Student analytics
- Real-time data visualization with interactive charts
- Live updates every 3 seconds
- Top performer identification
- Average engagement metrics
- Department and batch filtering
- Responsive design

## Implementation Details

### Frontend

The frontend is implemented as a React component `UnifiedActivityAnalytics.js` that:

1. Provides toggle buttons to switch between Alumni and Student views
2. Fetches data from the backend API based on the selected view
3. Displays data using Recharts for visualization
4. Shows live updates with simulated data changes
5. Provides filtering options for batches and departments

### Backend

The backend endpoint is implemented in `analyticsController.js` with the `getActivityAnalytics` method:

- Endpoint: `GET /api/analytics/activity?type=:type`
- Supports `alumni` and `student` types
- Returns structured data including:
  - List of users with activity metrics
  - Top performer information
  - Average engagement score
  - Total user count

### Data Structure

The API returns data in the following format:

```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "user_id",
        "name": "Full Name",
        "batch": 2020,
        "department": "CSE",
        "avgMentorships": 5,
        "feedback": 8,
        "avgTimeSpent": 4,
        "impactScore": 6.2,
        "initials": "FN"
      }
    ],
    "topPerformer": {
      // Same structure as list items
    },
    "avgEngagement": 6.2,
    "totalUsers": 10
  }
}
```

## Usage

### Accessing the Feature

1. Log in as an institution user
2. Navigate to `/institution/unified-activity-analytics`
3. Toggle between Alumni and Student views using the buttons at the top

### Filtering Data

- Use the dropdown filters to narrow down data by:
  - Batch/Graduation Year
  - Department
  - Time Period (not yet implemented in backend)

### Interacting with Charts

- Hover over avatars to see detailed user information
- The top performer is highlighted with a crown emoji 👑
- Bars are colored by department for better visualization

## Future Enhancements

1. Connect to real-time WebSocket for live updates
2. Implement actual activity tracking instead of simulated data
3. Add export functionality for analytics data
4. Implement time period filtering in the backend
5. Add comparison charts between alumni and student engagement

## API Endpoints

- `GET /api/analytics/activity?type=alumni` - Get alumni activity data
- `GET /api/analytics/activity?type=student` - Get student activity data

## Error Handling

The component gracefully handles:
- Network errors by falling back to mock data
- Invalid API responses by showing error messages
- Empty datasets by displaying informative messages

## Testing

Unit tests are available in `__tests__/UnifiedActivityAnalytics.test.js` covering:
- Component rendering
- Toggle functionality
- Data fetching
- Loading states