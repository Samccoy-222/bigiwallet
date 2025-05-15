import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Card from '../ui/Card';
import TokenRow from './TokenRow';
import { useWalletStore } from '../../store/walletStore';

const TokenList: React.FC = () => {
  const { tokens } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Assets</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search assets..."
            className="input py-1.5 pl-9 pr-3 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        {filteredTokens.length > 0 ? (
          filteredTokens.map(token => (
            <TokenRow key={token.id} token={token} />
          ))
        ) : (
          <div className="text-center py-6 text-neutral-400">
            No assets found matching "{searchQuery}"
          </div>
        )}
      </div>
    </Card>
  );
};

export default TokenList;