import { type ColumnDef } from '@tanstack/react-table';

import { formatDate, formatDigit } from '@/lib/utils';
import { type Performance } from '@/types';

export const TableDetailColumns: ColumnDef<Performance>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatDate(value);
    },
    enableSorting: false,
  },
  {
    accessorKey: 'impression',
    header: 'Impression',
    cell: ({ getValue }) => {
      const value = getValue() as number | undefined;
      return value !== undefined ? formatDigit(value) : '-';
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ctr',
    header: 'CTR',
    cell: ({ getValue }) => {
      const value = getValue() as number | undefined;
      return value !== undefined ? value : '-';
    },
    enableSorting: false,
  },
  {
    accessorKey: 'click',
    header: 'Click',
    cell: ({ getValue }) => {
      const value = getValue() as number | undefined;
      return value !== undefined ? formatDigit(value) : '-';
    },
    enableSorting: false,
  },
];
