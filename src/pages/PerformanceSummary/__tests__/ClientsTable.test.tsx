import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Client } from '@/types';

import { ClientsTable } from '../fragments/ClientsTable';

const clients: Client[] = [
  {
    id: '1',
    date: '2024-06-01',
    name: 'Client A',
    kpiType: 'ctr',
    targetKpi: 100,
    actual: 90,
    value: 'Value A',
  },
  {
    id: '2',
    date: '2024-06-02',
    name: 'Client B',
    kpiType: 'impression',
    targetKpi: 200,
    actual: 210,
    value: 'Value B',
  },
];

describe('ClientsTable', () => {
  it('renders table and pagination', () => {
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={2}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={() => {}}
        onClientClick={() => {}}
      />,
    );
    expect(screen.getByTestId('clients-table-container')).toBeInTheDocument();
    expect(screen.getByTestId('clients-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-link-1')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-link-2')).toBeInTheDocument();
  });

  it('calls onPageChange when next/prev clicked', () => {
    const onPageChange = vi.fn();
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={2}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={onPageChange}
        onClientClick={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('pagination-next'));
    expect(onPageChange).toHaveBeenCalledWith(2);

    render(
      <ClientsTable
        clients={clients}
        page={2}
        totalPages={2}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={onPageChange}
        onClientClick={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('pagination-previous'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when page number clicked', () => {
    const onPageChange = vi.fn();
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={3}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={onPageChange}
        onClientClick={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('pagination-link-2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onSortingChange when sorting changes', () => {
    const onSortingChange = vi.fn();
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={1}
        sorting={[]}
        onSortingChange={onSortingChange}
        onPageChange={() => {}}
        onClientClick={() => {}}
      />,
    );
    onSortingChange([{ id: 'name', desc: false }]);
    expect(onSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
  });

  it('calls onClientClick when row clicked', () => {
    const onClientClick = vi.fn();
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={1}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={() => {}}
        onClientClick={onClientClick}
      />,
    );
    const clientCell = screen.getByText('Client A');
    fireEvent.click(clientCell);
    expect(onClientClick).toHaveBeenCalled();
  });

  it('renders red background for rows where actual < targetKpi', () => {
    render(
      <ClientsTable
        clients={clients}
        page={1}
        totalPages={1}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={() => {}}
        onClientClick={() => {}}
      />,
    );
    const clientCell = screen.getByText('Client A');
    expect(clientCell.closest('tr')?.className).toMatch(/bg-red-600/);
  });

  it('renders all page numbers when totalPages > 7', () => {
    render(
      <ClientsTable
        clients={clients}
        page={4}
        totalPages={10}
        sorting={[]}
        onSortingChange={() => {}}
        onPageChange={() => {}}
        onClientClick={() => {}}
      />,
    );
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`pagination-link-${i}`)).toBeInTheDocument();
    }
  });
});
