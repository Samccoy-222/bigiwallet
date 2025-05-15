import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';
import TokenIcon from '../ui/TokenIcon';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { formatDateTime, formatCrypto, formatAddress } from '../../utils/formatters';

const RecentTransactions: React.FC = () => {
  const { transactions } = useWalletStore();
  const navigate = useNavigate();
  
  const recentTransactions = transactions.slice(0, 3);
  
  return (
    <Card className="w-full animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <button 
          onClick={() => navigate('/transactions')}
          className="text-primary hover:text-primary-light text-sm"
        >
          View All
        </button>
      </div>
      
      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${tx.type === 'receive' ? 'bg-success/20' : 'bg-error/20'}`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownRight size={20} className="text-success" />
                  ) : (
                    <ArrowUpRight size={20} className="text-error" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.token}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {formatDateTime(tx.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${tx.type === 'receive' ? 'text-success' : 'text-error'}`}>
                  {tx.type === 'receive' ? '+' : '-'} {formatCrypto(tx.amount, tx.token)}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatAddress(tx.address)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-neutral-400">
          No transactions yet
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;