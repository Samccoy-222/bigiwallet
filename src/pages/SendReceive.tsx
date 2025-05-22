import React, { useEffect, useState } from "react";
import { Send, QrCode, Copy, CheckCircle, AlertCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TokenIcon from "../components/ui/TokenIcon";
import { useWalletStore } from "../store/walletStore";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SendReceive: React.FC = () => {
  const params = useParams();
  const { walletTokens, selectedToken, selectToken, sendTransaction } =
    useWalletStore();
  const [receiveAddress, setReceiveAddress] = useState("");
  const { wallets } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"send" | "receive">(
    params.action === "receive" ? "receive" : "send"
  );
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [addressCopied, setAddressCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const receiveData = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: wallets?.bitcoin.address,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      address: wallets?.ethereum.address,
    },
  ];

  const currentToken = receiveAddress
    ? receiveData.find((t) => t.address === receiveAddress)
    : receiveData[0];

  const toSendToken = walletTokens.find((t) => t.id === selectedToken);

  const handleSend = () => {
    if (!toSendToken || !recipientAddress || !amount) return;

    sendTransaction({
      type: "send",
      amount: parseFloat(amount),
      token: toSendToken.symbol,
      address: recipientAddress,
    });

    setShowConfirmation(true);

    // Reset form
    setTimeout(() => {
      setRecipientAddress("");
      setAmount("");
      setShowConfirmation(false);
    }, 3000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(receiveAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  useEffect(() => {
    setReceiveAddress(wallets?.bitcoin.address || "");
  }, [wallets?.bitcoin.address]);

  return (
    <div className="max-w-xl mx-auto pb-8">
      {/* Tabs */}
      <div className="flex bg-background-light rounded-lg mb-6 p-1">
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-all ${
            activeTab === "send"
              ? "bg-primary text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("send")}
        >
          <div className="flex items-center justify-center space-x-2">
            <Send size={18} />
            <span>Send</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-all ${
            activeTab === "receive"
              ? "bg-secondary text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("receive")}
        >
          <div className="flex items-center justify-center space-x-2">
            <QrCode size={18} />
            <span>Receive</span>
          </div>
        </button>
      </div>

      <Card className="w-full animate-fade-in">
        {activeTab === "send" ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Send {toSendToken?.symbol}</h2>

            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Select Asset
              </label>
              <select
                className="input w-full"
                value={selectedToken || ""}
                onChange={(e) => selectToken(e.target.value)}
              >
                {walletTokens.map((token) => (
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
                  {toSendToken && (
                    <div className="flex items-center">
                      <span className="text-neutral-400 mr-2">
                        {toSendToken.symbol}
                      </span>
                      <TokenIcon
                        symbol={toSendToken.symbol}
                        // logo={currentToken.logo}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
              {toSendToken && (
                <p className="text-sm text-neutral-400 mt-1">
                  Balance: {toSendToken.balance} {toSendToken.symbol}
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
              Send {toSendToken?.symbol}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">
              Receive {currentToken?.symbol}
            </h2>

            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Select Asset
              </label>
              <select
                className="input w-full"
                value={receiveAddress || ""}
                onChange={(e) => setReceiveAddress(e.target.value)}
              >
                {receiveData.map((network) => (
                  <option key={network.name} value={network.address}>
                    {network.name} ({network.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-white p-3 rounded-lg mb-4">
                <QRCode
                  value={receiveAddress}
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
                    value={receiveAddress}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={copyAddress}
                  >
                    {addressCopied ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
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
                Only send{" "}
                {currentToken?.name === "Bitcoin" ? "BTC" : "ethereum tokens"}{" "}
                to this address. Sending any other coin or token may result in
                permanent loss.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SendReceive;
