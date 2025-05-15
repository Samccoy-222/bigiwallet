import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SendReceive from './pages/SendReceive';
import Transactions from './pages/Transactions';
import Markets from './pages/Markets';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Swap from './pages/Swap';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, justRegistered, initialize } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize().finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>; // Or a spinner

  if (!isAuthenticated || justRegistered) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="send-receive" element={<SendReceive />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="markets" element={<Markets />} />
        <Route path="swap" element={<Swap />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
