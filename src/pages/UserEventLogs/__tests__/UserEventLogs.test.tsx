import type { SortingState } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserEvent } from '@/context/useUserEvent';

import UserEventLogs from '../UserEventLogs';

vi.mock('@/context/useUserEvent', () => ({
  useUserEvent: vi.fn(),
}));

vi.mock('../fragments/UserEventLogsTable', () => ({
  UserEventLogsTable: ({
    events,
    sorting,
    onSortingChange,
  }: {
    events: unknown[];
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
  }) => {
    return (
      <div data-testid="user-event-logs-table">
        <span data-testid="event-count">{events.length}</span>
        <button
          data-testid="sort-button"
          onClick={() => onSortingChange([{ id: 'timestamp', desc: true }])}
        >
          Sort
        </button>
        <div data-testid="sorting-state">{JSON.stringify(sorting)}</div>
      </div>
    );
  },
}));

describe('UserEventLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and description', () => {
    (useUserEvent as ReturnType<typeof vi.fn>).mockReturnValue({ events: [] });

    render(<UserEventLogs />);

    expect(screen.getByText('User Event Logs')).toBeInTheDocument();
    expect(
      screen.getByText(/This application stores the latest 100 event logs/),
    ).toBeInTheDocument();
  });

  it('shows "No events tracked" when there are no events', () => {
    (useUserEvent as ReturnType<typeof vi.fn>).mockReturnValue({ events: [] });

    render(<UserEventLogs />);

    expect(screen.getByText('No events tracked.')).toBeInTheDocument();
    expect(screen.queryByTestId('user-event-logs-table')).not.toBeInTheDocument();
  });

  it('renders table when events are available', () => {
    const mockEvents = [
      {
        type: 'page_view',
        timestamp: 1620000000000,
        details: { page: 'home' },
      },
      {
        type: 'button_click',
        timestamp: 1620000060000,
        details: { buttonId: 'submit' },
      },
    ];
    (useUserEvent as ReturnType<typeof vi.fn>).mockReturnValue({
      events: mockEvents,
    });

    render(<UserEventLogs />);

    expect(screen.queryByText('No events tracked.')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-event-logs-table')).toBeInTheDocument();
    expect(screen.getByTestId('event-count').textContent).toBe('2');
  });

  it('passes sorting state and handler to table component', () => {
    const mockEvents = [{ type: 'test', timestamp: 1620000000000 }];
    (useUserEvent as ReturnType<typeof vi.fn>).mockReturnValue({
      events: mockEvents,
    });

    render(<UserEventLogs />);

    expect(screen.getByTestId('sorting-state').textContent).toBe('[]');

    act(() => {
      screen.getByTestId('sort-button').click();
    });

    expect(screen.getByTestId('sorting-state').textContent).toBe(
      '[{"id":"timestamp","desc":true}]',
    );
  });
});
