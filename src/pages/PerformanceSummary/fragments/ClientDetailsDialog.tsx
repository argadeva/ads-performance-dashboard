import { DialogDescription } from '@radix-ui/react-dialog';
import { BadgeDollarSign, TrendingUp, UserIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Separator } from '@/components/ui/Separator';
import { formatDate } from '@/lib/utils';
import type { Client } from '@/types';

import { ClientsDetailsTable } from './ClientsDetailsTable';

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientDetailsDialog({ open, onOpenChange, client }: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="hidden">
        <DialogTitle>{client.name}</DialogTitle>
        <DialogDescription>{client.details?.contract?.description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="h-full md:h-auto p-4 sm:p-6 md:p-8 content-start">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          <h1 className="flex-1 font-bold">Client Performance & Contract Details</h1>
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <p>
            <span className="font-semibold">Company Name :</span> {client.name}
          </p>
          <p>
            <span className="font-semibold">KPI Type :</span>{' '}
            {client.kpiType === 'ctr' ? 'CTR' : 'Impression'}{' '}
          </p>
          <p>
            <span className="font-semibold">Target KPI :</span> {client.targetKpi}
          </p>
          <p>
            <span className="font-semibold">Actual KPI :</span> {client.actual}
          </p>
          <p>
            <span className="font-semibold">Value :</span> {client.value}
          </p>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold">Daily Performance :</span>
        </div>
        {client?.details && <ClientsDetailsTable performance={client.details.performance} />}
        <div className="flex items-center gap-2 mb-1">
          <BadgeDollarSign className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Contract Details :</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg p-3 border">
          <p>
            <span className="font-semibold">Contract ID :</span>{' '}
            {client.details?.contract?.contractId}
          </p>
          <p>
            <span className="font-semibold">Period :</span>{' '}
            {client.details?.contract?.start ? formatDate(client.details.contract.start) : '-'} ~{' '}
            {client.details?.contract?.end ? formatDate(client.details.contract.end) : '-'}
          </p>
          <p>
            <span className="font-semibold">Contract Value :</span>{' '}
            {client.details?.contract?.value}
          </p>
          <p>
            <span className="font-semibold">Description :</span>{' '}
            {client.details?.contract?.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
