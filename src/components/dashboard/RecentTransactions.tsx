import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatDateTime,
  formatCrypto,
  formatAddress,
} from "../../utils/formatters";

const RecentTransactions: React.FC = () => {
  interface Transaction {
    id: string;
    type: "receive" | "send";
    token: string;
    amount: number;
    timestamp: number;
    address: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  const ethAddress = "0xYourEthereumAddress";
  const btcAddress = "YourBitcoinAddress";
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;

  const fetchEthereumTransactions = async (
    ethAddress: string,
    apiKey: string
  ) => {
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${ethAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    const data = await response.json();
    return data.result.map((tx: any) => ({
      id: tx.hash,
      type:
        tx.to.toLowerCase() === ethAddress.toLowerCase() ? "receive" : "send",
      token: "ETH",
      amount: Number(tx.value) / 1e18,
      timestamp: Number(tx.timeStamp) * 1000,
      address: tx.to,
    }));
  };

  const fetchBitcoinTransactions = async (btcAddress: string) => {
    const response = await fetch(
      `https://blockchain.info/rawaddr/${btcAddress}`
    );
    const data = await response.json();
    return data.txs.map((tx: any) => {
      const isReceive = tx.out.some(
        (output: any) => output.addr === btcAddress
      );
      const value = tx.out.reduce((sum: number, output: any) => {
        if (output.addr === btcAddress) return sum + output.value;
        return sum;
      }, 0);
      return {
        id: tx.hash,
        type: isReceive ? "receive" : "send",
        token: "BTC",
        amount: value / 1e8,
        timestamp: tx.time * 1000,
        address: isReceive ? btcAddress : tx.out[0].addr,
      };
    });
  };

  const fetchAllTransactions = async (
    ethAddress: string,
    btcAddress: string,
    apiKey: string
  ) => {
    const [ethTxs, btcTxs] = await Promise.all([
      fetchEthereumTransactions(ethAddress, apiKey),
      fetchBitcoinTransactions(btcAddress),
    ]);
    return [...ethTxs, ...btcTxs].sort((a, b) => b.timestamp - a.timestamp);
  };

  useEffect(() => {
    const fetchData = async () => {
      const txs = await fetchAllTransactions(ethAddress, btcAddress, apiKey);
      setTransactions(txs.slice(0, 3));
    };
    fetchData();
  }, []);

  return (
    <Card className="w-full animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <button
          onClick={() => navigate("/transactions")}
          className="text-primary hover:text-primary-light text-sm"
        >
          View All
        </button>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "receive" ? "bg-success/20" : "bg-error/20"
                  }`}
                >
                  {tx.type === "receive" ? (
                    <ArrowDownRight size={20} className="text-success" />
                  ) : (
                    <ArrowUpRight size={20} className="text-error" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {tx.type === "receive" ? "Received" : "Sent"} {tx.token}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {formatDateTime(tx.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    tx.type === "receive" ? "text-success" : "text-error"
                  }`}
                >
                  {tx.type === "receive" ? "+" : "-"}{" "}
                  {formatCrypto(tx.amount, tx.token)}
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
