import { cn, formatDate, formatDigit } from '@/lib/utils';

describe('utils', () => {
  it('cn returns joined class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('cn skips falsy values', () => {
    expect(cn('a', '', undefined, 'c')).toBe('a c');
  });

  describe('formatDigit', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatDigit(1000)).toBe('1.000');
      expect(formatDigit(1000000)).toBe('1.000.000');
      expect(formatDigit(1234567)).toBe('1.234.567');
    });

    it('handles single digit numbers', () => {
      expect(formatDigit(9)).toBe('9');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly in Indonesian format', () => {
      const mockDate = new Date('2023-05-15');
      const formattedDate = formatDate(mockDate.toISOString());
      expect(formattedDate).toBe('15 Mei 2023');
    });

    it('handles different date formats', () => {
      expect(formatDate('2024-01-01')).toBe('01 Januari 2024');
      expect(formatDate('2022-12-31')).toBe('31 Desember 2022');
    });
  });
});
