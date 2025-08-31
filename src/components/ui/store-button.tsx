import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "hero" | "success" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function StoreButton({ 
  children, 
  onClick, 
  icon: Icon, 
  variant = "primary", 
  type = "button", 
  disabled = false,
  className,
  iconOnly = false
}: StoreButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow hover:from-primary-light hover:to-primary-glow transform hover:scale-105 active:scale-95",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:shadow-soft active:scale-95",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-soft active:scale-95",
    hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-card hover:shadow-glow hover:from-primary-glow hover:to-primary transform hover:scale-105 active:scale-95",
    success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-soft active:scale-95",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-soft active:scale-95"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={cn(
        "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation min-h-[44px]",
        iconOnly ? "gap-0 p-2" : "gap-3 px-6 py-3",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className={iconOnly ? "h-5 w-5" : "h-5 w-5"} />} 
      {!iconOnly && children}
    </button>
  );
}