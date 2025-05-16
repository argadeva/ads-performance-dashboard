import * as React from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../useTheme';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: actual.useState,
  };
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('provides default theme state', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBeDefined();
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('toggles theme state', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    const initialState = result.current.isDark;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(!initialState);
  });

  it('persists theme state to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('theme')).toBe(result.current.isDark ? 'dark' : 'light');
  });

  it('initializes theme from localStorage with dark theme', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    matchMediaSpy.mockReturnValue({ matches: false } as MediaQueryList);
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(true);
  });

  it('initializes theme from localStorage with light theme', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    matchMediaSpy.mockReturnValue({ matches: true } as MediaQueryList);
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(false);
  });

  it('applies theme class to document', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    const hasDarkClass = document.documentElement.classList.contains('dark');
    expect(hasDarkClass).toBe(result.current.isDark);
  });

  it('uses system preference when no theme is stored', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    matchMediaSpy.mockReturnValue({ matches: true } as MediaQueryList);

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(true);
  });

  it('defaults to light theme when window is undefined', () => {
    const originalWindow = window;
    const useStateSpy = vi.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce((...args: unknown[]) => {
      let state;
      if (args.length === 0) {
        state = undefined;
      } else if (typeof args[0] === 'function') {
        const fn = args[0] as () => unknown;
        const globalWithWindow = globalThis as unknown as {
          window?: typeof window;
        };
        const hadWindow = 'window' in globalWithWindow;
        if (hadWindow) delete globalWithWindow.window;
        state = fn();
        if (hadWindow) globalWithWindow.window = originalWindow;
      } else {
        state = args[0];
      }
      return [state, vi.fn()];
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);
    expect(useStateSpy).toHaveBeenCalled();
  });

  it('throws error when useTheme is used outside of provider', () => {
    const consoleErrorMock = vi.spyOn(console, 'error');
    consoleErrorMock.mockImplementation(() => {});
    const renderOutsideProvider = () => {
      renderHook(() => useTheme());
    };
    expect(renderOutsideProvider).toThrow('useTheme must be used within ThemeProvider');
    consoleErrorMock.mockRestore();
  });
});
