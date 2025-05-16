import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useIsMobile } from '../useMobile';

describe('useIsMobile', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  const originalInnerWidth = window.innerWidth;
  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.dispatchEvent(new Event('resize'));
  });

  it('returns true if window.innerWidth is less than breakpoint', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile(768));
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
  });

  it('returns false if window.innerWidth is greater than or equal to breakpoint', () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile(768));
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(false);
  });

  it('updates when window is resized', () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile(768));
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(false);
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
  });
});
