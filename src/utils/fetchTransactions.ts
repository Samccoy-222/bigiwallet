import { NormalizedTransaction } from "../types/wallet";
import { supabase } from "../store/authStore";

function normalizeBitcoinTx(
  tx: any,
  walletAddress: string
): NormalizedTransaction {
  const inputAddresses = tx.inputs.map((i: any) => i.coin?.address);
  const outputAddresses = tx.outputs.map((o: any) => o.address);

  const isIncoming = outputAddresses.includes(walletAddress);
  const isOutgoing = inputAddresses.includes(walletAddress);

  let amount = 0;
  let counterAddress = "unknown";

  if (isIncoming) {
    const incomingOutput = tx.outputs.find(
      (o: any) => o.address === walletAddress
    );
    amount = incomingOutput?.value || 0;
    counterAddress = tx.inputs[0]?.coin?.address || "unknown";
  } else if (isOutgoing) {
    const input = tx.inputs.find((i: any) => i.coin?.address === walletAddress);
    amount = input?.coin?.value || 0;
    counterAddress =
      tx.outputs.find((o: any) => o.address !== walletAddress)?.address ||
      "unknown";
  }

  return {
    chain: "bitcoin-mainnet",
    hash: tx.hash,
    address: walletAddress,
    blockNumber: tx.blockNumber ?? null,
    transactionIndex: tx.index ?? 0,
    transactionType: "native",
    transactionSubtype: isIncoming ? "incoming" : "outgoing",
    amount: amount.toString(),
    timestamp: tx.time ?? Date.now(),
    tokenAddress: null,
    symbol: "BTC",
    tokenName: "Bitcoin",
    counterAddress,
    status: tx.blockNumber ? "confirmed" : "pending",
  };
}

export async function fetchTransactions(
  ethAddress: string,
  ethPageSize: number,
  ethOffset: number,
  btcAddress: string,
  btcPageSize: number,
  btcOffset: number
): Promise<{ transactions: NormalizedTransaction[] }> {
  try {
    const { data } = await supabase.functions.invoke("get-transactions", {
      body: JSON.stringify({
        ethAddress,
        ethPageSize,
        ethOffset,
        btcAddress,
        btcPageSize,
        btcOffset,
      }),
    });

    const btcTransactions = Array.isArray(data?.btc)
      ? data.btc.map((tx: any) => normalizeBitcoinTx(tx, btcAddress))
      : [];

    const ethTransactions = Array.isArray(data?.eth)
      ? data.eth.map((tx: any) => ({
          chain: "ethereum-mainnet",
          hash: tx.hash,
          address: ethAddress,
          blockNumber: tx.blockNumber ?? null,
          transactionIndex: tx.transactionIndex ?? 0,
          transactionType: tx.transactionType ?? "native", // fallback to "native"
          transactionSubtype: tx.transactionSubtype,
          amount: tx.amount,
          timestamp: tx.timestamp,
          tokenAddress: tx.tokenAddress ?? ethAddress,
          symbol: tx.symbol ?? "ETH",
          tokenName: tx.tokenName,
          counterAddress: tx.counterAddress,
          status: tx.blockNumber ? "confirmed" : "pending",
        }))
      : [];

    const transactions = [...btcTransactions, ...ethTransactions];
    return { transactions };
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    throw new Error("Failed to fetch user tokens");
  }
}
