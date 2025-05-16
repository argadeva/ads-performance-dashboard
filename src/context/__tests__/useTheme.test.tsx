import { act, render } from '@testing-library/react';

import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  it('returns context value when inside provider', () => {
    let contextValue = null as {
      isDark: boolean;
      toggleTheme: () => void;
    } | null;
    function Consumer() {
      contextValue = useTheme();
      return null;
    }
    act(() => {
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>,
      );
    });
    expect(typeof contextValue?.isDark).toBe('boolean');
    expect(typeof contextValue?.toggleTheme).toBe('function');
  });

  it('throws error when used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    function Consumer() {
      useTheme();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow('useTheme must be used within ThemeProvider');
    console.error = originalError;
  });
});
