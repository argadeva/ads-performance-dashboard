import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { UserEventProvider } from '@/context/UserEventContext';
import { useUserEvent } from '@/context/useUserEvent';
import Layout from '@/Layout';
import { PerformanceSummary, UserEventLogs } from '@/pages';

function RouteTracker() {
  const location = useLocation();
  const { trackEvent } = useUserEvent();
  useEffect(() => {
    trackEvent('page_view', { route: location.pathname });
  }, [location.pathname, trackEvent]);
  return null;
}

function AppRoutes() {
  return (
    <Layout>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<PerformanceSummary />} />
        <Route path="/user-event-logs" element={<UserEventLogs />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <UserEventProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserEventProvider>
  );
}

export default App;
