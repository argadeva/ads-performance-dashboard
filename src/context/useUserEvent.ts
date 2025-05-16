import { useContext } from 'react';

import { UserEventContext } from './UserEventContextValue';

export function useUserEvent() {
  const ctx = useContext(UserEventContext);
  if (!ctx) throw new Error('useUserEvent must be used within UserEventProvider');
  return ctx;
}
