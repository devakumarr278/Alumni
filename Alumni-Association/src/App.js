import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './assets/styles/global.css';
import './assets/styles/events.css'; // Added import for events styling

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PostProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <AppRouter />
            </div>
          </Router>
        </PostProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;