import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TokenIconProps {
  symbol: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ 
  symbol, 
  logo, 
  size = 'md',
  className 
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  // If no logo is provided, create a fallback with the first letter of the symbol
  if (!logo) {
    const colors = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-blue-500',
      'ADA': 'bg-blue-700',
      'SOL': 'bg-purple-500',
      'DOT': 'bg-pink-500',
      'default': 'bg-gray-500',
    };

    const bgColor = colors[symbol as keyof typeof colors] || colors.default;

    return (
      <div className={twMerge(
        'rounded-full flex items-center justify-center text-white font-bold',
        sizeStyles[size],
        bgColor,
        className
      )}>
        {symbol.charAt(0)}
      </div>
    );
  }

  return (
    <img 
      src={logo} 
      alt={`${symbol} icon`}
      className={twMerge('rounded-full', sizeStyles[size], className)} 
    />
  );
};

export default TokenIcon;