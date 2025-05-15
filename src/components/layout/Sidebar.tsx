import React from "react";
import { NavLink } from "react-router-dom";
import {
  Wallet,
  Send,
  History as ListHistory,
  LineChart,
  Settings,
  Repeat,
} from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full h-full bg-background-light border-r border-neutral-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">BigiWallet</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavItem to="/" icon={<Wallet size={20} />} label="Dashboard" />
        <NavItem
          to="/send-receive/send"
          icon={<Send size={20} />}
          label="Send & Receive"
        />
        <NavItem to="/swap" icon={<Repeat size={20} />} label="Swap" />
        <NavItem
          to="/transactions"
          icon={<ListHistory size={20} />}
          label="Transactions"
        />
        <NavItem to="/markets" icon={<LineChart size={20} />} label="Markets" />
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-neutral-800">
        <NavItem
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
        />
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-primary/20 text-primary"
            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
