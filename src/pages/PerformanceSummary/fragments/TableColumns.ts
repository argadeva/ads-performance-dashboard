import { type ColumnDef } from '@tanstack/react-table';

import { formatDate, formatDigit } from '@/lib/utils';
import { type Client } from '@/types';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return formatDate(value);
    },
  },
  {
    accessorKey: 'name',
    header: 'Nama Klien',
  },
  {
    accessorKey: 'kpiType',
    header: 'KPI Type',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (value === 'ctr') {
        return value.toUpperCase();
      } else {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
  },
  {
    accessorKey: 'targetKpi',
    header: 'Target KPI',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return formatDigit(value);
    },
  },
  {
    accessorKey: 'actual',
    header: 'Actual',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return formatDigit(value);
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
];
