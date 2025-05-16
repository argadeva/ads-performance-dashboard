import type { OnChangeFn, SortingState } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';
import type { Client } from '@/types';

import { columns } from './TableColumns';

interface ClientsTableProps {
  clients: Client[];
  page: number;
  totalPages: number;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onPageChange: (page: number) => void;
  onClientClick: (client: Client) => void;
}

export function ClientsTable({
  clients,
  page,
  totalPages,
  sorting,
  onSortingChange,
  onPageChange,
  onClientClick,
}: ClientsTableProps) {
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return (
    <>
      <div className="overflow-x-auto" data-testid="clients-table-container">
        <DataTable
          columns={columns}
          data={clients}
          rowClassName={(row) => (row.actual < row.targetKpi ? 'bg-red-600/70' : '')}
          onRowClick={onClientClick}
          onSortingChange={onSortingChange}
          sorting={sorting}
        />
      </div>
      <Pagination className="mt-4" data-testid="clients-pagination">
        <PaginationContent>
          {hasPreviousPage && (
            <PaginationItem>
              <PaginationPrevious
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                data-testid="pagination-previous"
              />
            </PaginationItem>
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                className={`px-3 py-1 border rounded cursor-pointer ${page === i + 1 ? 'bg-gray-200 font-bold' : ''}`}
                isActive={page === i + 1}
                onClick={() => onPageChange(i + 1)}
                data-testid={`pagination-link-${i + 1}`}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {hasNextPage && (
            <PaginationItem>
              <PaginationNext
                className={`px-3 py-1 border rounded cursor-pointer`}
                onClick={() => onPageChange(page + 1)}
                data-testid="pagination-next"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
