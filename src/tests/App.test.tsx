import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';

import App from '../App';

function renderAppWithRoute(route: string) {
  window.history.pushState({}, '', route);
  return render(<App />);
}

describe('App', () => {
  it('renders PerformanceSummary on root route', async () => {
    renderAppWithRoute('/');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /ad performance summary/i })).toBeInTheDocument();
    });
  });

  it('renders UserEventLogs on /user-event-logs route', async () => {
    renderAppWithRoute('/user-event-logs');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /user event logs/i })).toBeInTheDocument();
    });
  });
});
