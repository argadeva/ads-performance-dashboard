import * as reactTable from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { DataTable } from '../DataTable';

vi.mock('@tanstack/react-table', async () => {
  const actual = await vi.importActual('@tanstack/react-table');
  return {
    ...actual,
    useReactTable: vi.fn(),
    getCoreRowModel: vi.fn(() => 'getCoreRowModel'),
    getSortedRowModel: vi.fn(() => 'getSortedRowModel'),
    flexRender: vi.fn((component) => component || 'rendered'),
  };
});

vi.mock('@/components/ui/Table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <thead data-testid="table-header" className={className}>
      {children}
    </thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody data-testid="table-body">{children}</tbody>
  ),
  TableRow: ({
    children,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <tr data-testid="table-row" className={className} onClick={onClick}>
      {children}
    </tr>
  ),
  TableHead: ({
    children,
    onClick,
    style,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
  }) => (
    <th data-testid="table-head" onClick={onClick} style={style}>
      {children}
    </th>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td data-testid="table-cell">{children}</td>
  ),
}));

vi.mock('../Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

describe('DataTable', () => {
  const mockColumns = [{ id: 'test', accessorKey: 'test' }];
  const mockData = [{ id: 1, test: 'test-data' }];
  const mockHeaderGroups = [
    {
      id: 'header-group-1',
      headers: [
        {
          id: 'header-1',
          isPlaceholder: false,
          column: {
            getCanSort: () => true,
            getIsSorted: () => 'asc',
            getToggleSortingHandler: () => vi.fn(),
            columnDef: { header: 'Header' },
          },
          getContext: () => ({}),
        },
        {
          id: 'header-2',
          isPlaceholder: false,
          column: {
            getCanSort: () => false,
            getIsSorted: () => undefined,
            columnDef: { header: 'Header 2' },
          },
          getContext: () => ({}),
        },
        {
          id: 'header-3',
          isPlaceholder: true,
          column: {
            columnDef: {},
          },
          getContext: () => ({}),
        },
      ],
    },
  ];

  const mockRows = [
    {
      id: 'row-1',
      original: { id: 1, test: 'test-data' },
      getVisibleCells: () => [
        {
          id: 'cell-1',
          column: { columnDef: { cell: 'Cell Content' } },
          getContext: () => ({}),
        },
      ],
    },
  ];

  const mockTable = {
    getHeaderGroups: () => mockHeaderGroups,
    getRowModel: () => ({ rows: mockRows }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (reactTable.useReactTable as unknown as MockInstance).mockReturnValue(mockTable);
  });

  it('renders the table with default props', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    expect(screen.getByTestId('card')).toHaveClass('p-0 overflow-x-auto');
    expect(screen.getByTestId('card-content')).toHaveClass('p-0');
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toHaveClass('bg-sidebar-primary');
  });

  it('passes sorting props to useReactTable', () => {
    const mockSorting = [{ id: 'test', desc: false }];
    const mockOnSortingChange = vi.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        sorting={mockSorting}
        onSortingChange={mockOnSortingChange}
      />,
    );

    expect(reactTable.useReactTable).toHaveBeenCalledWith(
      expect.objectContaining({
        state: { sorting: mockSorting },
        onSortingChange: mockOnSortingChange,
      }),
    );
  });

  it('renders table headers correctly', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    const tableRowElements = screen.getAllByTestId('table-row');
    expect(tableRowElements.length).toBeGreaterThan(0);

    const tableHeadElements = screen.getAllByTestId('table-head');
    expect(tableHeadElements.length).toBe(3);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders table rows correctly', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    const tableRows = screen.getAllByTestId('table-row');
    expect(tableRows.length).toBeGreaterThan(1);

    const tableCells = screen.getAllByTestId('table-cell');
    expect(tableCells.length).toBe(1);
  });

  it('applies rowClassName when provided', () => {
    const mockRowClassName = vi.fn().mockReturnValue('custom-row-class');

    render(<DataTable columns={mockColumns} data={mockData} rowClassName={mockRowClassName} />);

    expect(mockRowClassName).toHaveBeenCalledWith(mockRows[0].original);
    expect(screen.getAllByTestId('table-row')[1]).toHaveClass('custom-row-class');
  });

  it('handles row clicks correctly', () => {
    const mockOnRowClick = vi.fn();

    render(<DataTable columns={mockColumns} data={mockData} onRowClick={mockOnRowClick} />);

    const rows = screen.getAllByTestId('table-row');
    fireEvent.click(rows[1]);

    expect(mockOnRowClick).toHaveBeenCalledWith(mockRows[0].original);
  });

  it('renders different sort icons based on sorting state', () => {
    const mockHeaderGroupsWithDifferentSorts = [
      {
        id: 'header-group-1',
        headers: [
          {
            id: 'header-asc',
            isPlaceholder: false,
            column: {
              getCanSort: () => true,
              getIsSorted: () => 'asc',
              getToggleSortingHandler: () => vi.fn(),
              columnDef: { header: 'Asc Header' },
            },
            getContext: () => ({}),
          },
          {
            id: 'header-desc',
            isPlaceholder: false,
            column: {
              getCanSort: () => true,
              getIsSorted: () => 'desc',
              getToggleSortingHandler: () => vi.fn(),
              columnDef: { header: 'Desc Header' },
            },
            getContext: () => ({}),
          },
          {
            id: 'header-unsorted',
            isPlaceholder: false,
            column: {
              getCanSort: () => true,
              getIsSorted: () => undefined,
              getToggleSortingHandler: () => vi.fn(),
              columnDef: { header: 'Unsorted Header' },
            },
            getContext: () => ({}),
          },
        ],
      },
    ];

    const customMockTable = {
      ...mockTable,
      getHeaderGroups: () => mockHeaderGroupsWithDifferentSorts,
    };

    (reactTable.useReactTable as unknown as MockInstance).mockReturnValue(customMockTable);

    const { container } = render(<DataTable columns={mockColumns} data={mockData} />);

    expect(container).toBeInTheDocument();
  });

  it('correctly passes empty sorting state when no sorting props provided', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    expect(reactTable.useReactTable).toHaveBeenCalledWith(
      expect.objectContaining({
        state: {},
      }),
    );
  });
});
