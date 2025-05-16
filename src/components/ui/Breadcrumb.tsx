import type { ComponentProps, ReactNode } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

function Breadcrumb({ ...props }: ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5 sm:gap-2.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  href,
  ...props
}: ComponentProps<'a'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-slot="breadcrumb-link"
      href={href}
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role="link"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn('text-foreground font-medium', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children = <ChevronRight className="size-3" />,
  className,
  ...props
}: ComponentProps<'li'> & { children?: ReactNode }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn('text-muted-foreground/25', className)}
      {...props}
    >
      {children}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
