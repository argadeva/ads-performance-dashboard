import type { ReactNode } from 'react';
import React from 'react';

import { act, render } from '@testing-library/react';
import { vi } from 'vitest';

import type { SidebarContextProps } from '../SidebarContext';
import { SidebarContext } from '../SidebarContext';

describe('SidebarContext', () => {
  const mockValue: SidebarContextProps = {
    state: 'expanded',
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile: vi.fn(),
    isMobile: false,
    toggleSidebar: vi.fn(),
    closeMobileSidebar: vi.fn(),
  };

  function TestComponent({ children }: { children: ReactNode }) {
    return <SidebarContext.Provider value={mockValue}>{children}</SidebarContext.Provider>;
  }

  it('provides the correct context value', () => {
    let contextValue: SidebarContextProps | null = null;
    function Consumer() {
      contextValue = React.useContext(SidebarContext);
      return null;
    }
    act(() => {
      render(
        <TestComponent>
          <Consumer />
        </TestComponent>,
      );
    });
    expect(contextValue).toEqual(mockValue);
  });
});
