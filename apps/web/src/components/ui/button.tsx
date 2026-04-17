import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 px-4 py-3 text-white hover:bg-blue-700',
        secondary: 'border border-slate-300 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50',
        ghost: 'px-3 py-2 text-slate-700 hover:bg-slate-100',
        destructive: 'border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 hover:bg-rose-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export { buttonVariants };
