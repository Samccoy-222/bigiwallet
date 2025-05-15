import React from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useWalletStore } from '../../store/walletStore';

const BalanceCard: React.FC = () => {
  const { totalBalance, refreshBalances } = useWalletStore();
  const [isBalanceHidden, setIsBalanceHidden] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshBalances();
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card variant="glass" className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-neutral-300">Total Balance</h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
          >
            {isBalanceHidden ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
          {isBalanceHidden ? '••••••••' : formatCurrency(totalBalance)}
        </h1>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="primary" 
            className="flex-1"
          >
            Send
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1"
          >
            Receive
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;