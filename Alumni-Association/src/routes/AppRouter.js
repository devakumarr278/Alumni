import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../context/AuthContext';
import { StudentProvider } from '../pages/studentpart/StudentContext';
import Home from '../pages/Home';
import About from '../pages/About';
import Events from '../pages/Events';
import Posts from '../pages/Posts';
import AlumniDirectory from '../pages/AlumniDirectory';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register_new';
import PendingApproval from '../pages/PendingApproval';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageNotFound from '../components/common/PageNotFound';
import InstitutionLayout from '../layout/InstitutionLayout';

// Institution dashboard components
import InstitutionPostFeed from '../pages/institution/InstitutionPostFeed';
import InstitutionDashboard from '../pages/institution/InstitutionDashboard';
import AlumniManagement from '../pages/institution/AlumniManagement';
import EventsManagement from '../pages/institution/EventsManagement';
import Analytics from '../pages/institution/Analytics';
import Profile from '../pages/institution/Profile';
import Notifications from '../pages/institution/Notifications';
import RSVPManagement from '../pages/institution/RSVPManagement';
import InstitutionSidebar from '../components/institution/InstitutionSidebar';
import InstitutionAdminLayout from '../layout/InstitutionAdminLayout';
import MentorshipSummary from '../pages/institution/MentorshipSummary';
import LocationHeatmap from '../pages/institution/LocationHeatmap';
import AlumniSpotlight from '../pages/institution/AlumniSpotlight';
import StudentManagement from '../pages/institution/StudentManagement';

// Import new admin pages
import AdminDashboard from '../pages/institution/AdminDashboard';
import AdminAlumniVerification from '../pages/institution/AdminAlumniVerification';
import AdminAlumniManagement from '../pages/institution/AdminAlumniManagement';
import AdminMentorshipSummary from '../pages/institution/AdminMentorshipSummary';
import AdminEventsManagement from '../pages/institution/AdminEventsManagement';
import AdminAnalytics from '../pages/institution/AdminAnalytics';
import AdminSettings from '../pages/institution/AdminSettings';

// Import new Alumni Management page
import AlumniManagementPage from '../pages/institution/AlumniManagementPage';

// Import new Alumni Activity Analytics page
import UnifiedActivityAnalytics from '../pages/institution/UnifiedActivityAnalytics';

// Alumni dashboard components
import AlumniProfile from '../pages/aluminilogin/Profile';
import Connections from '../pages/aluminilogin/Connections';
import MyEvents from '../pages/aluminilogin/MyEvents';
import PostsAlumni from '../pages/aluminilogin/Posts';
import Mentorship from '../pages/aluminilogin/Mentorship';
import Achievements from '../pages/aluminilogin/Achievements';
import NotificationsAlumni from '../pages/aluminilogin/Notifications';
import AlumniLayoutNew from '../layout/AlumniLayoutNew';
import NewAlumniDashboard from '../pages/aluminilogin/NewDashboard';
import AlumniStudentDirectory from '../pages/aluminilogin/AlumniStudentDirectory';
import JobsReferrals from '../pages/aluminilogin/JobsReferrals';
import Fundraising from '../pages/aluminilogin/Fundraising';
import BadgesRecognition from '../pages/aluminilogin/BadgesRecognition';
import MentorshipRequests from '../pages/aluminilogin/MentorshipRequests';
import MentorshipCalendar from '../pages/aluminilogin/MentorshipCalendar';
import CompletedRequests from '../pages/aluminilogin/CompletedRequests';
import FollowRequestsPage from '../pages/aluminilogin/FollowRequests';

import TestFollowRequests from '../pages/aluminilogin/TestFollowRequests';
import SimpleTest from '../pages/aluminilogin/SimpleTest';
import ComponentTest from '../pages/aluminilogin/ComponentTest';
import TestPage from '../pages/aluminilogin/TestPage';

// Student dashboard components
import StudentDashboard from '../pages/studentpart/index.jsx'; // Fixed import to explicitly reference index.jsx
import CareerRoadmap from '../pages/studentpart/CareerRoadmap.jsx';

// Student dashboard components
import StudentProfile from '../pages/studentpart/StudentProfile'; // Updated to use the new component
import StudentDirectory from '../pages/studentpart/directory';
import StudentMentorship from '../pages/studentpart/mentorship';
import MyBookings from '../pages/studentpart/MyBookings';
import StudentJobs from '../pages/studentpart/jobs';
import StudentEvents from '../pages/studentpart/events';
import StudentBadges from '../pages/studentpart/badges';
import StudentNotifications from '../pages/studentpart/notifications';
import StudentPledges from '../pages/studentpart/pledges';
import TestProfile from '../pages/studentpart/TestProfile';

