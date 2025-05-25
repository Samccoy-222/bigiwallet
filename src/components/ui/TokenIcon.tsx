import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface TokenIconProps {
  symbol: string;
  logo?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  logo,
  size = "md",
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(`/SVG/${symbol.toLowerCase()}.svg`);

  useEffect(() => {
    setImgSrc(`/SVG/${symbol.toLowerCase()}.svg`);
  }, [symbol, logo]);

  const handleError = () => {
    if (logo) setImgSrc(logo);
  };

  const sizeStyles = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  return (
    <img
      src={imgSrc}
      alt={`${symbol} icon`}
      onError={handleError}
      className={twMerge("rounded-full", sizeStyles[size], className)}
    />
  );
};

export default TokenIcon;
