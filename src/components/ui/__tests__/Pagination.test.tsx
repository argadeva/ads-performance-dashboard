import { render, screen } from '@testing-library/react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination';

describe('Pagination', () => {
  it('renders nav element', () => {
    render(<Pagination />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('PaginationContent', () => {
  it('renders ul element', () => {
    render(<PaginationContent />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});

describe('PaginationItem', () => {
  it('renders li element', () => {
    render(
      <PaginationContent>
        <PaginationItem />
      </PaginationContent>,
    );
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});

describe('PaginationLink', () => {
  it('renders button element', () => {
    render(<PaginationLink />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('sets aria-current when active', () => {
    render(<PaginationLink isActive />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });
});

describe('PaginationPrevious', () => {
  it('renders previous button', () => {
    render(<PaginationPrevious />);
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
  });
});

describe('PaginationNext', () => {
  it('renders next button', () => {
    render(<PaginationNext />);
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });
});

describe('PaginationEllipsis', () => {
  it('renders ellipsis span', () => {
    render(<PaginationEllipsis aria-label="ellipsis" />);
    expect(screen.getByLabelText('ellipsis')).toBeInTheDocument();
  });
});
