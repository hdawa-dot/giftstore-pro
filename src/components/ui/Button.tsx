import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'gray';
  className?: string;
}
export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    gold:  'bg-gold-500/20 text-gold-400 border-gold-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    red:   'bg-red-500/20  text-red-400  border-red-500/30',
    gray:  'bg-dark-700    text-dark-300 border-dark-600',
  };
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border', variants[variant], className)}>
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'gold', size = 'md', loading, className, disabled, ...props }, ref) => {
    const variants = {
      gold:    'bg-gold-gradient text-dark-900 font-bold hover:shadow-gold hover:scale-[1.02] active:scale-[0.98]',
      outline: 'border border-gold-500 text-gold-400 hover:bg-gold-500/10',
      ghost:   'text-dark-300 hover:text-white hover:bg-dark-700',
      danger:  'bg-red-600 text-white hover:bg-red-700',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium',
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
