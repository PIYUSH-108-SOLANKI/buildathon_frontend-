import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl border transition-all duration-150';

    const variants = {
      default: 'bg-white border-[#EFE8E1] text-[#292623] shadow-soft-sm',
      interactive:
        'bg-white border-[#EFE8E1] text-[#292623] shadow-soft-sm hover:bg-[#FFF9F5] hover:border-[#F9DDCA] hover:shadow-soft-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C55]/50',
      elevated:
        'bg-white border-[#EFE8E1] text-[#292623] shadow-soft-lg',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
