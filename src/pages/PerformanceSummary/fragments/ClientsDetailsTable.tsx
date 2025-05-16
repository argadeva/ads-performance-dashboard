import { DataTable } from '@/components/ui/DataTable';
import { NotFound } from '@/components/ui/NotFound';
import type { Performance } from '@/types';

import { TableDetailColumns } from './TableDetailColumns';

interface ClientsDetailsTableProps {
  performance?: Performance[] | null;
}

export function ClientsDetailsTable({ performance }: ClientsDetailsTableProps) {
  if (!performance || performance.length === 0) {
    return (
      <div className="text-muted-foreground">
        <NotFound />
      </div>
    );
  }

  return <DataTable columns={TableDetailColumns} data={performance} />;
}
