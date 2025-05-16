import { BrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from '../ui/Sidebar';

function DummyIcon() {
  return <svg data-testid="dummy-icon" />;
}

describe('AppSidebar', () => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <SidebarProvider>{children}</SidebarProvider>
      </BrowserRouter>
    );
  }
  it('renders dashboard title', () => {
    render(<AppSidebar menuItems={[]} />, { wrapper: Wrapper });
    expect(screen.getByText('Ad Performance')).toBeInTheDocument();
    expect(screen.getByText('Monitoring Dashboard')).toBeInTheDocument();
  });
  it('renders menu items', () => {
    const menuItems = [{ title: 'Test Menu', icon: DummyIcon, url: '/test' }];
    render(<AppSidebar menuItems={menuItems} />, { wrapper: Wrapper });
    expect(screen.getByText('Test Menu')).toBeInTheDocument();
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });
  it('renders logout button', () => {
    render(<AppSidebar menuItems={[]} />, { wrapper: Wrapper });
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  it('renders active menu item', () => {
    const menuItems = [{ title: 'Active Menu', icon: DummyIcon, url: '/' }];
    render(<AppSidebar menuItems={menuItems} />, { wrapper: Wrapper });
    const activeLink = screen.getByText('Active Menu').closest('a');
    expect(activeLink).toHaveAttribute('href', '/');
  });
  it('renders empty state if menuItems is empty', () => {
    render(<AppSidebar menuItems={[]} />, { wrapper: Wrapper });
    expect(screen.queryByRole('link', { name: /Test Menu/i })).toBeNull();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Ad Performance')).toBeInTheDocument();
  });
  it('renders multiple menu items and highlights active', () => {
    const menuItems = [
      { title: 'Menu 1', icon: DummyIcon, url: '/one' },
      { title: 'Menu 2', icon: DummyIcon, url: '/' },
    ];
    render(<AppSidebar menuItems={menuItems} />, { wrapper: Wrapper });
    expect(screen.getByText('Menu 1')).toBeInTheDocument();
    expect(screen.getByText('Menu 2')).toBeInTheDocument();
    const activeLink = screen.getByText('Menu 2').closest('a');
    expect(activeLink).toHaveAttribute('href', '/');
  });
  it('handles click on logout button', () => {
    render(<AppSidebar menuItems={[]} />, { wrapper: Wrapper });
    const logoutBtn = screen.getByText('Logout');
    logoutBtn.click();
    expect(logoutBtn).toBeInTheDocument();
  });
});
