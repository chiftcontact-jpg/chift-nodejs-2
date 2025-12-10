import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color = 'text-primary-600' }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};
