import React, { createContext, useContext, useState, ReactNode } from "react";
import { TimeFrame } from "../types/wallet";

interface PriceChartContextType {
  totalBalance: number;
  setTotalBalance: (totalBalance: number) => void;
  selectedTimeFrame: TimeFrame;
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void;
}

const PriceChartContext = createContext<PriceChartContextType | undefined>(
  undefined
);

export const PriceChartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("24h");
  const [totalBalance, setTotalBalance] = useState<number>(0);

  return (
    <PriceChartContext.Provider
      value={{
        totalBalance,
        setTotalBalance,
        selectedTimeFrame,
        setSelectedTimeFrame,
      }}
    >
      {children}
    </PriceChartContext.Provider>
  );
};

export const usePriceChart = () => {
  const context = useContext(PriceChartContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
