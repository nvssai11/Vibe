import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Resources from './Resources';
import * as resourceApi from '../../api/resource.api';
import { AuthProvider } from '../../context/AuthContext';

// Mock API calls
jest.mock('../../api/resource.api');

const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  apartment: 'apt123',
  role: 'user'
};

const mockResources = [
  {
    _id: '1',
    title: 'Hammer',
    description: 'For hammering nails',
    status: 'available',
    owner: { _id: 'user456', name: 'Owner User' },
    apartment: 'apt123'
  },
  {
    _id: '2',
    title: 'Drill',
    description: 'Power drill',
    status: 'borrowed',
    owner: { _id: 'user456', name: 'Owner User' },
    borrower: { _id: 'user789', name: 'Borrower User' },
    apartment: 'apt123'
  }
];

describe('Resources Component', () => {
  beforeEach(() => {
    resourceApi.getResources.mockResolvedValue(mockResources);
    resourceApi.requestResource.mockResolvedValue({});
    resourceApi.approveResource.mockResolvedValue({});
    resourceApi.returnResource.mockResolvedValue({});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AuthProvider value={{ user: mockUser }}>
          <Resources />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('should render loading state initially', async () => {
    renderComponent();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('should display resources after loading', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Hammer')).toBeInTheDocument();
      expect(screen.getByText('Drill')).toBeInTheDocument();
    });
  });

  it('should show empty state when no resources', async () => {
    resourceApi.getResources.mockResolvedValue([]);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No resources available')).toBeInTheDocument();
    });
  });

  it('should call requestResource when request button clicked', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Hammer')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Request'));
    await waitFor(() => {
      expect(resourceApi.requestResource).toHaveBeenCalledWith('1');
    });
  });

  it('should call approveResource when approve button clicked', async () => {
    // Change user role to admin for approve button to show
    const adminUser = { ...mockUser, role: 'apartment_admin' };
    render(
      <MemoryRouter>
        <AuthProvider value={{ user: adminUser }}>
          <Resources />
        </AuthProvider>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Hammer')).toBeInTheDocument();
    });
    
    // First request the resource
    fireEvent.click(screen.getByText('Request'));
    await waitFor(() => {
      expect(resourceApi.requestResource).toHaveBeenCalledWith('1');
    });
    
    // Then approve it
    fireEvent.click(screen.getByText('Approve'));
    await waitFor(() => {
      expect(resourceApi.approveResource).toHaveBeenCalledWith('1');
    });
  });
});