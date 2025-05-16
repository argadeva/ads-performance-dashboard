import { render } from '@testing-library/react';
import { vi } from 'vitest';

import type { SidebarContextProps } from '../SidebarContext';
import { SidebarContext } from '../SidebarContext';
import { useSidebar } from '../useSidebar';

describe('useSidebar', () => {
  const mockValue: SidebarContextProps = {
    state: 'expanded',
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile: vi.fn(),
    isMobile: false,
    toggleSidebar: vi.fn(),
    closeMobileSidebar: vi.fn(),
  };

  it('returns context value when inside provider', () => {
    let contextValue: SidebarContextProps | null = null;
    function Consumer() {
      contextValue = useSidebar();
      return null;
    }
    render(
      <SidebarContext.Provider value={mockValue}>
        <Consumer />
      </SidebarContext.Provider>,
    );
    expect(contextValue).toEqual(mockValue);
  });

  it('throws error when used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    function Consumer() {
      useSidebar();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow('useSidebar must be used within a SidebarProvider.');
    console.error = originalError;
  });
});
