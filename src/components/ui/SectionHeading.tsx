import React from 'react';
import { cn } from '@/utils/cn';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * SectionHeading adhering to Impeccable principles:
 * - NO eyebrow / kicker labels above headings (strictly banned).
 * - Clear font hierarchy and generous whitespace.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  actions,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 mb-3 select-none', className)}
      {...props}
    >
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-[#292623]">{title}</h2>
        {description && (
          <p className="text-xs text-[#79716B] mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
