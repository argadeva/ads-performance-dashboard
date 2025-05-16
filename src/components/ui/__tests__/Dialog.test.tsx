import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../Dialog';

vi.mock('@radix-ui/react-dialog', () => {
  const storeCallback = (callback: (open: boolean) => void): string => {
    const fnName = `dialogCallback_${Math.random().toString(36).substring(2, 9)}`;
    (window as unknown as Record<string, (open: boolean) => void>)[fnName] = callback;
    return fnName;
  };

  return {
    Root: ({
      children,
      open,
      onOpenChange,
    }: {
      children: React.ReactNode;
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
    }) => {
      const fnName = onOpenChange ? storeCallback(onOpenChange) : '';
      return open ? (
        <div data-testid="dialog-root" data-onchange-fn={fnName}>
          {children}
        </div>
      ) : null;
    },

    Portal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-portal">{children}</div>
    ),

    Overlay: ({
      className,
      onClick,
    }: {
      className?: string;
      onClick?: (e: React.MouseEvent) => void;
    }) => (
      <div
        data-testid="dialog-overlay"
        className={className}
        onClick={(e) => {
          if (onClick) onClick(e as React.MouseEvent);

          const dialogRoot = document.querySelector('[data-testid="dialog-root"]');
          const fnName = dialogRoot?.getAttribute('data-onchange-fn');
          if (
            fnName &&
            typeof (window as unknown as Record<string, (open: boolean) => void>)[fnName] ===
              'function'
          ) {
            (window as unknown as Record<string, (open: boolean) => void>)[fnName](false);
          }
        }}
      />
    ),

    Content: ({
      className,
      children,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="dialog-content" role="dialog" className={className} {...props}>
        {children}
      </div>
    ),

    Close: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => {
      return (
        <button
          data-testid="dialog-close"
          aria-label="Close"
          className={className}
          onClick={() => {
            const dialogRoot = document.querySelector('[data-testid="dialog-root"]');
            const fnName = dialogRoot?.getAttribute('data-onchange-fn');
            if (
              fnName &&
              typeof (window as unknown as Record<string, (open: boolean) => void>)[fnName] ===
                'function'
            ) {
              (window as unknown as Record<string, (open: boolean) => void>)[fnName](false);
            }
          }}
        >
          {children}
        </button>
      );
    },

    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <h2 className={className}>{children}</h2>
    ),

    Description: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <p className={className}>{children}</p>
    ),

    Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  };
});

describe('Dialog Component', () => {
  it('renders correctly when open is true', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <DialogContent>Dialog Content</DialogContent>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('renders DialogTrigger component', () => {
    render(
      <Dialog open={true}>
        <DialogTrigger data-testid="dialog-trigger">Open Dialog</DialogTrigger>
        <DialogContent>Test Dialog</DialogContent>
      </Dialog>,
    );

    expect(document.querySelector('button')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <DialogContent>Dialog Content</DialogContent>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when the close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    const closeButton = screen.getByTestId('dialog-close');
    fireEvent.click(closeButton);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange when clicking outside the dialog content', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
        </DialogContent>
      </Dialog>,
    );

    const overlay = screen.getByTestId('dialog-overlay');
    fireEvent.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not call onOpenChange when clicking inside the dialog content', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogContent>Dialog Content</DialogContent>
        </DialogContent>
      </Dialog>,
    );

    const dialogContent = screen.getByText('Dialog Content');
    fireEvent.click(dialogContent);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('renders with custom className if provided', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-class">
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <DialogContent>Dialog Content</DialogContent>
        </DialogContent>
      </Dialog>,
    );

    const dialogElement = document.querySelector('.custom-class');
    expect(dialogElement).toBeInTheDocument();
  });

  it('renders DialogPortal and DialogOverlay', () => {
    render(
      <Dialog open={true}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>Test Content</DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    expect(screen.getAllByTestId('dialog-portal')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('dialog-overlay')[0]).toBeInTheDocument();
  });

  it('renders DialogFooter with custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter className="footer-class">
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const footerElement = document.querySelector('.footer-class');
    expect(footerElement).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders DialogHeader with custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader className="header-class">
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    const headerElement = document.querySelector('.header-class');
    expect(headerElement).toBeInTheDocument();
  });
});
