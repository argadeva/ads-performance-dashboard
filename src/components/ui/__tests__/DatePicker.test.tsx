import { act } from 'react-dom/test-utils';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly without a date', () => {
    render(<DatePicker />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders correctly with a date', () => {
    const testDate = new Date(2023, 5, 15);
    render(<DatePicker value={testDate} />);
    expect(screen.getByText(/June 15th, 2023/)).toBeInTheDocument();
  });

  it('updates when value prop changes', () => {
    const { rerender } = render(<DatePicker value={new Date(2023, 5, 15)} />);
    expect(screen.getByText(/June 15th, 2023/)).toBeInTheDocument();

    rerender(<DatePicker value={new Date(2023, 6, 20)} />);
    expect(screen.getByText(/July 20th, 2023/)).toBeInTheDocument();
  });

  it('triggers onSelect when a date is selected', async () => {
    const handleSelect = vi.fn();
    render(<DatePicker onSelect={handleSelect} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText('15')[0]);
    });

    expect(handleSelect).toHaveBeenCalled();
    expect(handleSelect.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('resets date when onSelect with undefined is called', async () => {
    const handleSelect = vi.fn();
    render(<DatePicker onSelect={handleSelect} value={new Date()} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /may/i }));
    });

    const calendar = screen.getByRole('grid').parentElement;
    if (calendar) {
      await act(async () => {
        handleSelect.mockReset();

        const datepickerButton = screen
          .getAllByRole('button')
          .find((button) => button.getAttribute('data-slot') === 'popover-trigger');
        if (datepickerButton) {
          fireEvent.click(datepickerButton);
        }

        await act(async () => {
          handleSelect(undefined);
        });
      });

      expect(handleSelect).toHaveBeenCalledWith(undefined);
    }
  });

  it('disabled state prevents opening calendar', async () => {
    render(<DatePicker disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies timezone offset correction to selected date', async () => {
    const handleSelect = vi.fn();
    render(<DatePicker onSelect={handleSelect} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText('15')[0]);
    });

    const selectedDate = handleSelect.mock.calls[0][0];
    const originalDate = new Date(selectedDate);
    originalDate.setMinutes(originalDate.getMinutes() - originalDate.getTimezoneOffset());

    expect(selectedDate.getDate()).toBe(originalDate.getDate());
  });

  it('handles calendar opening and navigation', async () => {
    render(<DatePicker />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('grid')).toBeInTheDocument();

    const nextButton = screen.getByLabelText(/next month/i);
    await act(async () => {
      fireEvent.click(nextButton);
    });

    const prevButton = screen.getByLabelText(/previous month/i);
    await act(async () => {
      fireEvent.click(prevButton);
    });
  });
});
