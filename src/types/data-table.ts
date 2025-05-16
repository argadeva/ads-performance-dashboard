import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClassName?: (_row: TData) => string;
  onRowClick?: (_row: TData) => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}
