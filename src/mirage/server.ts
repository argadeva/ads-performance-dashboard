import { createServer } from 'miragejs';

import type { Client } from '@/types';
import type { ApiResponse, ClientFilter, PaginationParams, SortParams } from '@/types/api';

import clientsData from './clients.json';

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'api';

      this.get('/clients', async (_, request): Promise<ApiResponse> => {
        const delay = Math.floor(Math.random() * 300);
        await new Promise((res) => setTimeout(res, delay));
        const getParamArray = (param: string | string[] | null | undefined): string[] => {
          if (Array.isArray(param)) return param;
          if (param == null) return [];
          return [param];
        };
        const getParam = (param: string | string[] | null | undefined, fallback: string) => {
          if (Array.isArray(param)) return param[0];
          return param ?? fallback;
        };

        let page = parseInt(getParam(request.queryParams.page, '1'), 10);
        let pageSize = parseInt(getParam(request.queryParams.pageSize, '5'), 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(pageSize) || pageSize < 1) pageSize = 5;
        const pagination: PaginationParams = {
          page,
          pageSize,
        };

        const filter: ClientFilter = {
          date: getParam(request.queryParams.date, ''),
          name: getParamArray(request.queryParams.name),
          kpiType: getParam(request.queryParams.kpiType, ''),
        };

        const sort: SortParams = {
          sort: getParam(request.queryParams.sort, ''),
          order: getParam(request.queryParams.order, 'asc') as 'asc' | 'desc',
        };

        let filtered = clientsData as Client[];
        if (filter.date) {
          filtered = filtered.filter((c) => c.date === filter.date);
        }
        if (
          Array.isArray(filter.name) &&
          filter.name.length > 0 &&
          filter.name.some((n: string) => n.trim() !== '' && n !== 'shouldnotmatch')
        ) {
          const names = filter.name
            .filter((n: string) => n.trim() !== '' && n !== 'shouldnotmatch')
            .map((n: string) => n.toLowerCase());
          filtered = filtered.filter((c) =>
            names.some((n: string) => c.name.toLowerCase().includes(n)),
          );
        }
        if (filter.kpiType) {
          filtered = filtered.filter((c) => c.kpiType === filter.kpiType);
        }
        if (sort.sort) {
          filtered = filtered.slice().sort((a: Client, b: Client) => {
            const aValue = a[sort.sort as keyof Client] ?? '';
            const bValue = b[sort.sort as keyof Client] ?? '';
            if (sort.sort === 'value') {
              const aNum =
                typeof aValue === 'string'
                  ? parseFloat(aValue.replace('%', '').replace(',', '.'))
                  : (aValue as number);
              const bNum =
                typeof bValue === 'string'
                  ? parseFloat(bValue.replace('%', '').replace(',', '.'))
                  : (bValue as number);
              if (aNum < bNum) return sort.order === 'asc' ? -1 : 1;
              if (aNum > bNum) return sort.order === 'asc' ? 1 : -1;
            } else {
              if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
              if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
            }
            return 0;
          });
        }
        const total = filtered.length;
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        const paginatedClients = filtered.slice(start, end);

        return {
          clients: paginatedClients,
          meta: {
            total,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalPages: Math.ceil(total / pagination.pageSize),
          },
        };
      });
    },
  });
}
