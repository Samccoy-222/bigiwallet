import React, { useState, useEffect } from "react";
import { ArrowDownUp, Settings } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
// import TokenIcon from "../components/ui/TokenIcon";
import { useTokens } from "../hooks/useTokens"; // dynamically fetches ERC-20 tokens
import { TokenSelect } from "../components/common/TokenSelect";
import { ethers } from "ethers";
import { parseEther, formatEther } from "viem";
import { provider } from "../utils/sendCrypto";
import { erc20ABI } from "../utils/tokenAbi";
import { useAuthStore } from "../store/authStore";
import uniswapRouterABI from "../utils/uniswapRouterABI";
import { config } from "../wagmi/config";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast, { Toaster } from "react-hot-toast";

const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const MAX_APPROVE_AMOUNT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const Swap: React.FC = () => {
  const { tokens, isLoading: tokensLoading } = useTokens();
  const { wallets } = useAuthStore();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const [fromToken, setFromToken] = useState<any | null>(null);
  const [toToken, setToToken] = useState<any | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approve, setApprove] = useState(false);

  useEffect(() => {
    if (tokens.length > 1) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  useEffect(() => {
    if (!fromToken || fromToken.balance) return;
    const loadBalance = async () => {
      if (fromToken) {
        const contract = new ethers.Contract(
          fromToken.address,
          erc20ABI,
          provider
        );
        const rawBalance = await contract.balanceOf(wallets?.ethereum.address);
        const formattedBalance = ethers.formatUnits(
          rawBalance,
          fromToken.decimals
        );
        setFromToken((prev: any) => {
          return {
            ...prev,
            balance: formattedBalance,
          };
        });
      }
    };
    loadBalance();
  }, [fromToken]);

  const handleSwap = async () => {
    setLoading(true);
    try {
      if (!wallets?.ethereum?.address) {
        toast.error("Connect your wallet first.");
        return;
      }

      const parsedAmountIn = parseEther(fromAmount || "0");

      // Step 1: Check balance
      const balance = fromToken.balance;

      if (fromAmount > balance) {
        toast.error("You don't have enough balance to perform this swap.");
        return; // ❗ early exit
      }

      // Step 2: Check allowance
      const allowance: any = await readContract(config, {
        address: fromToken.address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [wallets.ethereum.address, uniswapRouterAddress],
      });

      if (allowance < parsedAmountIn) {
        setApprove(true);
        const approveTx: any = await writeContract({
          address: fromToken.address,
          abi: erc20ABI,
          functionName: "approve",
          args: [uniswapRouterAddress, MAX_APPROVE_AMOUNT],
        });

        await waitForTransactionReceipt(config, {
          hash: approveTx.hash,
          confirmations: 1,
        });

        setApprove(false);
      }

      // Step 3: Get amountOutMin with slippage
      const amountsOut: any = await readContract(config, {
        address: uniswapRouterAddress,
        abi: uniswapRouterABI,
        functionName: "getAmountsOut",
        args: [parsedAmountIn, [fromToken.address, toToken.address]],
      });

      const amountOut = BigInt(amountsOut[1]?.toString() || "0");
      const slippagePct =
        Math.max(0.1, Math.min(parseFloat(slippage), 50)) / 100;
      const amountOutMin =
        amountOut -
        (amountOut * BigInt(Math.floor(slippagePct * 10000))) / BigInt(10000);

      // Step 4: Execute swap
      const tx: any = await writeContract({
        address: uniswapRouterAddress,
        abi: uniswapRouterABI,
        functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
        args: [
          parsedAmountIn,
          amountOutMin,
          [fromToken.address, toToken.address],
          wallets.ethereum.address,
          (Math.floor(Date.now() / 1000) + 1200).toString(),
        ],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: tx.hash,
        confirmations: 1,
      });

      if (receipt.status === "success") {
        toast.success("Swap successful!");
        setFromAmount("");
        setToAmount("");
      } else {
        toast.error("Transaction failed.");
      }
    } catch (err: any) {
      if (err?.code === "ACTION_REJECTED") {
        toast.error("Transaction rejected by user.");
      } else {
        console.error("Swap error:", err);
        toast.error("Swap failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    if (!fromToken || !toToken) return;
    setFromToken(toToken);
    setToToken(fromToken);
  };

  if (tokensLoading || !fromToken || !toToken) {
    return (
      <div className="max-w-xl mx-auto pt-10">
        <Card className="w-full p-6 text-center">Loading tokens...</Card>
      </div>
    );
  }

  const handleFromAmountChange = async (value: any) => {
    setFromAmount(value);
    try {
      const result: any = await readContract(config, {
        address: uniswapRouterAddress,
        abi: uniswapRouterABI,
        functionName: "getAmountsOut",
        args: [
          parseEther(value?.length > 0 ? value?.toString() : "0"),
          [fromToken.address, toToken.address],
        ],
      });
      setToAmount(formatEther(result?.[1] || "0"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-8 pt-10">
      <Card className="w-full p-3 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Swap Tokens</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-neutral-400" />
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-neutral-800/30 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Slippage Tolerance</h3>
            <div className="flex space-x-2">
              {["0.1", "0.5", "1.0"].map((value, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    slippage === value
                      ? "bg-primary text-white"
                      : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
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
          <TokenSelect
            tokens={tokens}
            selectedToken={fromToken}
            onChange={setFromToken}
          />
          <div className="relative">
            <input
              type="number"
              className="input pr-20 w-full appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              {fromToken.symbol}
            </div>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Balance: {fromToken.balance ? fromToken.balance : "0.0"}
            {" " + fromToken.symbol}
          </p>
        </div>

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
          <TokenSelect
            tokens={tokens}
            selectedToken={toToken}
            onChange={setToToken}
          />
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

        <Button
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={
            !fromAmount ||
            !toAmount ||
            loading ||
            toAmount === "NaN" ||
            isConfirming ||
            isPending
          }
          onClick={handleSwap}
        >
          {isConfirming || isPending ? "Loading" : approve ? "Approve" : "Swap"}
        </Button>
      </Card>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Swap;
