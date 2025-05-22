import React from "react";
import { twMerge } from "tailwind-merge";

interface TokenIconProps {
  symbol: string;
  logo?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  size = "md",
  className,
}) => {
  const sizeStyles = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };
  return (
    <img
      src={`/SVG/${symbol.toLowerCase()}.svg`}
      alt={`${symbol} icon`}
      className={twMerge("rounded-full", sizeStyles[size], className)}
    />
  );
};

export default TokenIcon;
