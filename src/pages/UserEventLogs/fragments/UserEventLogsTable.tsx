import { useMemo } from 'react';

import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import type { UserEventLog } from '@/types';

interface UserEventLogsTableProps {
  events: UserEventLog[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function UserEventLogsTable({ events, sorting, onSortingChange }: UserEventLogsTableProps) {
  const columns = useMemo<ColumnDef<UserEventLog, unknown>[]>(
    () => [
      {
        header: 'No',
        cell: ({ row }) => row.index + 1,
        id: 'no',
      },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ getValue }) => new Date(getValue() as number).toLocaleString(),
        enableSorting: true,
      },
      {
        accessorKey: 'type',
        header: 'Event Type',
        enableSorting: false,
      },
      {
        accessorKey: 'details',
        header: 'Details',
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? (
            <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(value, null, 2)}</pre>
          ) : (
            '-'
          );
        },
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={events}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
