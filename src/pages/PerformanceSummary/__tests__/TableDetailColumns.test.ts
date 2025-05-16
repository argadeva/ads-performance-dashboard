import type { CellContext } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';

import { formatDate, formatDigit } from '@/lib/utils';
import type { Performance } from '@/types';

import { TableDetailColumns } from '../fragments/TableDetailColumns';

vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date: string) => `formatted-date-${date}`),
  formatDigit: vi.fn((value: number) => `formatted-digit-${value}`),
}));

describe('TableDetailColumns', () => {
  describe('date column', () => {
    it('should format date correctly', () => {
      const dateColumn = TableDetailColumns[0];
      expect(dateColumn.header).toBe('Tanggal');
      expect(dateColumn.enableSorting).toBe(false);

      const cellValue = '2023-05-15';
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = dateColumn.cell as (props: CellContext<Performance, unknown>) => string;
      const result = cellFn(cellContext);

      expect(formatDate).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-date-${cellValue}`);
    });
  });

  describe('impression column', () => {
    it('should format impression correctly when value is defined', () => {
      const impressionColumn = TableDetailColumns[1];
      expect(impressionColumn.header).toBe('Impression');
      expect(impressionColumn.enableSorting).toBe(false);

      const cellValue = 3500;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = impressionColumn.cell as (props: CellContext<Performance, unknown>) => string;
      const result = cellFn(cellContext);

      expect(formatDigit).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-digit-${cellValue}`);
    });

    it('should display dash when impression value is undefined', () => {
      const impressionColumn = TableDetailColumns[1];

      const cellValue = undefined;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = impressionColumn.cell as (props: CellContext<Performance, unknown>) => string;
      const result = cellFn(cellContext);

      expect(result).toBe('-');
    });
  });

  describe('ctr column', () => {
    it('should render CTR value correctly when defined', () => {
      const ctrColumn = TableDetailColumns[2];
      expect(ctrColumn.header).toBe('CTR');
      expect(ctrColumn.enableSorting).toBe(false);

      const cellValue = 12.5;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = ctrColumn.cell as (
        props: CellContext<Performance, unknown>,
      ) => number | string;
      const result = cellFn(cellContext);

      expect(result).toBe(cellValue);
    });

    it('should display dash when CTR value is undefined', () => {
      const ctrColumn = TableDetailColumns[2];

      const cellValue = undefined;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = ctrColumn.cell as (
        props: CellContext<Performance, unknown>,
      ) => number | string;
      const result = cellFn(cellContext);

      expect(result).toBe('-');
    });
  });

  describe('click column', () => {
    it('should format click count correctly when defined', () => {
      const clickColumn = TableDetailColumns[3];
      expect(clickColumn.header).toBe('Click');
      expect(clickColumn.enableSorting).toBe(false);

      const cellValue = 250;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = clickColumn.cell as (props: CellContext<Performance, unknown>) => string;
      const result = cellFn(cellContext);

      expect(formatDigit).toHaveBeenCalledWith(cellValue);
      expect(result).toBe(`formatted-digit-${cellValue}`);
    });

    it('should display dash when click value is undefined', () => {
      const clickColumn = TableDetailColumns[3];

      const cellValue = undefined;
      const cellContext = {
        getValue: () => cellValue,
      } as unknown as CellContext<Performance, unknown>;

      const cellFn = clickColumn.cell as (props: CellContext<Performance, unknown>) => string;
      const result = cellFn(cellContext);

      expect(result).toBe('-');
    });
  });
});
