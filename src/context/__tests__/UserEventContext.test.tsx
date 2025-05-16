import { act, render } from '@testing-library/react';

import { UserEventProvider } from '../UserEventContext';
import { useUserEvent } from '../useUserEvent';

describe('UserEventContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function TestComponent() {
    const { trackEvent } = useUserEvent();
    return (
      <button onClick={() => trackEvent('test', { foo: 'bar' })} data-testid="btn">
        Trigger
      </button>
    );
  }

  it('provides default events and trackEvent', () => {
    let contextValue: {
      events: unknown[];
      trackEvent: (type: string, details: Record<string, unknown>) => void;
    } = { events: [], trackEvent: () => {} };
    function Consumer() {
      contextValue = useUserEvent();
      return null;
    }
    render(
      <UserEventProvider>
        <Consumer />
      </UserEventProvider>,
    );
    expect(Array.isArray(contextValue.events)).toBe(true);
    expect(typeof contextValue.trackEvent).toBe('function');
  });

  it('trackEvent menambah event baru', () => {
    const { getByTestId } = render(
      <UserEventProvider>
        <TestComponent />
      </UserEventProvider>,
    );
    act(() => {
      getByTestId('btn').click();
    });
    const stored = JSON.parse(localStorage.getItem('user_events') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].type).toBe('test');
    expect(stored[0].details.foo).toBe('bar');
  });
});
