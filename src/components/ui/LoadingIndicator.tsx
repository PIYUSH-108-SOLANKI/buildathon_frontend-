import React from 'react';
import { cn } from '@/utils/cn';

export interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  variant = 'spinner',
  size = 'md',
  className,
  ...props
}) => {
  if (variant === 'skeleton') {
    return (
      <div
        className={cn(
          'w-full h-8 rounded-lg bg-[#F6F4F0] animate-pulse border border-[#EFE8E1]',
          className
        )}
        role="status"
        aria-label="Loading..."
        {...props}
      />
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn('inline-flex items-center gap-1.5', className)}
        role="status"
        aria-label="Processing..."
        {...props}
      >
        <span className="w-2 h-2 rounded-full bg-[#F28C55] animate-ping" />
        <span className="text-xs font-mono text-[#F28C55] font-medium">Streaming telemetry...</span>
      </div>
    );
  }

  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-[#EFE8E1] border-t-[#F28C55] animate-spin',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
