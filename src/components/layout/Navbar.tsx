import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/send-receive/send":
        return "Send & Receive";
      case "/transactions":
        return "Transactions";
      case "/markets":
        return "Markets";
      case "/settings":
        return "Settings";
      case "/swap":
        return "Swap";
      default:
        return "Dashboard";
    }
  };

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

          {/* Page Title - visible on all screens */}
          <div className="flex-1 md:flex-initial">
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Lock Wallet Button */}
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut size={16} className="mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-light border-t border-neutral-800">
          <nav className="flex flex-col p-4 space-y-4">
            <a
              className={`p-2 rounded-lg ${
                location.pathname === "/"
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-300"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </a>
            <a
              className={`p-2 rounded-lg ${
                location.pathname === "/send-receive"
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-300"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/send-receive");
                setIsMobileMenuOpen(false);
              }}
            >
              Send & Receive
            </a>
            <a
              className={`p-2 rounded-lg ${
                location.pathname === "/send-receive"
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-300"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/swap");
                setIsMobileMenuOpen(false);
              }}
            >
              Swap
            </a>
            <a
              className={`p-2 rounded-lg ${
                location.pathname === "/transactions"
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-300"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/transactions");
                setIsMobileMenuOpen(false);
              }}
            >
              Transactions
            </a>
            <a
              className={`p-2 rounded-lg ${
                location.pathname === "/settings"
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-300"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/settings");
                setIsMobileMenuOpen(false);
              }}
            >
              Settings
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
