import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant = 'healthy' | 'degraded' | 'critical' | 'recovering' | 'ai' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = true,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    healthy: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    degraded: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    critical: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
    recovering: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
    ai: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
    neutral: 'bg-[#F6F4F0] text-[#57534E] border-[#EFE8E1]',
  };

  const dotColors = {
    healthy: 'bg-[#10B981]',
    degraded: 'bg-[#F59E0B]',
    critical: 'bg-[#E11D48]',
    recovering: 'bg-[#F28C55]',
    ai: 'bg-[#8B5CF6]',
    neutral: 'bg-[#A8A29E]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded-full border tracking-wide select-none shadow-soft-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
