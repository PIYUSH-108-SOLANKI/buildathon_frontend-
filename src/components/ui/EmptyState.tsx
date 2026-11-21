import React from 'react';
import { cn } from '@/utils/cn';
import { ShieldAlert } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-[#E6DFD7] bg-[#FDFBF9]',
        className
      )}
      {...props}
    >
      <div className="p-3 rounded-full bg-white border border-[#EFE8E1] text-[#79716B] mb-3 shadow-soft-sm">
        {icon || <ShieldAlert className="w-5 h-5 text-[#F28C55]" />}
      </div>
      <h3 className="text-sm font-semibold text-[#292623] tracking-tight">{title}</h3>
      <p className="text-xs text-[#79716B] max-w-sm mt-1 leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
