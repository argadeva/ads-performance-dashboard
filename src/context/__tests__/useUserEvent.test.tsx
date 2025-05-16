import { render } from '@testing-library/react';

import { UserEventProvider } from '../UserEventContext';
import { useUserEvent } from '../useUserEvent';

describe('useUserEvent', () => {
  it('returns context value when inside provider', () => {
    type UserEventContextType = {
      events: unknown[];
      trackEvent: (eventName: string, data: unknown) => void;
    };
    let contextValue: UserEventContextType | undefined;
    function Consumer() {
      contextValue = useUserEvent() as UserEventContextType;
      return null;
    }
    render(
      <UserEventProvider>
        <Consumer />
      </UserEventProvider>,
    );
    expect(Array.isArray(contextValue?.events)).toBe(true);
    expect(typeof contextValue?.trackEvent).toBe('function');
  });

  it('throws error when used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    function Consumer() {
      useUserEvent();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow(
      'useUserEvent must be used within UserEventProvider',
    );
    console.error = originalError;
  });
});
