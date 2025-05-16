import type { ComponentProps, HTMLAttributes } from 'react';

import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Dialog({ ...props }: ComponentProps<typeof Root>) {
  return <Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose({ ...props }: ComponentProps<typeof Close>) {
  return <Close data-slot="dialog-close" {...props} />;
}

function DialogPortal({ ...props }: ComponentProps<typeof Portal>) {
  return <Portal {...props} />;
}

function DialogOverlay({ ...props }: ComponentProps<typeof Overlay>) {
  return <Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props} />;
}

function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Content> & {
  children: React.ReactNode;
}) {
  return (
    <Portal>
      <Overlay
        className={cn(
          'bg-background/80 fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        )}
      />
      <Content
        aria-describedby="radix-DialogDescription"
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
          className,
        )}
        {...props}
      >
        {children}
        <Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </Close>
      </Content>
    </Portal>
  );
}

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: ComponentProps<typeof Title>) {
  return (
    <Title
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: ComponentProps<typeof Description>) {
  return <Description className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

export {
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
};
