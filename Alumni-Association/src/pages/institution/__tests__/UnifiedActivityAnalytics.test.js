import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedActivityAnalytics from '../UnifiedActivityAnalytics';

// Mock the fetch API
global.fetch = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('UnifiedActivityAnalytics', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders alumni and student toggle buttons', () => {
    render(<UnifiedActivityAnalytics />);
    
    expect(screen.getByText('🎓 Alumni')).toBeInTheDocument();
    expect(screen.getByText('🧑🎓 Students')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<UnifiedActivityAnalytics />);
    
    // Since we're mocking fetch, we can test the loading state
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('switches between alumni and student views', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          list: [],
          topPerformer: null,
          avgEngagement: 0,
          totalUsers: 0
        }
      })
    });

    render(<UnifiedActivityAnalytics />);
    
    // Wait for initial data load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/analytics/activity?type=alumni');
    });

    // Click on student button
    const studentButton = screen.getByText('🧑🎓 Students');
    studentButton.click();

    // Wait for student data load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/analytics/activity?type=student');
    });
  });

  test('displays chart container', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          list: [
            {
              id: 1,
              name: "Test User",
              batch: 2020,
              department: "CSE",
              avgMentorships: 5,
              feedback: 8,
              avgTimeSpent: 4,
              impactScore: 6.2,
              initials: "TU"
            }
          ],
          topPerformer: {
            id: 1,
            name: "Test User",
            batch: 2020,
            department: "CSE",
            avgMentorships: 5,
            feedback: 8,
            avgTimeSpent: 4,
            impactScore: 6.2,
            initials: "TU"
          },
          avgEngagement: 6.2,
          totalUsers: 1
        }
      })
    });

    render(<UnifiedActivityAnalytics />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Activity Analytics')).toBeInTheDocument();
    });
  });
});