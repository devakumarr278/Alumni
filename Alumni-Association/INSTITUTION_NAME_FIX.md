# Fix for Institution Name Display Issue

## Problem
When institutions register (e.g., SSN), the dashboard still shows hardcoded institution names like "SKCET Administration" instead of the actual registered institution name.

## Root Cause
The institution name was hardcoded in multiple components instead of using the actual user data from the authentication context.

## Fixes Implemented

### 1. InstitutionLayout.js
- Updated the user dropdown to display the actual institutional email instead of hardcoded "admin@college.edu"
- Used `user?.institutionalEmail || user?.email || 'Institution User'` to show the correct email
- For mobile view, show truncated email: `user?.institutionalEmail ? \`${user.institutionalEmail.substring(0, 10)}...\` : 'Institution...'`

### 2. InstitutionDashboard.js
- Added `useAuth` hook to access actual user data
- Created `getInstitutionName()` function to extract institution name from user data:
  ```javascript
  const getInstitutionName = () => {
    if (user?.institutionName) {
      return user.institutionName;
    }
    if (user?.name) {
      return user.name;
    }
    if (user?.institutionalEmail) {
      // Extract institution name from email domain
      const domain = user.institutionalEmail.split('@')[1];
      return domain ? `${domain.split('.')[0].toUpperCase()} Institution` : 'Institution';
    }
    return 'Institution';
  };
  ```
- Updated welcome message to use dynamic institution name: `Welcome back, {getInstitutionName()}`

### 3. Profile.js
- Added `useAuth` hook to access actual user data
- Initialized profile data with user information in a `useEffect` hook
- Created `getInitials()` function to generate avatar initials from institution name
- Made social media section conditional (only shows if data exists)
- Used actual user data for all profile fields:
  - Institution name
  - Established year
  - Location/address
  - Website
  - Email
  - Phone
  - Description

## How It Works Now

1. When an institution registers (e.g., SSN), their information is stored in the AuthContext
2. All institution components now access this data through the `useAuth` hook
3. The dashboard displays the actual institution name instead of hardcoded values
4. Profile information is pre-populated with registration data
5. Contact information shows the actual institutional email and details

## Testing

To verify the fix:
1. Register as a new institution (e.g., SSN)
2. Complete email verification
3. Check that the dashboard shows "Welcome back, [Your Institution Name]"
4. Verify that the profile page shows your institution's actual information
5. Confirm that the user dropdown shows your institutional email

## Benefits

- ✅ Institutions see their actual name in the dashboard
- ✅ Profile information is pre-populated with registration data
- ✅ Contact information displays correctly
- ✅ No more hardcoded institution names
- ✅ Dynamic avatars based on institution names
- ✅ Better user experience with personalized information