import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Settings, Info, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TokenIcon from '../components/ui/TokenIcon';
import { Token } from '@uniswap/sdk-core';
import { useWalletStore } from '../store/walletStore';
import { formatCurrency, formatCrypto } from '../utils/formatters';

const Swap: React.FC = () => {
  const { tokens, address } = useWalletStore();
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [route, setRoute] = useState<any>(null);

  // Simulated price calculation
  const calculatePrice = async (amount: string, from: any, to: any) => {
    if (!amount || !from || !to) return;
    
    try {
      // Simulate price calculation with a simple ratio for demo
      const fromPrice = from.price;
      const toPrice = to.price;
      const ratio = toPrice / fromPrice;
      const calculatedAmount = parseFloat(amount) * ratio;
      
      // Simulate price impact
      const impact = (Math.random() * 2).toFixed(2);
      setPriceImpact(parseFloat(impact));
      
      setToAmount(calculatedAmount.toFixed(6));
    } catch (error) {
      console.error('Price calculation error:', error);
    }
  };

  useEffect(() => {
    if (fromAmount) {
      calculatePrice(fromAmount, fromToken, toToken);
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    setLoading(true);
    try {
      // Simulate swap delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setPriceImpact(null);
      
      // Show success message
      alert('Swap successful!');
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="max-w-xl mx-auto pb-8">
      <Card className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Swap Tokens</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-neutral-800/30 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Slippage Tolerance</h3>
            <div className="flex space-x-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    slippage === value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex-1">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="input w-full pr-8 text-sm"
                  placeholder="Custom"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  %
                </span>
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            From
          </label>
          <div className="relative">
            <select
              className="input pr-20 appearance-none w-full mb-2"
              value={fromToken.id}
              onChange={(e) => setFromToken(tokens.find(t => t.id === e.target.value)!)}
            >
              {tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.name} ({token.symbol})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3">
              <TokenIcon symbol={fromToken.symbol} size="sm" />
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              className="input pr-20 w-full"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              {fromToken.symbol}
            </div>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Balance: {formatCrypto(fromToken.balance, fromToken.symbol)}
          </p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={switchTokens}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <ArrowDownUp size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            To
          </label>
          <div className="relative">
            <select
              className="input pr-20 appearance-none w-full mb-2"
              value={toToken.id}
              onChange={(e) => setToToken(tokens.find(t => t.id === e.target.value)!)}
            >
              {tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.name} ({token.symbol})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3">
              <TokenIcon symbol={toToken.symbol} size="sm" />
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              className="input pr-20 w-full"
              placeholder="0.0"
              value={toAmount}
              readOnly
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              {toToken.symbol}
            </div>
          </div>
        </div>

        {/* Price Impact Warning */}
        {priceImpact !== null && priceImpact > 1 && (
          <div className="mb-4 p-3 bg-warning/10 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5 mr-2" />
            <div>
              <p className="text-warning text-sm font-medium">
                High Price Impact
              </p>
              <p className="text-warning/80 text-sm">
                Your trade has a price impact of {priceImpact}%. Consider reducing your trade size.
              </p>
            </div>
          </div>
        )}

        {/* Price Info */}
        {fromAmount && toAmount && (
          <div className="mb-6 p-4 bg-neutral-800/30 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Rate</span>
              <span>
                1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Price Impact</span>
              <span className={priceImpact && priceImpact > 1 ? 'text-warning' : ''}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Minimum Received</span>
              <span>
                {(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={!fromAmount || !toAmount || loading}
          onClick={handleSwap}
        >
          Swap
        </Button>
      </Card>
    </div>
  );
};

export default Swap;