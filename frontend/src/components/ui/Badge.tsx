import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'danger' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const cls: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  info:    'bg-blue-100 text-blue-700',
  danger:  'bg-red-100 text-red-600',
  purple:  'bg-indigo-100 text-indigo-700',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      cls[variant], className,
    )}>
      {children}
    </span>
  );
}
