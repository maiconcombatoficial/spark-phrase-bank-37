import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] shadow-md hover:shadow-lg",
        outline:
          "border border-input bg-background/50 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-md transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:scale-[1.02] transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        hero: "bg-gradient-hero text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-500 font-semibold shadow-lg",
        accent: "bg-gradient-accent text-accent-foreground hover:scale-105 transition-all duration-300 shadow-accent font-medium",
        glass: "glass hover:bg-card/90 hover:scale-[1.02] hover:shadow-lg transition-all duration-300",
        floating: "bg-card hover:bg-card/90 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
