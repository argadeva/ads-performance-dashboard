import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSidebar as useSidebarHook } from '@/context/useSidebar';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '../Sidebar';

function renderSidebar(props = {}, providerProps = {}) {
  return render(
    <SidebarProvider {...providerProps}>
      <Sidebar {...props}>
        <SidebarTrigger />
        <div data-testid="sidebar-children">Sidebar Content</div>
      </Sidebar>
    </SidebarProvider>,
  );
}

describe('Sidebar', () => {
  it('renders sidebar wrapper', () => {
    renderSidebar();
    expect(screen.getByTestId('sidebar-wrapper')).toBeInTheDocument();
  });

  it('renders desktop sidebar by default', () => {
    renderSidebar();
    expect(screen.getByTestId('sidebar-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-children')).toBeInTheDocument();
  });

  it('renders sidebar-none when collapsible is none', () => {
    renderSidebar({ collapsible: 'none' });
    expect(screen.getByTestId('sidebar-none')).toBeInTheDocument();
  });

  it('toggles sidebar with SidebarTrigger', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger />
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = screen.getByTestId('sidebar-trigger');
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
  });

  it('calls onOpenChange when provided', () => {
    const onOpenChange = vi.fn();
    renderSidebar({}, { open: true, onOpenChange });
    const trigger = screen.getByTestId('sidebar-trigger');
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalled();
  });

  it('handles keyboard shortcut (ctrl+b)', () => {
    renderSidebar();
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
  });

  it('sets cookie on toggle', () => {
    renderSidebar();
    const trigger = screen.getByTestId('sidebar-trigger');
    fireEvent.click(trigger);
    expect(document.cookie).toMatch(/sidebar_state=/);
  });

  it('provides context to children', () => {
    let contextValue: { setOpen?: (open: boolean) => void } = {};
    function Consumer() {
      contextValue = useSidebarHook();
      return <div>ok</div>;
    }
    render(
      <SidebarProvider>
        <Consumer />
      </SidebarProvider>,
    );
    expect(contextValue).toBeTruthy();
    expect(typeof contextValue?.setOpen).toBe('function');
  });

  it('renders sidebar-mobile when isMobileOverride is true', () => {
    render(
      <SidebarProvider isMobileOverride={true}>
        <SidebarTrigger />
        <Sidebar>
          <div data-testid="sidebar-children">Sidebar Content</div>
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = screen.getByTestId('sidebar-trigger');
    fireEvent.click(trigger);
    expect(screen.getByTestId('sidebar-mobile')).toBeInTheDocument();
  });
});

