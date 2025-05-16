import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { Token } from "../../types/wallet";
import Card from "../ui/Card";
import TokenRow from "./TokenRow";

type SortBy = "name" | "quantity" | "value";
type SortOrder = "asc" | "desc";

const TokenList: React.FC = () => {
  const { wallets } = useAuthStore();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("value");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!wallets?.ethereum?.address || !wallets?.bitcoin?.address) return;
      setLoading(true);

      try {
        const ethAddress = wallets.ethereum.address;
        const btcAddress = wallets.bitcoin.address;
        const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_API_KEY
        }`;

        // 1. ETH Native Balance
        const ethBalanceRes = await axios.get(alchemyUrl, {
          params: {
            module: "account",
            action: "balance",
            address: ethAddress,
            tag: "latest",
            apikey: import.meta.env.VITE_ETHERSCAN_API_KEY,
          },
        });

        const ethBalance = parseFloat(ethBalanceRes.data.result) / 1e18;

        // 2. BTC Balance
        const btcRes = await axios.get(
          `https://blockstream.info/api/address/${btcAddress}`
        );
        const btcBalance =
          btcRes.data.chain_stats.funded_txo_sum / 1e8 -
          btcRes.data.chain_stats.spent_txo_sum / 1e8;

        // 3. Token Balances
        const tokenBalRes = await axios.post(alchemyUrl, {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenBalances",
          params: [ethAddress],
        });

        const rawTokens = tokenBalRes.data.result.tokenBalances.filter(
          (t: any) => t.tokenBalance !== "0x0"
        );

        const tokenDetails: Token[] = await Promise.all(
          rawTokens.map(async (token: any) => {
            const metadataRes = await axios.post(alchemyUrl, {
              jsonrpc: "2.0",
              id: 1,
              method: "alchemy_getTokenMetadata",
              params: [token.contractAddress],
            });

            const meta = metadataRes.data.result;
            const decimals = meta.decimals || 18;
            const balance =
              parseInt(token.tokenBalance, 16) / Math.pow(10, decimals);

            let price = 0;
            try {
              const priceRes = await axios.get(
                `https://api.coingecko.com/api/v3/simple/token_price/ethereum`,
                {
                  params: {
                    contract_addresses: token.contractAddress,
                    vs_currencies: "usd",
                  },
                }
              );
              price =
                priceRes.data[token.contractAddress.toLowerCase()]?.usd || 0;
            } catch {
              price = 0;
            }

            return {
              id: token.contractAddress,
              name: meta.name || "Unknown",
              symbol: meta.symbol || "",
              logo: meta.logo || "",
              balance,
              price,
              priceChange24h: 0, // optional if you want to enhance with /coins/{id}
            };
          })
        );

        // 4. ETH + BTC static info
        const priceRes = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`
        );

        const extraTokens: Token[] = [
          {
            id: "eth-native",
            name: "Ethereum",
            symbol: "ETH",
            logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010",
            balance: ethBalance,
            price: priceRes.data.ethereum.usd,
            priceChange24h: 0,
          },
          {
            id: "btc-native",
            name: "Bitcoin",
            symbol: "BTC",
            logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=010",
            balance: btcBalance,
            price: priceRes.data.bitcoin.usd,
            priceChange24h: 0,
          },
        ];

        setTokens([...extraTokens, ...tokenDetails]);
      } catch (err) {
        console.error("Failed to fetch tokens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [wallets?.ethereum?.address, wallets?.bitcoin?.address]);

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredTokens = tokens
    .filter(
      (token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let compare = 0;
      if (sortBy === "name") {
        compare = a.name.localeCompare(b.name);
      } else if (sortBy === "quantity") {
        compare = a.balance - b.balance;
      } else if (sortBy === "value") {
        compare = a.balance * a.price - b.balance * b.price;
      }
      return sortOrder === "asc" ? compare : -compare;
    });

  return (
    <Card className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Assets</h2>
        <input
          type="text"
          className="input py-1 px-3 text-sm"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="w-full text-sm text-left">
        <thead className="border-b text-neutral-500">
          <tr>
            <th
              className="cursor-pointer px-3 py-2"
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="cursor-pointer px-3 py-2 text-right"
              onClick={() => handleSort("quantity")}
            >
              Quantity{" "}
              {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="cursor-pointer px-3 py-2 text-right"
              onClick={() => handleSort("value")}
            >
              Value (USD){" "}
              {sortBy === "value" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-neutral-400">
                Loading...
              </td>
            </tr>
          ) : filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <TokenRow key={token.id} token={token} />
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-6 text-neutral-400">
                No assets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default TokenList;
