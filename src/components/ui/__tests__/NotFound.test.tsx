import { render, screen } from '@testing-library/react';

import { NotFound } from '../NotFound';

describe('NotFound', () => {
  it('renders with default message and subtitle', () => {
    render(<NotFound />);
    expect(screen.getByText('Data tidak ditemukan')).toBeInTheDocument();
    expect(
      screen.getByText('Coba periksa filter atau kata kunci pencarian Anda.'),
    ).toBeInTheDocument();
  });

  it('renders with custom message and subtitle', () => {
    render(<NotFound message="No data" subtitle="Try again" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
