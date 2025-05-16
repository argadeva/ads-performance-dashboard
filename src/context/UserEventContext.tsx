import React, { useCallback, useEffect, useState } from 'react';

import type { UserEventLog } from '@/types';

import { UserEventContext } from './UserEventContextValue';

export interface UserEventContextProps {
  events: UserEventLog[];
  trackEvent: (eventName: string, data: unknown) => void;
}

const LOCAL_STORAGE_KEY = 'user_events';
const MAX_EVENTS = 100;

export const UserEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<UserEventLog[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const trackEvent = useCallback((eventName: string, data?: unknown) => {
    setEvents((prev) => {
      const now = Date.now();
      if (prev.length > 0 && Math.abs(prev[0].timestamp - now) < 1000) {
        return prev;
      }
      const next = [{ type: eventName, timestamp: now, details: data }, ...prev];
      return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
    });
  }, []);

  return (
    <UserEventContext.Provider value={{ events, trackEvent }}>{children}</UserEventContext.Provider>
  );
};
