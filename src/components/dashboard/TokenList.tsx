// components/wallet/TokenList.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Token } from "../../types/wallet";
import Card from "../ui/Card";
import { fetchUserTokens } from "../../utils/fetchUserTokens";
import { formatCurrency, formatCrypto } from "../../utils/formatters";
import { usePriceChart } from "../../context/PriceChartContext";
import { useWalletStore } from "../../store/walletStore";

type SortBy = "name" | "quantity" | "value";
type SortOrder = "asc" | "desc";

const TokenList: React.FC = () => {
  const { wallets } = useAuthStore();
  const { setTotalBalance } = usePriceChart();
  const { setWalletTokens } = useWalletStore();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("value");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false); // to prevent double fetch

  useEffect(() => {
    if (
      !wallets?.ethereum?.address ||
      !wallets?.bitcoin?.address ||
      hasLoaded.current
    )
      return;

    hasLoaded.current = true;

    const load = async () => {
      setLoading(true);
      try {
        const fetched = await fetchUserTokens(
          wallets.ethereum.address,
          wallets.bitcoin.address
        );
        setTokens(fetched.tokens);
        setWalletTokens(fetched.tokens);
        setTotalBalance(fetched.totalValue);
      } catch (err) {
        console.error("Token fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
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
        <thead className=" text-neutral-500">
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
              Balance{" "}
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
              <tr
                key={token.id}
                className="hover:bg-neutral-800/50 cursor-pointer transition-all duration-200"
              >
                <td className="px-3 py-3 flex items-center space-x-3">
                  <img
                    src={`/SVG/${token.symbol.toLowerCase()}.svg`}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full bg-white object-contain"
                  />
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-xs text-neutral-400">{token.name}</p>
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  {formatCrypto(token.balance, token.symbol)}
                </td>
                <td className="px-3 py-3 text-right">
                  {formatCurrency(token.balance * token.price)}
                </td>
              </tr>
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
