import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:   'bg-[var(--accent)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--accent-strong)] active:translate-y-px disabled:opacity-50',
  secondary: 'bg-white text-[var(--text-main)] border border-[var(--border-soft)] shadow-[var(--shadow-soft)] hover:bg-gray-50 active:translate-y-px disabled:opacity-50',
  danger:    'bg-[#ef4444] text-white shadow-[var(--shadow-soft)] hover:bg-[#dc2626] active:translate-y-px disabled:opacity-50',
  ghost:     'text-[var(--text-muted)] hover:bg-gray-100 hover:text-[var(--text-main)] active:bg-gray-200 disabled:opacity-40',
  outline:   'border border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent-soft)] active:translate-y-px disabled:opacity-50',
};

const sizeClass: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-lg',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-sm gap-2 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
