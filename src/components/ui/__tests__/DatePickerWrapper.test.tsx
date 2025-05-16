import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DatePickerWrapper } from '../DatePickerWrapper';

vi.mock('../DatePicker', () => ({
  DatePicker: ({
    value,
    onSelect,
    disabled,
  }: {
    value?: Date;
    onSelect: (date?: Date) => void;
    disabled?: boolean;
  }) => (
    <div data-testid="date-picker" data-value={value} data-disabled={disabled}>
      <button
        data-testid="select-date-button"
        onClick={() => onSelect(new Date('2023-01-15'))}
        disabled={disabled}
      >
        Select date
      </button>
      <button
        data-testid="clear-date-button"
        onClick={() => onSelect(undefined)}
        disabled={disabled}
      >
        Clear date
      </button>
    </div>
  ),
}));

describe('DatePickerWrapper', () => {
  it('renders with default props', () => {
    const handleChange = vi.fn();
    render(<DatePickerWrapper onChange={handleChange} />);

    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('passes value prop to DatePicker', () => {
    const handleChange = vi.fn();
    const testDate = new Date('2023-01-01');
    render(<DatePickerWrapper value={testDate} onChange={handleChange} />);

    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-value', testDate.toString());
  });

  it('passes disabled prop to DatePicker', () => {
    const handleChange = vi.fn();
    render(<DatePickerWrapper disabled={true} onChange={handleChange} />);

    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-disabled', 'true');
  });

  it('calls onChange with formatted date string when a date is selected', () => {
    const handleChange = vi.fn();
    render(<DatePickerWrapper onChange={handleChange} />);

    fireEvent.click(screen.getByTestId('select-date-button'));

    expect(handleChange).toHaveBeenCalledWith('2023-01-15');
  });

  it('calls onChange with empty string when date is cleared', () => {
    const handleChange = vi.fn();
    render(<DatePickerWrapper onChange={handleChange} />);

    fireEvent.click(screen.getByTestId('clear-date-button'));

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
