import type { Client } from '@/types';

export interface ApiResponse {
  clients: Client[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ClientFilter {
  date?: string;
  name?: string | string[];
  kpiType?: string;
}

export interface SortParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
