import React, { ButtonHTMLAttributes } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  primary = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-200 ${
        primary
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-800 hover:bg-gray-700 text-white'
      } ${className}`}
      {...props}
    >
      <Icon size={18} className="mr-2" />
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;