import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Copy, LogOut, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import { useWalletStore } from '../../store/walletStore';
import { formatAddress } from '../../utils/formatters';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, lockWallet } = useWalletStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/send-receive':
        return 'Send & Receive';
      case '/transactions':
        return 'Transactions';
      case '/markets':
        return 'Markets';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setShowAddressTooltip(true);
    setTimeout(() => setShowAddressTooltip(false), 2000);
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
            {/* Wallet Address */}
            <div className="hidden md:flex items-center bg-neutral-800 rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-success mr-2"></div>
              <span className="text-sm text-neutral-300">{formatAddress(address)}</span>
              <button 
                className="ml-2 text-neutral-400 hover:text-white"
                onClick={copyAddress}
              >
                <Copy size={14} />
              </button>
              {showAddressTooltip && (
                <div className="absolute mt-16 bg-neutral-800 text-white text-xs px-2 py-1 rounded">
                  Address copied!
                </div>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error flex items-center justify-center text-xs">
                2
              </span>
            </Button>

            {/* Lock Wallet Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => lockWallet()}
            >
              <LogOut size={16} className="mr-1" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-light border-t border-neutral-800">
          <nav className="flex flex-col p-4 space-y-4">
            <a 
              className={`p-2 rounded-lg ${location.pathname === '/' ? 'bg-primary/20 text-primary' : 'text-neutral-300'}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </a>
            <a 
              className={`p-2 rounded-lg ${location.pathname === '/send-receive' ? 'bg-primary/20 text-primary' : 'text-neutral-300'}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/send-receive');
                setIsMobileMenuOpen(false);
              }}
            >
              Send & Receive
            </a>
            <a 
              className={`p-2 rounded-lg ${location.pathname === '/transactions' ? 'bg-primary/20 text-primary' : 'text-neutral-300'}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/transactions');
                setIsMobileMenuOpen(false);
              }}
            >
              Transactions
            </a>
            <a 
              className={`p-2 rounded-lg ${location.pathname === '/markets' ? 'bg-primary/20 text-primary' : 'text-neutral-300'}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/markets');
                setIsMobileMenuOpen(false);
              }}
            >
              Markets
            </a>
            <a 
              className={`p-2 rounded-lg ${location.pathname === '/settings' ? 'bg-primary/20 text-primary' : 'text-neutral-300'}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/settings');
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