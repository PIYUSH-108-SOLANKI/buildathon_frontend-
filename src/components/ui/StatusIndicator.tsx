import React from 'react';
import { cn } from '@/utils/cn';

export type SystemStatus = 'healthy' | 'degraded' | 'critical' | 'recovering' | 'ai';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: SystemStatus;
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = true,
  className,
  ...props
}) => {
  const statusConfig = {
    healthy: {
      color: 'bg-[#10B981]',
      ping: 'bg-[#10B981]/30',
      text: 'text-[#047857]',
      defaultLabel: 'Operational',
    },
    degraded: {
      color: 'bg-[#F59E0B]',
      ping: 'bg-[#F59E0B]/30',
      text: 'text-[#B45309]',
      defaultLabel: 'Degraded',
    },
    critical: {
      color: 'bg-[#E11D48]',
      ping: 'bg-[#E11D48]/30',
      text: 'text-[#BE123C]',
      defaultLabel: 'Critical Alert',
    },
    recovering: {
      color: 'bg-[#F28C55]',
      ping: 'bg-[#F28C55]/30',
      text: 'text-[#C2410C]',
      defaultLabel: 'Remediating',
    },
    ai: {
      color: 'bg-[#8B5CF6]',
      ping: 'bg-[#8B5CF6]/30',
      text: 'text-[#6D28D9]',
      defaultLabel: 'AI Reasoning',
    },
  };

  const current = statusConfig[status];

  return (
    <div
      role="status"
      aria-label={`System status: ${label || current.defaultLabel}`}
      className={cn('inline-flex items-center gap-2 select-none', className)}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 motion-reduce:hidden',
              current.ping
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.color)} />
      </span>
      <span className={cn('text-xs font-mono font-medium tracking-wide', current.text)}>
        {label || current.defaultLabel}
      </span>
    </div>
  );
};
