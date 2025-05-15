import React, { useState } from 'react';
import { Send, QrCode, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TokenIcon from '../components/ui/TokenIcon';
import { useWalletStore } from '../store/walletStore';
import { formatAddress } from '../utils/formatters';
import QRCode from 'qrcode.react';

const SendReceive: React.FC = () => {
  const { tokens, address, selectedToken, selectToken, sendTransaction } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [addressCopied, setAddressCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const currentToken = selectedToken 
    ? tokens.find(t => t.id === selectedToken) 
    : tokens[0];
  
  const handleSend = () => {
    if (!currentToken || !recipientAddress || !amount) return;
    
    sendTransaction({
      type: 'send',
      amount: parseFloat(amount),
      token: currentToken.symbol,
      address: recipientAddress,
    });
    
    setShowConfirmation(true);
    
    // Reset form
    setTimeout(() => {
      setRecipientAddress('');
      setAmount('');
      setShowConfirmation(false);
    }, 3000);
  };
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto pb-8">
      {/* Tabs */}
      <div className="flex bg-background-light rounded-lg mb-6 p-1">
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-all ${
            activeTab === 'send'
              ? 'bg-primary text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('send')}
        >
          <div className="flex items-center justify-center space-x-2">
            <Send size={18} />
            <span>Send</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-all ${
            activeTab === 'receive'
              ? 'bg-secondary text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('receive')}
        >
          <div className="flex items-center justify-center space-x-2">
            <QrCode size={18} />
            <span>Receive</span>
          </div>
        </button>
      </div>

      <Card className="w-full animate-fade-in">
        {activeTab === 'send' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Send {currentToken?.symbol}</h2>
            
            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Select Asset
              </label>
              <select
                className="input w-full"
                value={selectedToken || ''}
                onChange={(e) => selectToken(e.target.value)}
              >
                {tokens.map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Recipient Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="Enter recipient address"
                className="input w-full"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  className="input w-full pr-20"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {currentToken && (
                    <div className="flex items-center">
                      <span className="text-neutral-400 mr-2">
                        {currentToken.symbol}
                      </span>
                      <TokenIcon symbol={currentToken.symbol} logo={currentToken.logo} size="sm" />
                    </div>
                  )}
                </div>
              </div>
              {currentToken && (
                <p className="text-sm text-neutral-400 mt-1">
                  Balance: {currentToken.balance} {currentToken.symbol}
                </p>
              )}
            </div>
            
            {/* Confirmation message */}
            {showConfirmation && (
              <div className="bg-success/20 text-success p-4 rounded-lg flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span>Transaction sent successfully!</span>
              </div>
            )}
            
            {/* Send Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleSend}
              disabled={!recipientAddress || !amount || showConfirmation}
            >
              Send {currentToken?.symbol}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Receive {currentToken?.symbol}</h2>
            
            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Select Asset
              </label>
              <select
                className="input w-full"
                value={selectedToken || ''}
                onChange={(e) => selectToken(e.target.value)}
              >
                {tokens.map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-white p-3 rounded-lg mb-4">
                <QRCode 
                  value={address} 
                  size={180} 
                  level="H" 
                  includeMargin={true}
                />
              </div>
              
              {/* Wallet Address */}
              <div className="w-full">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Your Wallet Address
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="input flex-1"
                    value={address}
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={copyAddress}
                  >
                    {addressCopied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </Button>
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  Share this address to receive {currentToken?.symbol} payments.
                </p>
              </div>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 text-warning rounded-lg p-4 flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Only send {currentToken?.symbol} to this address. Sending any other coin or token may result in permanent loss.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SendReceive;