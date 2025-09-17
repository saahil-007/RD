import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:shadow-glow transform hover:scale-105",
        hero: "bg-gradient-sunset text-white shadow-heritage hover:shadow-glow transform hover:scale-105 border border-gold/20 font-playfair font-semibold",
        heritage: "bg-heritage text-heritage-foreground hover:bg-heritage/90 shadow-heritage hover:shadow-glow transform hover:scale-105",
        studio: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-mandala hover:shadow-glow transform hover:scale-105",
        gold: "bg-gold text-gold-foreground hover:bg-gold/90 shadow-elegant transform hover:scale-105 font-semibold",
        outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-primary hover:bg-primary/10 hover:border-primary/40 transform hover:scale-105",
        ghost: "text-foreground hover:bg-muted/50 hover:text-primary transform hover:scale-105",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elegant",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-heritage",
        link: "text-primary underline-offset-4 hover:underline decoration-gold/50 hover:decoration-gold",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg font-playfair",
        xl: "h-16 px-12 text-xl font-playfair font-semibold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
