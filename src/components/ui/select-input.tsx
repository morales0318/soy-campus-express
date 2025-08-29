interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectInput({ label, value, onChange, options }: SelectInputProps) {
  return (
    <label className="block text-sm mb-4">
      <span className="text-foreground font-medium mb-2 block">{label}</span>
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-primary-light/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <select
          className="relative w-full rounded-2xl border border-border bg-background px-4 py-3 shadow-soft focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-foreground"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </label>
  );
}