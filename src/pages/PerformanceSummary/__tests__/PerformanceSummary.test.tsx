import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserEventContext } from '@/context/UserEventContextValue';

import PerformanceSummary from '../PerformanceSummary';

vi.mock('../fragments/Filters', () => ({
  Filters: ({
    filterDate,
    filterName,
    filterKpiType,
    onDateChange,
    onNameChange,
    onKpiTypeChange,
    loading,
    onReset,
  }: {
    filterDate?: string;
    filterName?: string;
    filterKpiType?: string;
    onDateChange: (date: string) => void;
    onNameChange: (name: string) => void;
    onKpiTypeChange: (type: string) => void;
    loading: boolean;
    onReset: () => void;
  }) => (
    <div data-testid="filters">
      <button data-testid="date-filter" onClick={() => onDateChange('2023-01-01')}>
        Filter Date
      </button>
      <button data-testid="name-filter" onClick={() => onNameChange('Test Client')}>
        Filter Name
      </button>
      <button data-testid="kpi-filter" onClick={() => onKpiTypeChange('CTR')}>
        Filter KPI
      </button>
      <button data-testid="reset-filter" onClick={onReset}>
        Reset
      </button>
      <span data-testid="loading-state">{loading ? 'Loading' : 'Not Loading'}</span>
      <span data-testid="filter-values">
        {JSON.stringify({
          date: filterDate,
          name: filterName,
          kpi: filterKpiType,
        })}
      </span>
    </div>
  ),
}));

vi.mock('../fragments/ClientsTable', () => ({
  ClientsTable: ({
    clients,
    page,
    totalPages,
    sorting,
    onSortingChange,
    onPageChange,
    onClientClick,
  }: {
    clients: Array<unknown>;
    page: number;
    totalPages: number;
    sorting: Array<{ id: string; desc: boolean }>;
    onSortingChange: (sorting: Array<{ id: string; desc: boolean }>) => void;
    onPageChange: (page: number) => void;
    onClientClick: (client: unknown) => void;
  }) => (
    <div data-testid="clients-table">
      <button
        data-testid="sort-button"
        onClick={() => onSortingChange([{ id: 'name', desc: true }])}
      >
        Sort
      </button>
      <button data-testid="page-button" onClick={() => onPageChange(2)}>
        Next Page
      </button>
      <button
        data-testid="client-click"
        onClick={() => onClientClick(clients[0])}
        disabled={clients.length === 0}
      >
        Click Client
      </button>
      <span data-testid="table-data">
        {JSON.stringify({
          clientCount: clients.length,
          page,
          totalPages,
          sorting,
        })}
      </span>
    </div>
  ),
}));

vi.mock('../fragments/ClientDetailsDialog', () => ({
  ClientDetailsDialog: ({
    open,
    onOpenChange,
    client,
  }: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    client: { name: string } | null;
  }) => (
    <div data-testid="client-dialog" className={open ? 'open' : 'closed'}>
      <button data-testid="close-dialog" onClick={() => onOpenChange(false)}>
        Close
      </button>
      <span data-testid="dialog-client">{client ? client.name : 'No client'}</span>
    </div>
  ),
}));

vi.mock('@/components/ui/TableSkeleton', () => ({
  TableSkeleton: () => <div data-testid="table-skeleton">Loading...</div>,
}));

vi.mock('@/components/ui/NotFound', () => ({
  NotFound: ({ message }: { message: string }) => <div data-testid="not-found">{message}</div>,
}));

const fetchMock = vi.fn();
global.fetch = fetchMock;

const mockClients = [
  {
    id: '1',
    name: 'Client 1',
    kpiType: 'CTR',
    targetKpi: 5,
    actual: 4.8,
    value: 4.8,
    date: '2023-01-01',
  },
  {
    id: '2',
    name: 'Client 2',
    kpiType: 'CPC',
    targetKpi: 2,
    actual: 1.8,
    value: 1.8,
    date: '2023-01-01',
  },
];

const mockApiResponse = {
  clients: mockClients,
  meta: {
    total: 2,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

const mockTrackEvent = vi.fn();

describe('PerformanceSummary', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    fetchMock.mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component and fetches data', async () => {
    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('clients-table')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/clients?page=1&pageSize=10');

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'get_data',
      expect.objectContaining({
        route: expect.any(String),
        params: expect.any(String),
        sort: expect.any(String),
        page: 1,
      }),
    );
  });

  it('handles filter changes', async () => {
    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('clients-table')).toBeInTheDocument();
    });

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('date-filter'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/clients?page=1&pageSize=10&date=2023-01-01');
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'user_interact',
      expect.objectContaining({
        type: 'filter_date',
        value: '2023-01-01',
      }),
    );

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('name-filter'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/clients?page=1&pageSize=10&date=2023-01-01&name=Test+Client',
      );
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'user_interact',
      expect.objectContaining({
        type: 'filter_name',
        value: 'Test Client',
      }),
    );

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('kpi-filter'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/clients?page=1&pageSize=10&date=2023-01-01&name=Test+Client&kpiType=CTR',
      );
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'user_interact',
      expect.objectContaining({
        type: 'filter_kpiType',
        value: 'CTR',
      }),
    );

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('reset-filter'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/clients?page=1&pageSize=10');
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'user_interact',
      expect.objectContaining({
        type: 'reset_filter',
        value: '',
      }),
    );
  });

  it('handles sorting change', async () => {
    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('clients-table')).toBeInTheDocument();
    });

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('sort-button'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/clients?page=1&pageSize=10&sort=name&order=desc',
      );
    });
  });

  it('handles pagination', async () => {
    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('clients-table')).toBeInTheDocument();
    });

    vi.clearAllMocks();

    await act(async () => {
      fireEvent.click(screen.getByTestId('page-button'));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/clients?page=2&pageSize=10');
    });
  });

  it('handles client selection and dialog', async () => {
    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('clients-table')).toBeInTheDocument();
    });

    expect(screen.getByTestId('client-dialog')).toHaveClass('closed');

    await act(async () => {
      fireEvent.click(screen.getByTestId('client-click'));
    });

    expect(screen.getByTestId('client-dialog')).toHaveClass('open');
    expect(screen.getByTestId('dialog-client')).toHaveTextContent('Client 1');
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'user_interact',
      expect.objectContaining({
        type: 'on_click_detail',
        value: 'Client 1',
      }),
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('close-dialog'));
    });

    expect(screen.getByTestId('client-dialog')).toHaveClass('closed');
  });

  it('handles API error', async () => {
    fetchMock.mockRejectedValue(new Error('API error'));

    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    expect(screen.getByTestId('not-found')).toHaveTextContent('Tidak ada data yang ditemukan');
  });

  it('displays not found when API returns empty data', async () => {
    fetchMock.mockResolvedValue({
      json: () =>
        Promise.resolve({
          clients: [],
          meta: {
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0,
          },
        }),
    });

    render(
      <UserEventContext.Provider value={{ events: [], trackEvent: mockTrackEvent }}>
        <PerformanceSummary />
      </UserEventContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    expect(screen.getByTestId('not-found')).toHaveTextContent('Tidak ada data yang ditemukan');
  });
});
