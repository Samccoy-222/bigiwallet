import React, { createContext, useContext, useState, ReactNode } from "react";
import { TimeFrame } from "../types/wallet";

interface PriceChartContextType {
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

  return (
    <PriceChartContext.Provider
      value={{
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
