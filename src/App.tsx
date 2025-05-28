import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import SendReceive from "./pages/SendReceive";
import Transactions from "./pages/Transactions";
import Markets from "./pages/Markets";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Swap from "./pages/Swap";
import Support from "./pages/Support";
import { useAuthStore } from "./store/authStore";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Admin pages
import Users from "./pages/admin/Users";
import Tickets from "./pages/admin/Tickets";
import KYC from "./pages/admin/KYC";
import Logs from "./pages/admin/Logs";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, justRegistered, isAdmin, initialize } =
    useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize().finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || justRegistered) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Users />} />
              <Route path="users" element={<Users />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="logs" element={<Logs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="send-receive/:action" element={<SendReceive />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="markets" element={<Markets />} />
            <Route path="swap" element={<Swap />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
