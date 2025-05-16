import { BrowserRouter, useLocation } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useTheme } from '../context/useTheme';
import Layout from '../Layout';

vi.mock('../context/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe('Layout Component', () => {
  const mockUseLocation = vi.mocked(useLocation);

  beforeEach(() => {
    vi.clearAllMocks();

    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isDark: false,
      toggleTheme: vi.fn(),
    });

    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
  });

  const renderLayout = (children: React.ReactNode = <div>Test Content</div>) => {
    return render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>,
    );
  };

  it('renders the layout with children', () => {
    renderLayout();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the correct page title for root path', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
    renderLayout();
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      'Ad Performance Summary',
    );
  });

  it('renders the correct page title for user event logs path', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/user-event-logs',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
    renderLayout();
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('User Event Logs');
  });

  it('renders the default page title for unknown routes', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/unknown-route',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
    renderLayout();
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('Performance Summary');
  });

  it('renders the dashboard title in breadcrumb', () => {
    renderLayout();
    expect(screen.getByText('Ad Performance Monitoring Dashboard')).toBeInTheDocument();
  });

  describe('ThemeToggleButton', () => {
    it('renders sun icon in light mode', () => {
      (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        isDark: false,
        toggleTheme: vi.fn(),
      });
      renderLayout();
      const button = screen.getByLabelText('Toggle dark mode');
      expect(button).toBeInTheDocument();
      const sunIcon = button.querySelector('.lucide-sun');
      expect(sunIcon).toBeInTheDocument();
    });

    it('renders moon icon in dark mode', () => {
      (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        isDark: true,
        toggleTheme: vi.fn(),
      });
      renderLayout();
      const button = screen.getByLabelText('Toggle dark mode');
      expect(button).toBeInTheDocument();
      const moonIcon = button.querySelector('.lucide-moon');
      expect(moonIcon).toBeInTheDocument();
    });

    it('calls toggleTheme when clicked', () => {
      const mockToggleTheme = vi.fn();
      (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        isDark: false,
        toggleTheme: mockToggleTheme,
      });
      renderLayout();
      const button = screen.getByLabelText('Toggle dark mode');
      fireEvent.click(button);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the sidebar trigger button', () => {
    renderLayout();
    const sidebarTrigger = screen.getByRole('button', {
      name: /toggle sidebar/i,
    });
    expect(sidebarTrigger).toBeInTheDocument();
  });

  it('renders separator correctly', () => {
    renderLayout();
    const separator = document.querySelector('.mr-2.h-4');
    expect(separator).toBeInTheDocument();
  });
});
