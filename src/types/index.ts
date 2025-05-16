export type Performance = {
  date: string;
  impression?: number;
  ctr?: number;
  click?: number;
};

export type Contract = {
  contractId: string;
  start: string;
  end: string;
  value: string;
  description: string;
};

export type ClientDetails = {
  performance: Performance[];
  contract: Contract;
};

export type Client = {
  id: string;
  name: string;
  kpiType: string;
  targetKpi: number;
  actual: number;
  value: string | number;
  date: string;
  details?: ClientDetails;
};

export interface UserEventLog {
  type: string;
  timestamp: number;
  details?: unknown;
}
