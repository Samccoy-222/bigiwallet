import React, { useState } from 'react';
import { Search, SortAsc, SortDesc, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import PriceChange from '../components/ui/PriceChange';
import { mockMarketData } from '../utils/mockData';
import { formatCurrency, abbreviateNumber } from '../utils/formatters';
import { MarketData } from '../types/wallet';

type SortKey = 'name' | 'price' | 'marketCap' | 'volume24h' | 'priceChange24h';
type SortOrder = 'asc' | 'desc';

const Markets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedData = [...mockMarketData]
    .filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'volume24h':
          comparison = a.volume24h - b.volume24h;
          break;
        case 'priceChange24h':
          comparison = a.priceChange24h - b.priceChange24h;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ currentKey }: { currentKey: SortKey }) => {
    if (sortKey !== currentKey) return null;
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  return (
    <div className="space-y-6 pb-8">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-6">
          <h2 className="text-xl font-bold">Crypto Markets</h2>
          
          <div className="relative w-full sm:w-auto max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search coin or token..."
              className="input py-2 pl-9 pr-3 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-neutral-800">
            <thead>
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Asset</span>
                    <SortIcon currentKey="name" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price</span>
                    <SortIcon currentKey="price" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('priceChange24h')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>24h Change</span>
                    <SortIcon currentKey="priceChange24h" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => toggleSort('marketCap')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Market Cap</span>
                    <SortIcon currentKey="marketCap" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => toggleSort('volume24h')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Volume (24h)</span>
                    <SortIcon currentKey="volume24h" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  <span>Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 animate-fade-in">
              {sortedData.map((token) => (
                <CryptoRow key={token.id} token={token} />
              ))}
            </tbody>
          </table>

          {sortedData.length === 0 && (
            <div className="text-center py-10 text-neutral-400">
              <p className="text-lg">No cryptocurrencies found</p>
              <p className="text-sm mt-1">Try different search terms</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface CryptoRowProps {
  token: MarketData;
}

const CryptoRow: React.FC<CryptoRowProps> = ({ token }) => {
  return (
    <tr className="hover:bg-neutral-800/30 transition-all duration-200">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={`https://cryptologos.cc/logos/${token.id}-${token.symbol.toLowerCase()}-logo.png`}
            alt={token.name}
            className="w-8 h-8 rounded-full mr-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/3b82f6/FFFFFF?text=${token.symbol.charAt(0)}`;
            }}
          />
          <div>
            <div className="font-medium">{token.name}</div>
            <div className="text-sm text-neutral-400">{token.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
        {formatCurrency(token.price)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <PriceChange value={token.priceChange24h} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right hidden md:table-cell text-neutral-300">
        {abbreviateNumber(token.marketCap)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right hidden md:table-cell text-neutral-300">
        {abbreviateNumber(token.volume24h)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <button className="text-primary hover:text-primary-light">
          <ArrowRight size={18} />
        </button>
      </td>
    </tr>
  );
};

export default Markets;