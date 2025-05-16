import React from "react";
import { TimeFrame } from "../../types/wallet";
import { usePriceChart } from "../../context/PriceChartContext";

const timeFrames: TimeFrame[] = ["24h", "7d", "1m", "3m", "1y"];

const TimeFrameSelector: React.FC = () => {
  const { selectedTimeFrame, setSelectedTimeFrame } = usePriceChart();

  return (
    <div className="flex items-center space-x-2 overflow-x-auto">
      {timeFrames.map((timeFrame) => (
        <button
          key={timeFrame}
          className={`px-3 py-1 rounded-md transition-all duration-200 ${
            selectedTimeFrame === timeFrame
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTimeFrame(timeFrame)}
        >
          {timeFrame}
        </button>
      ))}
    </div>
  );
};

export default TimeFrameSelector;
