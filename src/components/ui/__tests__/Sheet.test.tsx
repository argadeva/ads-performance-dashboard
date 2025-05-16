import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '../Sheet';

vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog');
  return {
    ...actual,
    Root: vi.fn(({ children }) => <div data-testid="dialog-root">{children}</div>),
    Trigger: vi.fn(({ children }) => <button data-testid="dialog-trigger">{children}</button>),
    Close: vi.fn(({ children }) => <button data-testid="dialog-close">{children}</button>),
    Portal: vi.fn(({ children }) => <div data-testid="dialog-portal">{children}</div>),
    Overlay: vi.fn(({ className, children, ...props }) => (
      <div data-testid="dialog-overlay" className={className} {...props}>
        {children}
      </div>
    )),
    Content: vi.fn(({ className, children, ...props }) => (
      <div data-testid="dialog-content" className={className} {...props}>
        {children}
      </div>
    )),
    Title: vi.fn(({ className, children, ...props }) => (
      <h2 data-testid="dialog-title" className={className} {...props}>
        {children}
      </h2>
    )),
    Description: vi.fn(({ className, children, ...props }) => (
      <p data-testid="dialog-description" className={className} {...props}>
        {children}
      </p>
    )),
  };
});

describe('Sheet component', () => {
  it('renders Sheet and associated components', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <div>Content</div>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
  });

  it('renders SheetOverlay with correct className', () => {
    render(<SheetOverlay className="test-class" />);

    expect(screen.getByTestId('dialog-overlay')).toHaveClass('test-class');
    expect(screen.getByTestId('dialog-overlay')).toHaveClass('fixed');
  });

  it('renders SheetContent with side=right by default', () => {
    render(
      <SheetContent>
        <div>Content</div>
      </SheetContent>,
    );

    expect(screen.getByTestId('dialog-portal')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders SheetContent with different sides', () => {
    const { rerender } = render(<SheetContent side="top">Content</SheetContent>);
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();

    rerender(<SheetContent side="bottom">Content</SheetContent>);
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();

    rerender(<SheetContent side="left">Content</SheetContent>);
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();

    rerender(<SheetContent side="right">Content</SheetContent>);
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('renders SheetHeader with correct className', () => {
    render(<SheetHeader className="test-class">Header Content</SheetHeader>);

    const header = screen.getByText('Header Content');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('test-class');
    expect(header).toHaveClass('flex');
  });

  it('renders SheetFooter with correct className', () => {
    render(<SheetFooter className="test-class">Footer Content</SheetFooter>);

    const footer = screen.getByText('Footer Content');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('test-class');
    expect(footer).toHaveClass('flex');
  });

  it('renders SheetTitle with correct className', () => {
    render(<SheetTitle className="test-class">Test Title</SheetTitle>);

    expect(screen.getByTestId('dialog-title')).toHaveClass('test-class');
    expect(screen.getByTestId('dialog-title')).toHaveClass('text-lg');
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders SheetDescription with correct className', () => {
    render(<SheetDescription className="test-class">Test Description</SheetDescription>);

    expect(screen.getByTestId('dialog-description')).toHaveClass('test-class');
    expect(screen.getByTestId('dialog-description')).toHaveClass('text-sm');
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
