import { LucideIcon } from "lucide-react";

interface TextInputProps {
  icon?: LucideIcon;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function TextInput({ 
  icon: Icon, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: TextInputProps) {
  return (
    <label className="block text-sm mb-4">
      <span className="text-foreground font-medium mb-2 block">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </span>
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-primary-light/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center rounded-2xl border border-border bg-background px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
          {Icon && <Icon className="mr-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />}
          <input
            className="w-full outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
          />
        </div>
      </div>
    </label>
  );
}