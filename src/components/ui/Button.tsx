import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C55]/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] motion-reduce:active:scale-100 shadow-soft-sm';

    const variants = {
      primary:
        'bg-[#F28C55] text-white hover:bg-[#E57B42] font-semibold border border-[#E57B42]/40',
      secondary:
        'bg-white text-[#292623] border border-[#EFE8E1] hover:bg-[#F6F4F0] hover:border-[#E6DFD7]',
      ghost:
        'bg-transparent text-[#79716B] hover:text-[#292623] hover:bg-[#F6F4F0] shadow-none',
      danger:
        'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] hover:bg-[#FFE4E6]',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1 gap-1.5 h-7',
      md: 'text-xs px-3.5 py-1.5 gap-2 h-8',
      lg: 'text-sm px-4 py-2 gap-2.5 h-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
