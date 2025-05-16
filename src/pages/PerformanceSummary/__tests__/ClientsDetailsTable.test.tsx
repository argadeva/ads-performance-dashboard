import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Performance } from '@/types';

import { ClientsDetailsTable } from '../fragments/ClientsDetailsTable';

vi.mock('@/components/ui/DataTable', () => ({
  DataTable: ({ columns, data }: { columns: unknown[]; data: unknown[] }) => (
    <div data-testid="data-table">
      <span>DataTable component</span>
      <span>Columns: {columns ? columns.length : 0}</span>
      <span>Rows: {data ? data.length : 0}</span>
    </div>
  ),
}));

vi.mock('@/components/ui/NotFound', () => ({
  NotFound: () => <div data-testid="not-found">No data found</div>,
}));

vi.mock('../fragments/TableDetailColumns', () => ({
  TableDetailColumns: [
    { id: 'date', header: 'Date' },
    { id: 'impression', header: 'Impression' },
    { id: 'ctr', header: 'CTR' },
    { id: 'click', header: 'Click' },
  ],
}));

describe('ClientsDetailsTable Component', () => {
  const mockPerformanceData: Performance[] = [
    {
      date: '2023-01-01',
      impression: 1000,
      ctr: 2.5,
      click: 25,
    },
    {
      date: '2023-01-02',
      impression: 1200,
      ctr: 3.0,
      click: 36,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the DataTable with performance data', () => {
    render(<ClientsDetailsTable performance={mockPerformanceData} />);

    const dataTable = screen.getByTestId('data-table');
    expect(dataTable).toBeInTheDocument();
    expect(screen.getByText('DataTable component')).toBeInTheDocument();

    expect(screen.getByText('Columns: 4')).toBeInTheDocument();
    expect(screen.getByText('Rows: 2')).toBeInTheDocument();

    expect(screen.queryByTestId('not-found')).not.toBeInTheDocument();
  });

  it('should render the NotFound component when performance array is empty', () => {
    render(<ClientsDetailsTable performance={[]} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByText('No data found')).toBeInTheDocument();

    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('should render the NotFound component when performance array is undefined', () => {
    render(<ClientsDetailsTable performance={undefined} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();

    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('should render the NotFound component when performance array is null', () => {
    render(<ClientsDetailsTable performance={null} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();

    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('should handle performance data with missing fields', () => {
    const incompleteData: Performance[] = [
      { date: '2023-01-03' },
      { date: '2023-01-04', impression: 800 },
      { date: '2023-01-05', ctr: 1.5 },
      { date: '2023-01-06', click: 15 },
    ];

    render(<ClientsDetailsTable performance={incompleteData} />);

    const dataTable = screen.getByTestId('data-table');
    expect(dataTable).toBeInTheDocument();
    expect(screen.getByText('Rows: 4')).toBeInTheDocument();
  });
});
