import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../Breadcrumb';

describe('Breadcrumb', () => {
  it('renders nav with aria-label', () => {
    render(<Breadcrumb />);
    expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
  });

  it('renders list and items', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Item 1</BreadcrumbItem>
          <BreadcrumbItem>Item 2</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders link and page', () => {
    render(
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    );
    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
    expect(screen.getByText('Page')).toHaveAttribute('aria-current', 'page');
  });

  it('renders separator and ellipsis', () => {
    render(
      <BreadcrumbList>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
      </BreadcrumbList>,
    );
    expect(document.querySelector('li[role="presentation"]')).toBeInTheDocument();
    expect(document.querySelector('span[role="presentation"]')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });
});
