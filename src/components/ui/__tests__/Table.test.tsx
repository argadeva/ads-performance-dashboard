import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table';

describe('Table component', () => {
  it('renders Table with children', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>Test Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className to Table', () => {
    render(
      <Table className="custom-class">
        <tbody>
          <tr>
            <td>Test Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-class');
    expect(table).toHaveClass('w-full');
  });

  it('renders TableHeader with children', () => {
    render(
      <table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </table>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
  });

  it('applies custom className to TableHeader', () => {
    render(
      <table>
        <TableHeader className="custom-class">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </table>,
    );
    const header = screen.getByRole('rowgroup');
    expect(header).toHaveClass('custom-class');
  });

  it('renders TableBody with children', () => {
    render(
      <table>
        <TableBody className="custom-class">
          <TableRow>
            <TableCell>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </table>,
    );
    const body = screen.getByRole('rowgroup');
    expect(body).toHaveClass('custom-class');
    expect(screen.getByText('Cell Content')).toBeInTheDocument();
  });

  it('renders TableFooter with children', () => {
    render(
      <table>
        <TableFooter className="custom-class">
          <TableRow>
            <TableCell>Footer Content</TableCell>
          </TableRow>
        </TableFooter>
      </table>,
    );
    const footer = screen.getByRole('rowgroup');
    expect(footer).toHaveClass('custom-class');
    expect(footer).toHaveClass('bg-muted/50');
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders TableRow with children', () => {
    render(
      <table>
        <tbody>
          <TableRow className="custom-class">
            <TableCell>Row Content</TableCell>
          </TableRow>
        </tbody>
      </table>,
    );
    const row = screen.getByRole('row');
    expect(row).toHaveClass('custom-class');
    expect(row).toHaveClass('border-b');
    expect(screen.getByText('Row Content')).toBeInTheDocument();
  });

  it('renders TableHead with children', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead className="custom-class">Head Content</TableHead>
          </tr>
        </thead>
      </table>,
    );
    const head = screen.getByRole('columnheader');
    expect(head).toHaveClass('custom-class');
    expect(head).toHaveClass('text-foreground');
    expect(screen.getByText('Head Content')).toBeInTheDocument();
  });

  it('renders TableCell with children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-class">Cell Content</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('custom-class');
    expect(cell).toHaveClass('p-2');
    expect(screen.getByText('Cell Content')).toBeInTheDocument();
  });

  it('renders TableCaption with children', () => {
    render(
      <table>
        <TableCaption className="custom-class">Caption Content</TableCaption>
      </table>,
    );
    const caption = screen.getByText('Caption Content');
    expect(caption).toHaveClass('custom-class');
    expect(caption).toHaveClass('text-muted-foreground');
  });

  it('renders a complete table with all components', () => {
    render(
      <Table>
        <TableCaption>Table Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    expect(screen.getByText('Table Caption')).toBeInTheDocument();
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders Table components with no children (edge case)', () => {
    render(
      <table>
        <TableHeader />
        <TableBody />
        <TableFooter />
      </table>,
    );
    expect(screen.getAllByRole('rowgroup').length).toBe(3);
  });
});
