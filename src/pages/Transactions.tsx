import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import TokenIcon from '../components/ui/TokenIcon';
import Button from '../components/ui/Button';
import { useWalletStore } from '../store/walletStore';
import { formatDateTime, formatCrypto, formatAddress } from '../utils/formatters';

const Transactions: React.FC = () => {
  const { transactions } = useWalletStore();
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'sent' && tx.type !== 'send') return false;
    if (filter === 'received' && tx.type !== 'receive') return false;
    
    return (
      tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.hash && tx.hash.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 pb-8">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transaction History</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="input py-2 pl-9 pr-3 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline'} 
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'sent' ? 'primary' : 'outline'} 
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setFilter('sent')}
              >
                Sent
              </Button>
              <Button 
                variant={filter === 'received' ? 'primary' : 'outline'} 
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setFilter('received')}
              >
                Received
              </Button>
            </div>
          </div>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <div className="space-y-1 animate-fade-in">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-neutral-800/30 rounded-lg transition-all duration-200 border border-transparent hover:border-neutral-700"
              >
                <div className="flex items-center mb-2 md:mb-0">
                  <div className={`p-2 rounded-full ${tx.type === 'receive' ? 'bg-success/20' : 'bg-error/20'}`}>
                    {tx.type === 'receive' ? (
                      <ArrowDownRight size={20} className="text-success" />
                    ) : (
                      <ArrowUpRight size={20} className="text-error" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="font-medium">
                        {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.token}
                      </p>
                      <div className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        tx.status === 'completed' ? 'bg-success/20 text-success' : 
                        tx.status === 'pending' ? 'bg-warning/20 text-warning' : 
                        'bg-error/20 text-error'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {formatDateTime(tx.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="md:text-right">
                  <p className={`font-medium ${tx.type === 'receive' ? 'text-success' : 'text-error'}`}>
                    {tx.type === 'receive' ? '+' : '-'} {formatCrypto(tx.amount, tx.token)}
                  </p>
                  <div className="flex items-center text-xs text-neutral-400">
                    <span>{formatAddress(tx.address, 6, 6)}</span>
                    {tx.hash && (
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:text-primary-light"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400 animate-fade-in">
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">
              {filter !== 'all' 
                ? `Try changing the filter or search terms`
                : searchQuery 
                  ? `No results for "${searchQuery}"`
                  : `Start by sending or receiving crypto`
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;