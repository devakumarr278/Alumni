# How to Access Unified Activity Analytics

## Overview

The Unified Activity Analytics feature provides a single page that displays activity analytics for both Alumni and Students with the same UI and features, but switches data sources based on user selection.

## Prerequisites

1. You must be logged in as an institution user
2. The backend server must be running
3. The frontend application must be accessible

## Accessing the Feature

### Method 1: Through Navigation Menu

1. Log in to the application as an institution user
2. Once logged in, you'll be redirected to the Institution Dashboard
3. In the left sidebar navigation, look for the "Activity Analytics" menu item
4. Click on the "Activity Analytics" link (icon: 📈)
5. The unified analytics page will load

### Method 2: Direct URL Access

You can also access the page directly using the following URL:
```
http://localhost:3000/institution/activity-analytics
```

Or if deployed to a different host:
```
[your-host]/institution/activity-analytics
```

## Using the Feature

### Switching Between Views

Once the page loads, you'll see two toggle buttons at the top:

1. **🎓 Alumni** - Shows alumni activity analytics (default view)
2. **🧑🎓 Students** - Shows student activity analytics

To switch between views:
1. Click on the "🎓 Alumni" button to view alumni analytics
2. Click on the "🧑🎓 Students" button to view student analytics

The page will automatically reload the data based on your selection.

### Features Available

Both views provide the same features:

1. **Interactive Bar Chart** - Visual representation of user engagement
2. **Live Updates** - Data updates every 3 seconds
3. **Top Performer Highlight** - Crown emoji (👑) identifies the top performer
4. **Summary Cards** - Shows total users, average engagement, and top performer
5. **Filtering Options** - Filter by batch/year and department
6. **Hover Tooltips** - Detailed information when hovering over user avatars

### Data Displayed

For each user, the analytics show:
- Name
- Department
- Batch/Graduation Year
- Average Mentorships/Activities
- Feedback Score
- Time Spent
- Impact Score (calculated metric)

## Troubleshooting

### Page Not Found

If you receive a "Page Not Found" error:

1. Ensure you're logged in as an institution user
2. Check that the backend server is running
3. Verify the route is correctly configured in `AppRouter.js`

### Data Not Loading

If the analytics data doesn't load:

1. Check browser console for JavaScript errors
2. Verify the backend API endpoint is accessible:
   ```
   GET /api/analytics/activity?type=alumni
   GET /api/analytics/activity?type=student
   ```
3. Ensure MongoDB is running and connected

### Styling Issues

If the page doesn't look correct:

1. Check that all CSS classes are properly applied
2. Verify Tailwind CSS is properly configured
3. Ensure there are no conflicting styles

## Backend API Endpoints

The feature uses the following backend endpoints:

- `GET /api/analytics/activity?type=alumni` - Get alumni activity data
- `GET /api/analytics/activity?type=student` - Get student activity data

Both endpoints return data in the same format:
```json
{
  "success": true,
  "data": {
    "list": [...],
    "topPerformer": {...},
    "avgEngagement": 0.0,
    "totalUsers": 0
  }
}
```

## File Locations

- **Frontend Component**: `src/pages/institution/UnifiedActivityAnalytics.js`
- **Backend Controller**: `backend/controllers/analyticsController.js`
- **Backend Routes**: `backend/routes/analytics.js`
- **Frontend Router**: `src/routes/AppRouter.js`
- **Sidebar Navigation**: `src/components/institution/InstitutionSidebar.js`

## Support

If you continue to experience issues, please check:

1. Console logs in browser developer tools
2. Server logs in the terminal where the backend is running
3. Network tab in browser developer tools to see API requests
4. Verify all dependencies are installed and up to date