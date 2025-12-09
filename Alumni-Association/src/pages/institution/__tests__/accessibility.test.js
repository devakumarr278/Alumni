import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import UnifiedActivityAnalytics from '../UnifiedActivityAnalytics';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      data: {
        list: [],
        topPerformer: null,
        avgEngagement: 0,
        totalUsers: 0
      }
    })
  })
);

describe('UnifiedActivityAnalytics Accessibility', () => {
  test('renders the component without crashing', () => {
    render(
      <BrowserRouter>
        <UnifiedActivityAnalytics />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Activity Analytics')).toBeInTheDocument();
    expect(screen.getByText('🎓 Alumni')).toBeInTheDocument();
    expect(screen.getByText('🧑🎓 Students')).toBeInTheDocument();
  });

  test('displays toggle buttons', () => {
    render(
      <BrowserRouter>
        <UnifiedActivityAnalytics />
      </BrowserRouter>
    );
    
    const alumniButton = screen.getByText('🎓 Alumni');
    const studentButton = screen.getByText('🧑🎓 Students');
    
    expect(alumniButton).toBeInTheDocument();
    expect(studentButton).toBeInTheDocument();
    expect(alumniButton).toHaveClass('bg-purple-600');
    expect(studentButton).toHaveClass('bg-gray-100');
  });
});