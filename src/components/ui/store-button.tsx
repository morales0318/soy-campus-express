import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "hero";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export function StoreButton({ 
  children, 
  onClick, 
  icon: Icon, 
  variant = "primary", 
  type = "button", 
  disabled = false,
  className 
}: StoreButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow hover:from-primary-light hover:to-primary-glow transform hover:scale-105",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:shadow-soft",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-soft",
    hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-card hover:shadow-glow hover:from-primary-glow hover:to-primary transform hover:scale-105"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />} 
      {children}
    </button>
  );
}