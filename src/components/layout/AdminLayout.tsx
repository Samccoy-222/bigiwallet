import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Ticket,
  Shield,
  Settings,
  Activity,
  LogOut,
  Menu,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
const navigation = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Tickets", path: "/admin/tickets", icon: Ticket },
  { name: "KYC Verification", path: "/admin/kyc", icon: Shield },
  { name: "Activity Logs", path: "/admin/logs", icon: Activity },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 w-64 bg-background-light border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }
              `}
              end={item.path === "/admin"}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Button
            variant="outline"
            fullWidth
            className="flex items-center justify-center"
            onClick={() => logout()}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

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

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="border-b border-neutral-800 bg-background-light/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-light border-t border-neutral-800">
          <nav className="flex flex-col p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }
                `}
                end={item.path === "/admin"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
