import type { CellContext } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';

import { formatDate, formatDigit } from '@/lib/utils';
import type { Client } from '@/types';

import { columns } from '../fragments/TableColumns';

vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date: string) => `formatted-date-${date}`),
  formatDigit: vi.fn((value: number) => `formatted-digit-${value}`),
}));

describe('TableColumns', () => {
  describe('date column', () => {
    it('should format date correctly', () => {
      const dateColumn = columns[0];
      expect(dateColumn.header).toBe('Tanggal');

      const cellValue = '2023-05-15';
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Client, unknown>;

      const cellFn = dateColumn.cell as unknown as (props: CellContext<Client, unknown>) => string;
      const result = cellFn(cellContext);

      expect(formatDate).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-date-${cellValue}`);
    });
  });

  describe('name column', () => {
    it('should render name correctly', () => {
      const nameColumn = columns[1];
      expect(nameColumn.header).toBe('Nama Klien');

      const columnWithAccessor = nameColumn as unknown as {
        accessorKey: string;
      };
      expect(columnWithAccessor.accessorKey).toBe('name');
    });
  });

  describe('kpiType column', () => {
    it('should render CTR in uppercase', () => {
      const kpiTypeColumn = columns[2];
      expect(kpiTypeColumn.header).toBe('KPI Type');

      const cellValue = 'ctr';
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Client, unknown>;

      const cellFn = kpiTypeColumn.cell as unknown as (
        props: CellContext<Client, unknown>,
      ) => string;
      const result = cellFn(cellContext);

      expect(result).toBe('CTR');
    });

    it('should capitalize first letter of other KPI types', () => {
      const kpiTypeColumn = columns[2];

      const cellValue = 'impression';
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Client, unknown>;

      const cellFn = kpiTypeColumn.cell as unknown as (
        props: CellContext<Client, unknown>,
      ) => string;
      const result = cellFn(cellContext);

      expect(result).toBe('Impression');
    });
  });

  describe('targetKpi column', () => {
    it('should format target KPI correctly', () => {
      const targetKpiColumn = columns[3];
      expect(targetKpiColumn.header).toBe('Target KPI');

      const cellValue = 3500;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Client, unknown>;

      const cellFn = targetKpiColumn.cell as unknown as (
        props: CellContext<Client, unknown>,
      ) => string;
      const result = cellFn(cellContext);

      expect(formatDigit).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-digit-${cellValue}`);
    });
  });

  describe('actual column', () => {
    it('should format actual value correctly', () => {
      const actualColumn = columns[4];
      expect(actualColumn.header).toBe('Actual');

      const cellValue = 4200;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Client, unknown>;

      const cellFn = actualColumn.cell as unknown as (
        props: CellContext<Client, unknown>,
      ) => string;
      const result = cellFn(cellContext);

      expect(formatDigit).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-digit-${cellValue}`);
    });
  });

  describe('value column', () => {
    it('should have correct header', () => {
      const valueColumn = columns[5];
      expect(valueColumn.header).toBe('Value');

      const columnWithAccessor = valueColumn as unknown as {
        accessorKey: string;
      };
      expect(columnWithAccessor.accessorKey).toBe('value');
    });
  });
});
