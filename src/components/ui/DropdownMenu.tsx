import type { ComponentProps } from 'react';

import {
  CheckboxItem,
  Content,
  ItemIndicator,
  Label,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function DropdownMenu({
  'data-testid': dataTestId,
  ...props
}: ComponentProps<typeof Root> & { 'data-testid'?: string }) {
  return <Root data-slot="dropdown-menu" data-testid={dataTestId} {...props} />;
}

function DropdownMenuTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuPortal({ ...props }: ComponentProps<typeof Portal>) {
  return <Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </Portal>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof CheckboxItem>) {
  return (
    <CheckboxItem
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <CheckIcon className="size-4" />
        </ItemIndicator>
      </span>
      {children}
    </CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: ComponentProps<typeof RadioGroup>) {
  return <RadioGroup {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof RadioItem>) {
  return (
    <RadioItem
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ItemIndicator>
      </span>
      {children}
    </RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof Label> & { inset?: boolean }) {
  return (
    <Label
      className={cn(
        'text-foreground px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />;
}

function DropdownMenuSub({ ...props }: ComponentProps<typeof Sub>) {
  return <Sub {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof SubTrigger> & { inset?: boolean }) {
  return (
    <SubTrigger
      className={cn(
        'focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: ComponentProps<typeof SubContent>) {
  return (
    <SubContent
      className={cn(
        'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
