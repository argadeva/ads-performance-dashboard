import { render, screen } from '@testing-library/react';

import { TableSkeleton } from '../TableSkeleton';

describe('TableSkeleton', () => {
  it('renders the correct number of rows and columns', () => {
    render(<TableSkeleton rows={3} columns={4} />);
    expect(screen.getAllByRole('row')).toHaveLength(1 + 3);
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.getAllByRole('cell')).toHaveLength(12);
  });

  it('renders default 5x5 skeleton table if no props given', () => {
    render(<TableSkeleton />);
    expect(screen.getAllByRole('row')).toHaveLength(1 + 5);
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    expect(screen.getAllByRole('cell')).toHaveLength(25);
  });
});
