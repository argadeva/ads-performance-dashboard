import { useState } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { useUserEvent } from '@/context/useUserEvent';

import { UserEventLogsTable } from './fragments/UserEventLogsTable';

export default function UserEventLogs() {
  const { events } = useUserEvent();
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">User Event Logs</h2>
      <p className="text-xs mb-4 text-pretty">
        This application stores the latest 100 event logs temporarily in your browser using local
        storage. Older logs will be automatically removed once the limit is reached. This data is
        not permanently saved and may be cleared when you clear your browser data.
      </p>
      <div className="overflow-x-auto">
        {events.length === 0 ? (
          <div className="text-center py-4">No events tracked.</div>
        ) : (
          <UserEventLogsTable events={events} sorting={sorting} onSortingChange={setSorting} />
        )}
      </div>
    </div>
  );
}
