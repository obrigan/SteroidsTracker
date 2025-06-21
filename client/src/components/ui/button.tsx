import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target button-press",
  {
    variants: {
      variant: {
        default: "bg-medical-blue text-white hover:bg-medical-blue/90 shadow-lg hover:shadow-xl active:shadow-md",
        destructive: "bg-medical-red text-white hover:bg-medical-red/90 shadow-lg hover:shadow-xl active:shadow-md",
        outline: "border-2 border-card-elevated bg-transparent hover:bg-card-elevated text-white hover:text-white shadow-sm hover:shadow-md",
        secondary: "bg-card-elevated text-white hover:bg-card-highest shadow-sm hover:shadow-md",
        ghost: "hover:bg-card-elevated text-gray-300 hover:text-white",
        link: "text-medical-blue underline-offset-4 hover:underline hover:text-medical-blue/80",
        success: "bg-health-green text-white hover:bg-health-green/90 shadow-lg hover:shadow-xl active:shadow-md",
        warning: "bg-energy-orange text-white hover:bg-energy-orange/90 shadow-lg hover:shadow-xl active:shadow-md",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-12 w-12",
        fab: "h-14 w-14 rounded-full",
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
