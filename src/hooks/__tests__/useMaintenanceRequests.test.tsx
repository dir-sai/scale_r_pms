import { renderHook, act } from '@testing-library/react';
import { useMaintenanceRequests } from '../useMaintenanceRequests';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      single: vi.fn(),
    })),
  },
}));

describe('useMaintenanceRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch maintenance requests on mount', async () => {
    const mockData = [
      { id: '1', title: 'Fix AC', status: 'pending' },
      { id: '2', title: 'Repair Door', status: 'in_progress' },
    ];

    const mockSelect = vi.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });

    (supabase.from as vi.Mock).mockReturnValue({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
    });

    const { result } = renderHook(() => useMaintenanceRequests());

    expect(result.current.loading).toBe(true);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.requests).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch');
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });

    (supabase.from as vi.Mock).mockReturnValue({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
    });

    const { result } = renderHook(() => useMaintenanceRequests());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.requests).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });

  it('should create request with optimistic update', async () => {
    const newRequest = { title: 'New Request', description: 'Test' };
    const mockResponse = { id: '3', ...newRequest, status: 'pending' };

    const mockInsert = vi.fn().mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    });

    const { result } = renderHook(() => useMaintenanceRequests());

    await act(async () => {
      await result.current.createRequest(newRequest);
    });

    const requests = result.current.requests;
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject(mockResponse);
  });

  it('should update request with optimistic update', async () => {
    const initialRequests = [
      { id: '1', title: 'Fix AC', status: 'pending' },
    ];

    const updates = { status: 'completed' };
    const mockResponse = { ...initialRequests[0], ...updates };

    const mockUpdate = vi.fn().mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    (supabase.from as vi.Mock).mockReturnValue({
      update: mockUpdate,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    });

    const { result } = renderHook(() => useMaintenanceRequests());
    result.current.requests = initialRequests;

    await act(async () => {
      await result.current.updateRequest('1', updates);
    });

    expect(result.current.requests[0]).toMatchObject(mockResponse);
  });
}); 