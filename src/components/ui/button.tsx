import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 aria-[pressed=true]:bg-primary/85',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 aria-[pressed=true]:bg-secondary/75',
        ghost:
          'hover:bg-secondary/60 hover:text-foreground active:bg-secondary aria-[pressed=true]:bg-secondary aria-[pressed=true]:text-foreground data-[state=on]:bg-secondary data-[state=on]:text-foreground',
        outline:
          'border border-border bg-transparent hover:bg-secondary/70 active:bg-secondary aria-[pressed=true]:bg-secondary aria-[pressed=true]:text-foreground data-[state=on]:bg-secondary data-[state=on]:text-foreground',
        accent:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 aria-[pressed=true]:bg-primary/85',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
