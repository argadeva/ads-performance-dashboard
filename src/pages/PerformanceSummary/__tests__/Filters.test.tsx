import '@testing-library/jest-dom';

import { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Filters } from '../fragments/Filters';

describe('Filters', () => {
  const defaultProps = {
    filterDate: '',
    filterName: '',
    filterKpiType: '',
    onDateChange: vi.fn(),
    onNameChange: vi.fn(),
    onKpiTypeChange: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders all filter components', () => {
    render(<Filters {...defaultProps} />);

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pick a date/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Client Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
  });

  it('should not show reset button when no filters are applied', () => {
    render(<Filters {...defaultProps} />);

    expect(screen.queryByText('Reset Filter')).not.toBeInTheDocument();
  });

  it('should show reset button when filters are applied', () => {
    render(<Filters {...defaultProps} filterName="Test Client" />);

    expect(screen.getByText('Reset Filter')).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', () => {
    render(<Filters {...defaultProps} filterDate="2023-01-01" />);

    const resetButton = screen.getByText('Reset Filter');
    fireEvent.click(resetButton);

    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('should disable reset button when loading', () => {
    render(<Filters {...defaultProps} filterName="Test" loading={true} />);

    const resetButton = screen.getByText('Reset Filter');
    expect(resetButton).toBeDisabled();
  });

  it('should call onNameChange after debounce when typing in name input', () => {
    vi.useFakeTimers();

    render(<Filters {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Client Name');
    fireEvent.change(nameInput, { target: { value: 'New Client' } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(defaultProps.onNameChange).toHaveBeenCalledWith('New Client');
  });

  it('should not call onNameChange if input value is the same as current filter', () => {
    vi.useFakeTimers();

    render(<Filters {...defaultProps} filterName="Test Client" />);

    const nameInput = screen.getByPlaceholderText('Client Name');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(nameInput, { target: { value: 'Test Client' } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(defaultProps.onNameChange).not.toHaveBeenCalled();
  });

  it('should update nameInput state when filterName prop changes', () => {
    const { rerender } = render(<Filters {...defaultProps} filterName="Initial" />);

    const nameInput = screen.getByPlaceholderText('Client Name');
    expect(nameInput).toHaveValue('Initial');

    rerender(<Filters {...defaultProps} filterName="Updated" />);

    expect(nameInput).toHaveValue('Updated');
  });

  it('should call onDateChange when date is selected', () => {
    render(<Filters {...defaultProps} />);

    const mockDate = '2023-01-15';
    defaultProps.onDateChange(mockDate);

    expect(defaultProps.onDateChange).toHaveBeenCalledWith(mockDate);
  });

  it('should disable inputs when loading is true', () => {
    render(<Filters {...defaultProps} loading={true} />);

    const datePicker = screen.getByRole('button', { name: /Pick a date/i });
    expect(datePicker).toHaveClass('disabled:opacity-50');

    const nameInput = screen.getByPlaceholderText('Client Name');
    expect(nameInput).toBeDisabled();

    const kpiButton = screen.getByRole('button', { name: /All/i });
    expect(kpiButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should open dropdown when KPI type button is clicked', async () => {
    render(<Filters {...defaultProps} />);

    const kpiButton = screen.getByRole('button', { name: /All/i });
    fireEvent.click(kpiButton);

    expect(kpiButton).toBeInTheDocument();
  });

  it('should call onKpiTypeChange when a KPI type is selected', () => {
    render(<Filters {...defaultProps} />);

    expect(defaultProps.onKpiTypeChange).not.toHaveBeenCalled();

    const { onKpiTypeChange } = defaultProps;
    onKpiTypeChange('ctr');

    expect(defaultProps.onKpiTypeChange).toHaveBeenCalledWith('ctr');
  });

  it('should display the correct KPI type text', () => {
    const { rerender } = render(<Filters {...defaultProps} filterKpiType="" />);
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();

    rerender(<Filters {...defaultProps} filterKpiType="ctr" />);
    expect(screen.getByRole('button', { name: /CTR/i })).toBeInTheDocument();

    rerender(<Filters {...defaultProps} filterKpiType="impression" />);
    expect(screen.getByRole('button', { name: /Impression/i })).toBeInTheDocument();

    rerender(<Filters {...defaultProps} filterKpiType="custom" />);
    expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument();
  });

  it('should show ChevronDown when dropdown is closed and ChevronUp when open', async () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(!open)}>Toggle</button>
          {open ? (
            <ChevronUpIcon data-testid="chevron-up" />
          ) : (
            <ChevronDownIcon data-testid="chevron-down" />
          )}
        </>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-up')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-down')).not.toBeInTheDocument();
  });

  it('should cleanup timeout on unmount', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(<Filters {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Client Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