describe('Sidebar subcomponents', () => {
  it('renders SidebarContent', () => {
    render(
      <SidebarProvider>
        <SidebarContent data-testid="sidebar-content">Content</SidebarContent>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });

  it('renders SidebarFooter', () => {
    render(
      <SidebarProvider>
        <SidebarFooter data-testid="sidebar-footer">Footer</SidebarFooter>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
  });

  it('renders SidebarGroup and SidebarGroupLabel/Action/Content', () => {
    render(
      <SidebarProvider>
        <SidebarGroup data-testid="sidebar-group">
          <SidebarGroupLabel data-testid="sidebar-group-label">Label</SidebarGroupLabel>
          <SidebarGroupAction data-testid="sidebar-group-action" />
          <SidebarGroupContent data-testid="sidebar-group-content">
            GroupContent
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-label')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-action')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-content')).toBeInTheDocument();
  });

  it('renders SidebarHeader and SidebarInput', () => {
    render(
      <SidebarProvider>
        <SidebarHeader data-testid="sidebar-header">Header</SidebarHeader>
        <SidebarInput data-testid="sidebar-input" />
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-input')).toBeInTheDocument();
  });

  it('renders SidebarInset', () => {
    render(
      <SidebarProvider>
        <SidebarInset data-testid="sidebar-inset">Inset</SidebarInset>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
  });

  it('renders SidebarMenu and SidebarMenuItem', () => {
    render(
      <SidebarProvider>
        <SidebarMenu data-testid="sidebar-menu">
          <SidebarMenuItem data-testid="sidebar-menu-item">Item</SidebarMenuItem>
        </SidebarMenu>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-item')).toBeInTheDocument();
  });

  it('renders SidebarMenuButton with and without tooltip', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton data-testid="sidebar-menu-button">Btn</SidebarMenuButton>
        <SidebarMenuButton data-testid="sidebar-menu-button-tooltip" tooltip="Tooltip">
          Btn
        </SidebarMenuButton>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-button-tooltip')).toBeInTheDocument();
  });

  it('renders SidebarMenuAction and SidebarMenuBadge', () => {
    render(
      <SidebarProvider>
        <SidebarMenuAction data-testid="sidebar-menu-action" />
        <SidebarMenuBadge data-testid="sidebar-menu-badge">Badge</SidebarMenuBadge>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-action')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-badge')).toBeInTheDocument();
  });

  it('renders SidebarMenuSkeleton with and without icon', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSkeleton data-testid="sidebar-menu-skeleton" />
        <SidebarMenuSkeleton data-testid="sidebar-menu-skeleton-icon" showIcon />
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-skeleton-icon')).toBeInTheDocument();
  });

  it('renders SidebarMenuSub and SidebarMenuSubItem/Button', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSub data-testid="sidebar-menu-sub">
          <SidebarMenuSubItem data-testid="sidebar-menu-sub-item">
            <SidebarMenuSubButton data-testid="sidebar-menu-sub-button">
              SubBtn
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-sub')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-sub-item')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-sub-button')).toBeInTheDocument();
  });

  it('renders SidebarRail and SidebarSeparator', () => {
    render(
      <SidebarProvider>
        <SidebarRail data-testid="sidebar-rail" />
        <SidebarSeparator data-testid="sidebar-separator" />
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-rail')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-separator')).toBeInTheDocument();
  });

  it('SidebarMenuButton closes mobile sidebar on click', () => {
    render(
      <SidebarProvider isMobileOverride={true}>
        <SidebarTrigger />
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton data-testid="sidebar-menu-button-mobile">Btn</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    fireEvent.click(screen.getByTestId('sidebar-trigger'));
    fireEvent.click(screen.getByTestId('sidebar-menu-button-mobile'));
    expect(screen.queryByTestId('sidebar-mobile')).not.toBeInTheDocument();
  });

  it('SidebarMenuButton renders tooltip as object', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton
          data-testid="sidebar-menu-button-tooltip-obj"
          tooltip={{ children: 'ObjTooltip' }}
        >
          Btn
        </SidebarMenuButton>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-button-tooltip-obj')).toBeInTheDocument();
  });

  it('SidebarMenuButton isActive/variant/size props', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton
          data-testid="sidebar-menu-button-active"
          isActive
          variant="outline"
          size="lg"
        >
          Btn
        </SidebarMenuButton>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-button-active')).toBeInTheDocument();
  });

  it('SidebarMenuAction showOnHover prop', () => {
    render(
      <SidebarProvider>
        <SidebarMenuAction data-testid="sidebar-menu-action-hover" showOnHover />
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-action-hover')).toBeInTheDocument();
  });

  it('SidebarMenuSubButton asChild and size', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton data-testid="sidebar-menu-sub-button-sm" size="sm">
            SubBtn
          </SidebarMenuSubButton>
          <SidebarMenuSubButton asChild size="md">
            <span data-testid="sidebar-menu-sub-button-aschild">SubBtn</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-menu-sub-button-sm')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-sub-button-aschild')).toBeInTheDocument();
  });

  it('SidebarGroupLabel asChild', () => {
    render(
      <SidebarProvider>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <span data-testid="sidebar-group-label-aschild">Label</span>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-group-label-aschild')).toBeInTheDocument();
  });

  it('SidebarGroupAction asChild', () => {
    render(
      <SidebarProvider>
        <SidebarGroup>
          <SidebarGroupAction asChild>
            <button data-testid="sidebar-group-action-aschild" />
          </SidebarGroupAction>
        </SidebarGroup>
      </SidebarProvider>,
    );
    expect(screen.getByTestId('sidebar-group-action-aschild')).toBeInTheDocument();
  });
});
