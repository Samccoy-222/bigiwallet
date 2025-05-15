import React from 'react';
import { ChevronRight } from 'lucide-react';
import TokenIcon from '../ui/TokenIcon';
import PriceChange from '../ui/PriceChange';
import { formatCurrency, formatCrypto } from '../../utils/formatters';
import { Token } from '../../types/wallet';
import { useWalletStore } from '../../store/walletStore';
import { useNavigate } from 'react-router-dom';

interface TokenRowProps {
  token: Token;
}

const TokenRow: React.FC<TokenRowProps> = ({ token }) => {
  const { selectToken } = useWalletStore();
  const navigate = useNavigate();
  
  const handleClick = () => {
    selectToken(token.id);
    navigate('/send-receive');
  };

  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-neutral-800/50 rounded-lg cursor-pointer transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <TokenIcon symbol={token.symbol} logo={token.logo} />
        <div className="ml-3">
          <p className="font-medium">{token.symbol}</p>
          <p className="text-sm text-neutral-400">{token.name}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-right mr-4">
          <p className="font-medium">{formatCurrency(token.balance * token.price)}</p>
          <div className="flex items-center justify-end space-x-1">
            <p className="text-sm text-neutral-400">{formatCrypto(token.balance, token.symbol)}</p>
            <PriceChange value={token.priceChange24h} size="sm" />
          </div>
        </div>
        <ChevronRight size={16} className="text-neutral-400" />
      </div>
    </div>
  );
};

export default TokenRow;