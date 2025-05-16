import { Server } from 'miragejs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';

import type { Client } from '@/types';

import clientsData from '../clients.json';
import { makeServer } from '../server';

declare global {
  // eslint-disable-next-line no-var
  var __originalFetch: typeof fetch | undefined;
}

describe('Mirage Server', () => {
  let server: Server;

  beforeAll(() => {
    if (!globalThis.__originalFetch) {
      globalThis.__originalFetch = globalThis.fetch;
    }
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo, init?: RequestInit) => globalThis.__originalFetch!(input, init)),
    );
    vi.spyOn(globalThis.console, 'log').mockImplementation(() => {});
    vi.spyOn(globalThis.console, 'info').mockImplementation(() => {});
    vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
    if (globalThis.__originalFetch) {
      globalThis.fetch = globalThis.__originalFetch;
      globalThis.__originalFetch = undefined;
    }
  });

  beforeEach(() => {
    server = makeServer();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should create a server with the correct namespace', () => {
    expect(server.namespace).toBe('api');
  });

  it('should return clients with default pagination', async () => {
    const response = await fetch('/api/clients');
    const responseBody = await response.json();
    expect(responseBody.clients).toHaveLength(5);
    expect(responseBody.meta.page).toBe(1);
    expect(responseBody.meta.pageSize).toBe(5);
    expect(responseBody.meta.total).toBe(clientsData.length);
  });

  it('should handle pagination correctly', async () => {
    const response = await fetch('/api/clients?page=2&pageSize=3');
    const responseBody = await response.json();
    expect(responseBody.clients).toHaveLength(3);
    expect(responseBody.meta.page).toBe(2);
    expect(responseBody.meta.pageSize).toBe(3);
  });

  it('should filter by client name', async () => {
    const testName = clientsData[0].name.substring(0, 3).toLowerCase();
    const response = await fetch(`/api/clients?name=${testName}`);
    const responseBody = await response.json();
    const filtered = clientsData.filter((client) => client.name.toLowerCase().includes(testName));
    expect(responseBody.meta.total).toBe(filtered.length);
    expect(responseBody.clients.length).toBeGreaterThan(0);
    responseBody.clients.forEach((client: Client) => {
      expect(client.name.toLowerCase()).toContain(testName);
    });
  });

  it('should filter by date', async () => {
    const testDate = clientsData[0].date;
    const response = await fetch(`/api/clients?date=${testDate}`);
    const responseBody = await response.json();
    const filtered = clientsData.filter((client) => client.date === testDate);
    expect(responseBody.meta.total).toBe(filtered.length);
    responseBody.clients.forEach((client: Client) => {
      expect(client.date).toBe(testDate);
    });
  });

  it('should filter by kpiType', async () => {
    const testKpiType = clientsData[0].kpiType;
    const response = await fetch(`/api/clients?kpiType=${testKpiType}`);
    const responseBody = await response.json();
    const filtered = clientsData.filter((client) => client.kpiType === testKpiType);
    expect(responseBody.meta.total).toBe(filtered.length);
    responseBody.clients.forEach((client: Client) => {
      expect(client.kpiType).toBe(testKpiType);
    });
  });

  it('should sort by string field in ascending order', async () => {
    const response = await fetch('/api/clients?sort=name&order=asc');
    const responseBody = await response.json();
    for (let i = 0; i < responseBody.clients.length - 1; i++) {
      expect(responseBody.clients[i].name <= responseBody.clients[i + 1].name).toBeTruthy();
    }
  });

  it('should sort by string field in descending order', async () => {
    const response = await fetch('/api/clients?sort=name&order=desc');
    const responseBody = await response.json();
    for (let i = 0; i < responseBody.clients.length - 1; i++) {
      expect(responseBody.clients[i].name >= responseBody.clients[i + 1].name).toBeTruthy();
    }
  });

  it('should sort by numeric value field correctly', async () => {
    const response = await fetch('/api/clients?sort=value&order=asc');
    const responseBody = await response.json();
    const parseValue = (value: string | number): number => {
      if (typeof value === 'number') return value;
      return parseFloat(value.replace('%', '').replace(',', '.'));
    };
    for (let i = 0; i < responseBody.clients.length - 1; i++) {
      const current = parseValue(responseBody.clients[i].value);
      const next = parseValue(responseBody.clients[i + 1].value);
      expect(current <= next).toBeTruthy();
    }
  });

  it('should combine filtering, sorting, and pagination', async () => {
    const testKpiType = clientsData[0].kpiType;
    const response = await fetch(
      `/api/clients?kpiType=${testKpiType}&sort=name&order=desc&page=1&pageSize=2`,
    );
    const responseBody = await response.json();
    expect(responseBody.meta.pageSize).toBe(2);
    expect(responseBody.clients).toHaveLength(Math.min(2, responseBody.meta.total));
    responseBody.clients.forEach((client: Client) => {
      expect(client.kpiType).toBe(testKpiType);
    });
    for (let i = 0; i < responseBody.clients.length - 1; i++) {
      expect(responseBody.clients[i].name >= responseBody.clients[i + 1].name).toBeTruthy();
    }
  });

  it('should handle pagination edge cases', async () => {
    let response = await fetch('/api/clients?page=0&pageSize=3');
    let responseBody = await response.json();
    expect(responseBody.meta.page).toBe(1);
    response = await fetch('/api/clients?page=1&pageSize=0');
    responseBody = await response.json();
    expect(responseBody.meta.pageSize).toBe(5);
    response = await fetch('/api/clients?page=1&pageSize=9999');
    responseBody = await response.json();
    expect(responseBody.clients.length).toBe(responseBody.meta.total);
  });

  it('should handle missing/invalid sort and order params', async () => {
    let response = await fetch('/api/clients?order=asc');
    let responseBody = await response.json();
    expect(Array.isArray(responseBody.clients)).toBe(true);
    response = await fetch('/api/clients?sort=name&order=invalid');
    responseBody = await response.json();
    expect(Array.isArray(responseBody.clients)).toBe(true);
  });

  it('should handle array query params', async () => {
    const testName = clientsData[0].name.substring(0, 3).toLowerCase();
    const url = new URL('http://localhost/api/clients');
    url.searchParams.append('name', testName);
    url.searchParams.append('name', 'shouldnotmatch');
    const response = await fetch(url.pathname + '?' + url.searchParams.toString());
    const responseBody = await response.json();
    expect(responseBody.clients.length).toBeGreaterThan(0);
    responseBody.clients.forEach((client: Client) => {
      expect(client.name.toLowerCase()).toContain(testName);
    });
  });

  it('should handle empty name filter array', async () => {
    const url = new URL('http://localhost/api/clients');
    url.searchParams.append('name', '');
    const response = await fetch(url.pathname + '?' + url.searchParams.toString());
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.clients)).toBe(true);
    expect(responseBody.meta.total).toBe(clientsData.length);
  });

  it('should handle only "shouldnotmatch" in name filter', async () => {
    const url = new URL('http://localhost/api/clients');
    url.searchParams.append('name', 'shouldnotmatch');
    const response = await fetch(url.pathname + '?' + url.searchParams.toString());
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.clients)).toBe(true);
    expect(responseBody.meta.total).toBe(clientsData.length);
  });

  it('should test equals cases in sorting string and numeric values', async () => {
    const sameNameClients = clientsData.filter((client) => client.name === clientsData[0].name);

    if (sameNameClients.length >= 2) {
      const response = await fetch('/api/clients?sort=name&order=asc');
      const responseBody = await response.json();
      expect(Array.isArray(responseBody.clients)).toBe(true);
    }

    const response = await fetch('/api/clients?sort=value&order=asc');
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.clients)).toBe(true);

    const responseDesc = await fetch('/api/clients?sort=value&order=desc');
    const responseBodyDesc = await responseDesc.json();
    expect(Array.isArray(responseBodyDesc.clients)).toBe(true);
  });
});
