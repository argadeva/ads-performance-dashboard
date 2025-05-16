import { useCallback, useEffect, useState } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { NotFound } from '@/components/ui/NotFound';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { useUserEvent } from '@/context/useUserEvent';
import type { Client } from '@/types';
import type { ApiResponse } from '@/types/api';

import { ClientDetailsDialog } from './fragments/ClientDetailsDialog';
import { ClientsTable } from './fragments/ClientsTable';
import { Filters } from './fragments/Filters';

const PAGE_SIZE = 10;

export default function PerformanceSummary() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterKpiType, setFilterKpiType] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { trackEvent } = useUserEvent();

  const getSortParams = useCallback(() => {
    if (sorting.length > 0) {
      return {
        sort: sorting[0].id,
        order: sorting[0].desc ? 'desc' : 'asc',
      };
    }
    return {};
  }, [sorting]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (filterDate) params.append('date', filterDate);
    if (filterName) params.append('name', filterName);
    if (filterKpiType) params.append('kpiType', filterKpiType);
    const sortParams = getSortParams();
    if (sortParams.sort) params.append('sort', sortParams.sort);
    if (sortParams.order) params.append('order', sortParams.order);

    fetch(`/api/clients?${params.toString()}`)
      .then((res) => res.json() as Promise<ApiResponse>)
      .then((data) => {
        setClients(data.clients);
        setTotalPages(data.meta.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data');
        setLoading(false);
      });

    trackEvent('get_data', {
      route: window.location.pathname,
      params: params.toString(),
      sort: JSON.stringify(sorting),
      page,
    });
  }, [page, filterDate, filterName, filterKpiType, sorting, getSortParams, trackEvent]);

  const handleFilterChange = {
    date: (date: string) => {
      setPage(1);
      setFilterDate(date);
      trackEvent('user_interact', {
        route: window.location.pathname,
        type: 'filter_date',
        value: date,
      });
    },
    name: (name: string) => {
      setPage(1);
      setFilterName(name);
      trackEvent('user_interact', {
        route: window.location.pathname,
        type: 'filter_name',
        value: name,
      });
    },
    kpiType: (type: string) => {
      setPage(1);
      setFilterKpiType(type);
      trackEvent('user_interact', {
        route: window.location.pathname,
        type: 'filter_kpiType',
        value: type,
      });
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ad Performance Summary</h2>
      <Filters
        filterDate={filterDate}
        filterName={filterName}
        filterKpiType={filterKpiType}
        onDateChange={handleFilterChange.date}
        onNameChange={handleFilterChange.name}
        onKpiTypeChange={handleFilterChange.kpiType}
        loading={loading}
        onReset={() => {
          setPage(1);
          setFilterDate('');
          setFilterName('');
          setFilterKpiType('');
          trackEvent('user_interact', {
            route: window.location.pathname,
            type: 'reset_filter',
            value: '',
          });
        }}
      />
      {loading && <TableSkeleton rows={5} columns={5} />}
      {error && <NotFound message="Tidak ada data yang ditemukan" />}
      {clients.length === 0 && !loading && !error && (
        <NotFound message="Tidak ada data yang ditemukan" />
      )}
      {!loading && !error && clients.length > 0 && (
        <ClientsTable
          clients={clients}
          page={page}
          totalPages={totalPages}
          sorting={sorting}
          onSortingChange={setSorting}
          onPageChange={setPage}
          onClientClick={(client) => {
            setSelectedClient(client);
            setDialogOpen(true);
            trackEvent('user_interact', {
              route: window.location.pathname,
              type: 'on_click_detail',
              value: client.name,
            });
          }}
        />
      )}
      <ClientDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} client={selectedClient} />
    </div>
  );
}
