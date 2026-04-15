import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-white px-3.5 text-sm text-[var(--text-main)] shadow-[var(--shadow-soft)] placeholder:text-[var(--text-faint)] transition-all duration-150 outline-none',
        'border-[var(--border-soft)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(99,102,241,0.12)]',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
        error && 'border-[#c56555] focus:border-[#c56555] focus:ring-[rgba(185,77,63,0.14)]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
