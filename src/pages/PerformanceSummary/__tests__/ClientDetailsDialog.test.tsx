import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Client } from '@/types';

import { ClientDetailsDialog } from '../fragments/ClientDetailsDialog';

vi.mock('../fragments/ClientsDetailsTable', () => ({
  ClientsDetailsTable: ({ performance }: { performance: unknown[] }) => (
    <div data-testid="clients-details-table">
      {performance && `${performance.length} performance records`}
    </div>
  ),
}));

vi.mock('@/lib/utils', () => ({
  formatDate: (date: string) => `formatted-${date}`,
}));

vi.mock('@/components/ui/Dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    return open ? <div data-testid="dialog-component">{children}</div> : null;
  },
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" className={className || ''}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/Separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock('@radix-ui/react-dialog', () => ({
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-description">{children}</div>
  ),
}));

vi.mock('lucide-react', () => ({
  UserIcon: () => <span data-testid="user-icon">UserIcon</span>,
  BadgeDollarSign: () => <span data-testid="badge-dollar-sign">BadgeDollarSign</span>,
  TrendingUp: () => <span data-testid="trending-up">TrendingUp</span>,
}));

describe('ClientDetailsDialog Component', () => {
  const mockOnOpenChange = vi.fn();

  const mockClient: Client = {
    id: 'client-123',
    name: 'Test Client',
    kpiType: 'ctr',
    targetKpi: 3.5,
    actual: 4.2,
    value: '$10,000',
    date: '2023-01-01',
    details: {
      performance: [{ date: '2023-01-01', ctr: 4.2, impression: 1000, click: 42 }],
      contract: {
        contractId: 'contract-abc',
        start: '2023-01-01',
        end: '2023-12-31',
        value: '$120,000',
        description: 'Annual marketing contract',
      },
    },
  };

  const mockImpressionClient: Client = {
    ...mockClient,
    kpiType: 'impression',
    targetKpi: 10000,
    actual: 12000,
  };

  const mockClientNoDetails: Client = {
    id: 'client-456',
    name: 'Client Without Details',
    kpiType: 'ctr',
    targetKpi: 2.5,
    actual: 2.0,
    value: '$5,000',
    date: '2023-02-01',
  };

  const mockClientPartialContract: Client = {
    ...mockClient,
    details: {
      performance: [],
      contract: {
        contractId: 'contract-xyz',
        start: '',
        end: '',
        value: '$50,000',
        description: 'Partial contract',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if client is null', () => {
    const { container } = render(
      <ClientDetailsDialog open={true} onOpenChange={mockOnOpenChange} client={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render correctly with complete client data', () => {
    render(<ClientDetailsDialog open={true} onOpenChange={mockOnOpenChange} client={mockClient} />);

    expect(screen.getByTestId('dialog-component')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Client');
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Annual marketing contract');

    expect(screen.getByText('Client Performance & Contract Details')).toBeInTheDocument();
    expect(screen.getByText('Company Name :')).toBeInTheDocument();
    expect(screen.getAllByText('Test Client')).toHaveLength(2);

    expect(screen.getByText('KPI Type :')).toBeInTheDocument();
    expect(screen.getByText('CTR')).toBeInTheDocument();

    expect(screen.getByText('Target KPI :')).toBeInTheDocument();
    expect(screen.getByText('3.5')).toBeInTheDocument();
    expect(screen.getByText('Actual KPI :')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('Value :')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();

    expect(screen.getByText('Contract ID :')).toBeInTheDocument();
    expect(screen.getByText('contract-abc')).toBeInTheDocument();
    expect(screen.getByText('Period :')).toBeInTheDocument();
    expect(screen.getByText(/formatted-2023-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/formatted-2023-12-31/)).toBeInTheDocument();
    expect(screen.getByText('Contract Value :')).toBeInTheDocument();
    expect(screen.getByText('$120,000')).toBeInTheDocument();

    expect(screen.getByTestId('clients-details-table')).toBeInTheDocument();
    expect(screen.getByTestId('clients-details-table')).toHaveTextContent('1 performance records');

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('badge-dollar-sign')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up')).toBeInTheDocument();
  });

  it('should render correctly with impression KPI type', () => {
    render(
      <ClientDetailsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        client={mockImpressionClient}
      />,
    );

    expect(screen.getByText('KPI Type :')).toBeInTheDocument();
    expect(screen.getByText('Impression')).toBeInTheDocument();
  });

  it('should render correctly without client details', () => {
    render(
      <ClientDetailsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        client={mockClientNoDetails}
      />,
    );

    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Client Without Details');
    expect(screen.getByText('Client Performance & Contract Details')).toBeInTheDocument();

    expect(screen.queryByTestId('clients-details-table')).not.toBeInTheDocument();
  });

  it('should render placeholder for missing contract dates', () => {
    render(
      <ClientDetailsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        client={mockClientPartialContract}
      />,
    );

    expect(screen.getByText('Period :')).toBeInTheDocument();
    const periodElement = screen.getByText(/Period :/).parentElement;
    expect(periodElement).toHaveTextContent('-');
    expect(periodElement).toHaveTextContent('~');
  });

  it('should not render if dialog is closed', () => {
    render(
      <ClientDetailsDialog open={false} onOpenChange={mockOnOpenChange} client={mockClient} />,
    );

    expect(screen.queryByTestId('dialog-component')).not.toBeInTheDocument();
  });

  it('should render empty performance section when performance array is empty', () => {
    render(
      <ClientDetailsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        client={mockClientPartialContract}
      />,
    );

    expect(screen.getByTestId('clients-details-table')).toBeInTheDocument();
    expect(screen.getByTestId('clients-details-table')).toHaveTextContent('0 performance records');
  });
});
