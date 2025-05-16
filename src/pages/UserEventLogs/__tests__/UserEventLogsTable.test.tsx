import * as React from 'react';

import type { SortingState } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserEventLogsTable } from '../fragments/UserEventLogsTable';

const mockDataTableComponent = vi.fn();

interface DataTableProps {
  columns: Array<{
    id?: string;
    accessorKey?: string;
    header?: string | React.ReactNode;
    cell?: (props: { row?: { index: number }; getValue?: () => unknown }) => React.ReactNode;
    enableSorting?: boolean;
  }>;
  data: Array<{
    type: string;
    timestamp: number;
    details?: Record<string, unknown>;
  }>;
  sorting?: SortingState;
  onSortingChange?: (newSorting: SortingState) => void;
}

vi.mock('@/components/ui/DataTable', () => ({
  DataTable: (props: DataTableProps) => {
    mockDataTableComponent(props);
    return (
      <div data-testid="data-table">
        <div data-testid="columns-count">{props.columns.length}</div>
        <div data-testid="rows-count">{props.data.length}</div>
        <div data-testid="sorting-value">
          {props.sorting ? JSON.stringify(props.sorting) : 'undefined'}
        </div>
        {props.onSortingChange && (
          <button
            data-testid="change-sorting"
            onClick={() => {
              if (props.onSortingChange) {
                props.onSortingChange([{ id: 'timestamp', desc: true }]);
              }
            }}
          >
            Sort
          </button>
        )}
      </div>
    );
  },
}));

describe('UserEventLogsTable', () => {
  const mockEvents = [
    { type: 'page_view', timestamp: 1620000000000, details: { page: 'home' } },
    {
      type: 'button_click',
      timestamp: 1620000060000,
      details: { buttonId: 'submit' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockDataTableComponent.mockClear();
  });

  it('renders with events data and passes correct props to DataTable', () => {
    render(<UserEventLogsTable events={mockEvents} />);

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('columns-count').textContent).toBe('4');
    expect(screen.getByTestId('rows-count').textContent).toBe('2');

    expect(mockDataTableComponent).toHaveBeenCalled();
    const passedProps = mockDataTableComponent.mock.calls[0][0];
    expect(passedProps.columns.length).toBe(4);
    expect(passedProps.data).toEqual(mockEvents);
  });

  it('passes sorting props to DataTable', () => {
    const mockSorting: SortingState = [{ id: 'timestamp', desc: false }];
    const mockSortingChange = vi.fn();

    render(
      <UserEventLogsTable
        events={mockEvents}
        sorting={mockSorting}
        onSortingChange={mockSortingChange}
      />,
    );

    expect(screen.getByTestId('sorting-value').textContent).toBe(JSON.stringify(mockSorting));

    screen.getByTestId('change-sorting').click();
    expect(mockSortingChange).toHaveBeenCalledWith([{ id: 'timestamp', desc: true }]);
  });

  it('renders without optional props', () => {
    render(<UserEventLogsTable events={mockEvents} />);

    expect(screen.getByTestId('sorting-value').textContent).toBe('undefined');
    expect(screen.queryByTestId('change-sorting')).not.toBeInTheDocument();
  });

  it('defines all columns with correct configuration', () => {
    render(<UserEventLogsTable events={mockEvents} />);

    const passedProps = mockDataTableComponent.mock.calls[0][0];
    const columns = passedProps.columns;

    expect(columns[0].id).toBe('no');
    expect(columns[0].header).toBe('No');
    expect(typeof columns[0].cell).toBe('function');

    expect(columns[1].accessorKey).toBe('timestamp');
    expect(columns[1].header).toBe('Timestamp');
    expect(columns[1].enableSorting).toBe(true);

    expect(columns[2].accessorKey).toBe('type');
    expect(columns[2].header).toBe('Event Type');
    expect(columns[2].enableSorting).toBe(false);

    expect(columns[3].accessorKey).toBe('details');
    expect(columns[3].header).toBe('Details');
    expect(columns[3].enableSorting).toBe(false);

    const noCell = columns[0].cell({ row: { index: 5 } });
    expect(noCell).toBe(6);

    const timeValue = new Date(1620000000000).toLocaleString();
    const timeCell = columns[1].cell({ getValue: () => 1620000000000 });
    expect(timeCell).toBe(timeValue);

    const detailsCell = columns[3].cell({ getValue: () => ({ test: true }) });
    expect(detailsCell.type).toBe('pre');

    const emptyDetailsCell = columns[3].cell({ getValue: () => null });
    expect(emptyDetailsCell).toBe('-');
  });
});
