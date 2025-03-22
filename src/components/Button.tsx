
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kyoto-gold rounded-sm hover-shine",
          {
            "bg-kyoto-dark-green text-kyoto-gold border border-kyoto-gold hover:bg-kyoto-dark-green/95": 
              variant === "primary",
            "bg-kyoto-gold text-kyoto-dark-green border border-kyoto-dark-green hover:bg-kyoto-gold/90": 
              variant === "secondary",
            "bg-transparent border border-kyoto-gold text-kyoto-gold hover:bg-kyoto-dark-green/10": 
              variant === "outline",
            "bg-transparent text-kyoto-gold hover:bg-kyoto-dark-green/10": 
              variant === "ghost",
            "text-sm px-3 py-1.5": size === "sm",
            "text-base px-5 py-2.5": size === "md",
            "text-lg px-8 py-3.5": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
