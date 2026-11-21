import React from 'react';
import { cn } from '@/utils/cn';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  delta?: string;
  positiveIsGood?: boolean;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  unit,
  trend,
  delta,
  positiveIsGood = true,
  className,
  ...props
}) => {
  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-[#79716B]';
    if (trend === 'up') {
      return positiveIsGood ? 'text-[#047857]' : 'text-[#BE123C]';
    }
    return positiveIsGood ? 'text-[#BE123C]' : 'text-[#047857]';
  };

  return (
    <div
      className={cn(
        'p-3.5 rounded-xl bg-white border border-[#EFE8E1] shadow-soft-sm flex flex-col justify-between',
        className
      )}
      {...props}
    >
      <span className="text-xs font-medium text-[#79716B] tracking-wide select-none">
        {label}
      </span>
      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold font-mono tracking-tight text-[#292623] font-mono-tabular">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-[#79716B]">{unit}</span>}
        </div>
        {delta && (
          <div
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-mono font-medium',
              getTrendColor()
            )}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>
    </div>
  );
};
