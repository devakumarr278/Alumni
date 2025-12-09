import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import UnifiedActivityAnalytics from '../UnifiedActivityAnalytics';

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('UnifiedActivityAnalytics Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('loads alumni data by default', async () => {
    // Mock successful API response for alumni data
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          list: [
            {
              id: 1,
              name: "Dr. Sarah Johnson",
              batch: 2015,
              department: "CSE",
              avgMentorships: 8,
              feedback: 9,
              avgTimeSpent: 7,
              impactScore: 8.1,
              initials: "SJ"
            }
          ],
          topPerformer: {
            id: 1,
            name: "Dr. Sarah Johnson",
            batch: 2015,
            department: "CSE",
            avgMentorships: 8,
            feedback: 9,
            avgTimeSpent: 7,
            impactScore: 8.1,
            initials: "SJ"
          },
          avgEngagement: 8.1,
          totalUsers: 1
        }
      })
    });

    render(
      <BrowserRouter>
        <UnifiedActivityAnalytics />
      </BrowserRouter>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/activity?type=alumni');
    });

    // Check that the alumni data is displayed
    expect(screen.getByText('Activity Analytics')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('8.1/10')).toBeInTheDocument(); // avg engagement
  });

  test('switches to student data when student button is clicked', async () => {
    // Mock successful API response for alumni data (initial load)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          list: [
            {
              id: 1,
              name: "Dr. Sarah Johnson",
              batch: 2015,
              department: "CSE",
              avgMentorships: 8,
              feedback: 9,
              avgTimeSpent: 7,
              impactScore: 8.1,
              initials: "SJ"
            }
          ],
          topPerformer: {
            id: 1,
            name: "Dr. Sarah Johnson",
            batch: 2015,
            department: "CSE",
            avgMentorships: 8,
            feedback: 9,
            avgTimeSpent: 7,
            impactScore: 8.1,
            initials: "SJ"
          },
          avgEngagement: 8.1,
          totalUsers: 1
        }
      })
    });

    // Mock successful API response for student data (after click)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          list: [
            {
              id: 1,
              name: "Arun Kumar",
              batch: 2022,
              department: "CSE",
              avgMentorships: 3,
              feedback: 7,
              avgTimeSpent: 4,
              impactScore: 5.1,
              initials: "AK"
            }
          ],
          topPerformer: {
            id: 1,
            name: "Arun Kumar",
            batch: 2022,
            department: "CSE",
            avgMentorships: 3,
            feedback: 7,
            avgTimeSpent: 4,
            impactScore: 5.1,
            initials: "AK"
          },
          avgEngagement: 5.1,
          totalUsers: 1
        }
      })
    });

    render(
      <BrowserRouter>
        <UnifiedActivityAnalytics />
      </BrowserRouter>
    );

    // Wait for initial alumni data to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/activity?type=alumni');
    });

    // Click the student button
    const studentButton = screen.getByText('🧑🎓 Students');
    fireEvent.click(studentButton);

    // Wait for student data to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/activity?type=student');
    });

    // Check that the student data is displayed
    expect(screen.getByText('Arun Kumar')).toBeInTheDocument();
    expect(screen.getByText('5.1/10')).toBeInTheDocument(); // avg engagement
  });

  test('shows loading state while fetching data', async () => {
    // Mock delayed API response
    mockFetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
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
      }, 100);
    }));

    render(
      <BrowserRouter>
        <UnifiedActivityAnalytics />
      </BrowserRouter>
    );

    // Check that loading state is shown
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});