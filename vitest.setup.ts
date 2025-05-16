import '@testing-library/jest-dom';
import { beforeAll, expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add @testing-library/jest-dom matchers to Vitest
expect.extend(matchers);

// Mock ResizeObserver since it's not available in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock for pointerEnter and pointerLeave events
beforeAll(() => {
  // Mock for intersection observer
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Mock window.matchMedia for jsdom environment
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function () {}, // deprecated
      removeListener: function () {}, // deprecated
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
}

// Suppress act() warning globally for all tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: An update to TestComponent inside a test was not wrapped in act')
  ) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (originalError as (...args: any[]) => void)(...args);
};
