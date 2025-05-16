import type { ComponentProps, HTMLAttributes } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li data-slot="pagination-item" className={cn('', className)} {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: ComponentProps<typeof Button> & {
  isActive?: boolean;
}) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      size="default"
      variant="ghost"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </Button>
  );
}

function PaginationNext({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      aria-label="Go to next page"
      data-slot="pagination-next"
      size="default"
      variant="ghost"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </Button>
  );
}

function PaginationEllipsis({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      data-testid="pagination-ellipsis"
      data-slot="pagination-ellipsis"
      className={cn('text-muted-foreground flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
