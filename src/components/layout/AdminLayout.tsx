import React from "react";
import { Outlet } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

const Navbar: React.FC = () => {
  const { logout } = useAuthStore();
  return (
    <header className="border-b border-neutral-800 bg-background-light/50 backdrop-blur-sm flex h-16 items-center justify-between">
      <div className="p-6 border-neutral-800">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">Admin Panel</span>
        </div>
      </div>
      <div className="flex items-center space-x-1 md:space-x-3 pr-6">
        {/* Lock Wallet Button */}
        <Button variant="outline" size="sm" onClick={() => logout()}>
          <LogOut size={16} className="mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