// New AI-powered student features
import SkillAnalyzer from '../pages/studentpart/SkillAnalyzer';
import ResumeImprover from '../pages/studentpart/ResumeImprover';
import DailyTasks from '../pages/studentpart/DailyTasks';
import ProjectSuggestions from '../pages/studentpart/ProjectSuggestions';
import AIProjectSuggestions from '../pages/studentpart/AIProjectSuggestions';
import InterviewPrep from '../pages/studentpart/InterviewPrep';
import SkillGapAnalyzer from '../pages/studentpart/SkillGapAnalyzer';
import IndustryInsights from '../pages/studentpart/IndustryInsights';
import StudentPortfolio from '../pages/studentpart/Portfolio';
import MentorshipTracker from '../pages/studentpart/MentorshipTracker';
import StudentLayout from '../layout/StudentLayout';
// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('PublicRoute check:', { user, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (user) {
    console.log('User already logged in, redirecting to dashboard for role:', user.role || user.userType);
    
    // Redirect to appropriate dashboard based on role
    // Handle both role and userType properties for backward compatibility
    const userRole = user.role || user.userType;
    
    switch (userRole) {
      case USER_ROLES.STUDENT:
        return <Navigate to="/studentpart/dashboard" replace />;
      case USER_ROLES.ALUMNI:
        return <Navigate to="/alumni/dashboard" replace />;
      case USER_ROLES.INSTITUTION:
        return <Navigate to="/institution/post-feed" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (requireAuth && !user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Handle both role and userType properties for backward compatibility
  const userRole = user?.role || user?.userType;
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Dashboard Components (placeholder components)

// Alumni Dashboard Wrapper to check approval status
const AlumniDashboardWrapper = () => {
  const { user } = useAuth();
  
  console.log('AlumniDashboardWrapper: user data:', user);
  
  // Check if alumni user is pending approval
  if (user && user.role === USER_ROLES.ALUMNI && user.status === 'pending') {
    console.log('AlumniDashboardWrapper: User is pending approval, redirecting to pending approval page');
    return <Navigate to="/pending-approval" replace />;
  }
  
  // If user is approved, render the AlumniLayoutNew
  console.log('AlumniDashboardWrapper: Rendering AlumniLayoutNew for approved user');
  return <AlumniLayoutNew />;
};

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Debug route for testing */}
          <Route path="/debug" element={
            <div className="min-h-screen bg-gray-50 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Debug Info</h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Test Alumni Login</h2>
                  <p className="mb-4">Use any of these Gmail credentials to test alumni login:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Option 1:</h3>
                      <p><strong>Email:</strong> test.alumni@gmail.com</p>
                      <p><strong>Password:</strong> test123</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Option 2:</h3>
                      <p><strong>Email:</strong> alumni.test@gmail.com</p>
                      <p><strong>Password:</strong> 123456</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2">Option 3:</h3>
                      <p><strong>Email:</strong> alumni@gmail.com</p>
                      <p><strong>Password:</strong> password</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded border border-orange-200">
                      <h3 className="font-semibold text-orange-800 mb-2">Option 4:</h3>
                      <p><strong>Email:</strong> jane.alumni@gmail.com</p>
                      <p><strong>Password:</strong> Alumni123!</p>
                      <p className="text-xs text-orange-600 mt-1">Will show pending approval page</p>
                    </div>
                  </div>
                  <a href="/login" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Go to Login
                  </a>
                  <a href="/register" className="inline-block mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Go to Register
                  </a>
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> For registration, use any Gmail address for alumni. The system will accept any personal Gmail account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          {/* Auth Routes (redirect if already logged in) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          
          {/* Role-based Dashboards */}
          <Route 
            path="/alumni/*" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ALUMNI]}>
                <AlumniDashboardWrapper />
              </ProtectedRoute>
            }>
            {/* These routes will render inside AlumniLayoutNew via Outlet */}
            <>
              <Route index element={<NewAlumniDashboard />} />
              <Route path="dashboard" element={<NewAlumniDashboard />} />
              <Route path="profile" element={<AlumniProfile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="events" element={<MyEvents />} />
              <Route path="posts" element={<Posts />} />
              <Route path="mentorship" element={<Mentorship />} />
              <Route path="mentorship/requests" element={<MentorshipRequests />} />
              <Route path="mentorship/calendar" element={<MentorshipCalendar />} />
              <Route path="mentorship/completed" element={<CompletedRequests />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="notifications" element={<NotificationsAlumni />} />
              <Route path="directory" element={<AlumniStudentDirectory />} />
              <Route path="jobs" element={<JobsReferrals />} />
              <Route path="fundraising" element={<Fundraising />} />
              <Route path="badges" element={<BadgesRecognition />} />
              <Route path="follow-requests" element={<FollowRequestsPage />} />
              <Route path="test-follow-requests" element={<TestFollowRequests />} />
              <Route path="simple-test" element={<SimpleTest />} />
              <Route path="component-test" element={<ComponentTest />} />
              <Route path="test" element={<TestPage />} />
            </>
            <Route index element={<NewAlumniDashboard />} />
            <Route path="dashboard" element={<NewAlumniDashboard />} />
            <Route path="profile" element={<AlumniProfile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="posts" element={<PostsAlumni />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="mentorship/requests" element={<MentorshipRequests />} />
            <Route path="mentorship/calendar" element={<MentorshipCalendar />} />
            <Route path="mentorship/completed" element={<CompletedRequests />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="notifications" element={<NotificationsAlumni />} />
            <Route path="directory" element={<AlumniStudentDirectory />} />
            <Route path="jobs" element={<JobsReferrals />} />
            <Route path="fundraising" element={<Fundraising />} />
            <Route path="badges" element={<BadgesRecognition />} />
            <Route path="follow-requests" element={<FollowRequestsPage />} />
            <Route path="test-follow-requests" element={<TestFollowRequests />} />
            <Route path="simple-test" element={<SimpleTest />} />
            <Route path="component-test" element={<ComponentTest />} />
            <Route path="test" element={<TestPage />} />

          </Route>
          
          {/* Alternative alumni dashboard route for backward compatibility */}
          <Route 
            path="/alumni-dashboard" 
            element={<Navigate to="/alumni/dashboard" replace />} 
          />
          {/* Institution Dashboard Routes */}
          <Route 
            path="/institution/*" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.INSTITUTION]}>
                <InstitutionLayout />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to="/institution/post-feed" replace />} />
            <Route path="post-feed" element={<InstitutionPostFeed />} />
            <Route path="dashboard" element={<InstitutionDashboard />} />
            <Route path="alumni-verification" element={<AlumniManagement />} />
            <Route path="alumni-management" element={<AlumniManagementPage />} />
            <Route path="student-management" element={<StudentManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="activity-analytics" element={<UnifiedActivityAnalytics />} />
            <Route path="location-heatmap" element={<LocationHeatmap />} />
            <Route path="alumni-spotlight" element={<AlumniSpotlight />} />
          </Route>

          {/* New Institution Admin Routes */}
          <Route 
            path="/institution/admin/*" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.INSTITUTION]}>
                <InstitutionAdminLayout />
              </ProtectedRoute>
            }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verification" element={<AdminAlumniVerification />} />
            <Route path="alumni" element={<AdminAlumniManagement />} />
            <Route path="mentorship" element={<AdminMentorshipSummary />} />
            <Route path="events" element={<AdminEventsManagement />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          // Update the old institution-dashboard route to redirect to the new one
          <Route 
            path="/institution-dashboard" 
            element={<Navigate to="/institution/post-feed" replace />} 
          />
          
          {/* Student Dashboard Routes - Wrapped with single StudentProvider */}
          <Route 
            path="/studentpart/*" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentProvider>
                  <StudentLayout>
                    <Routes>
                      <Route index element={<StudentDashboard />} />
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="profile" element={<StudentProfile />} />
                      <Route path="directory" element={<StudentDirectory />} />
                      <Route path="mentorship" element={<StudentMentorship />} />
                      <Route path="my-bookings" element={<MyBookings />} />
                      <Route path="jobs" element={<StudentJobs />} />
                      <Route path="events" element={<StudentEvents />} />
                      <Route path="badges" element={<StudentBadges />} />
                      <Route path="notifications" element={<StudentNotifications />} />
                      <Route path="pledges" element={<StudentPledges />} />
                      <Route path="roadmap" element={<CareerRoadmap />} />

                      {/* New AI-powered features */}
                      <Route path="skill-analyzer" element={<SkillAnalyzer />} />
                      <Route path="resume-improver" element={<ResumeImprover />} />
                      <Route path="daily-tasks" element={<DailyTasks />} />
                      <Route path="project-suggestions" element={<ProjectSuggestions />} />
                      <Route path="ai-project-suggestions" element={<AIProjectSuggestions />} />
                      <Route path="interview-prep" element={<InterviewPrep />} />
                      <Route path="skill-gap" element={<SkillGapAnalyzer />} />
                      <Route path="industry-insights" element={<IndustryInsights />} />
                      <Route path="portfolio" element={<StudentPortfolio />} />
                      <Route path="mentorship-tracker" element={<MentorshipTracker />} />
                      <Route path="test-profile" element={<TestProfile />} />
                    </Routes>
                  </StudentLayout>
                </StudentProvider>
              </ProtectedRoute>
            } 
          />

          {/* Utility Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;