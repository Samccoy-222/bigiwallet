import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from 'recharts';
import Card from '../ui/Card';
import { mockMarketData } from '../../utils/mockData';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { PriceData } from '../../types/wallet';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-neutral-700 rounded shadow-lg">
        <p className="text-neutral-300">{formatTime(Number(label))}</p>
        <p className="text-white font-medium">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

const PriceChart: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState('bitcoin');
  const tokenData = mockMarketData.find(token => token.id === selectedToken);
  
  if (!tokenData) return null;
  
  return (
    <Card className="w-full h-[300px] animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Price Chart</h2>
        <select 
          className="input py-1 text-sm"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {mockMarketData.map(token => (
            <option key={token.id} value={token.id}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{formatCurrency(tokenData.price)}</h3>
          <div className={tokenData.priceChange24h >= 0 ? 'text-success' : 'text-error'}>
            {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
          </div>
        </div>
        <p className="text-xs text-neutral-400">24h Change</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={tokenData.priceHistory}>
          <XAxis 
            dataKey="timestamp" 
            tick={{ fill: '#64748B' }}
            tickFormatter={(value) => formatTime(value)}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis 
            domain={['dataMin', 'dataMax']} 
            tick={{ fill: '#64748B' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            width={60}
            tickFormatter={(value) => formatCurrency(value, 0)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={tokenData.priceChange24h >= 0 ? '#10B981' : '#EF4444'} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: tokenData.priceChange24h >= 0 ? '#10B981' : '#EF4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriceChart;