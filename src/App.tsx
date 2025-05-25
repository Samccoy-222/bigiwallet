import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import SendReceive from "./pages/SendReceive";
import Transactions from "./pages/Transactions";
import Markets from "./pages/Markets";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Swap from "./pages/Swap";
import { useAuthStore } from "./store/authStore";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="send-receive/:action" element={<SendReceive />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="markets" element={<Markets />} />
            <Route path="swap" element={<Swap />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
