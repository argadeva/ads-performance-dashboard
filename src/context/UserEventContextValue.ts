import { createContext } from 'react';

import type { UserEventContextProps } from './UserEventContext';

export const UserEventContext = createContext<UserEventContextProps | undefined>(undefined);
