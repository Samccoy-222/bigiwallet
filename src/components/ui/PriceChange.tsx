import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';
import { twMerge } from 'tailwind-merge';

interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceChange: React.FC<PriceChangeProps> = ({ 
  value, 
  showIcon = true, 
  iconOnly = false,
  size = 'md',
  className 
}) => {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-success' : 'text-error';
  
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };
  
  return (
    <div className={twMerge('flex items-center', color, sizeStyles[size], className)}>
      {showIcon && (
        isPositive ? (
          <ArrowUpCircle size={iconSizes[size]} className="mr-1" />
        ) : (
          <ArrowDownCircle size={iconSizes[size]} className="mr-1" />
        )
      )}
      {!iconOnly && (
        <span>{formatPercentage(value)}</span>
      )}
    </div>
  );
};

export default PriceChange;