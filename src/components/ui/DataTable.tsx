import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDownZa, ArrowUpAz, ListFilter } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import type { DataTableProps } from '@/types/data-table';

import { Card, CardContent } from './card';

export function DataTable<TData, TValue>({
  columns,
  data,
  rowClassName,
  onRowClick,
  sorting,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: sorting ? { sorting } : {},
    onSortingChange,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="p-0 overflow-x-auto">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-sidebar-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort?.();
                  const sorted = header.column.getIsSorted?.();
                  return (
                    <TableHead
                      key={header.id}
                      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                      style={isSortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                    >
                      <div className="flex items-center text-white">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          <span className="ml-2">
                            {sorted === 'asc' ? (
                              <ArrowUpAz size={12} />
                            ) : sorted === 'desc' ? (
                              <ArrowDownZa size={12} />
                            ) : (
                              <ListFilter size={12} />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={rowClassName ? rowClassName(row.original) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
