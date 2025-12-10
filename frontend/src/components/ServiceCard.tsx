import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  name: string;
  color: string;
  bgColor: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  name, 
  color, 
  bgColor,
  disabled = false,
  onClick
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${bgColor} hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
      <Icon className={`w-8 h-8 ${color} mb-2`} />
      <span className={`font-semibold ${color}`}>{name}</span>
    </button>
  );
};
