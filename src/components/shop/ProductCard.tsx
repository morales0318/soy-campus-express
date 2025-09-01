import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/products";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";
import { cn } from "@/lib/utils";

// Map product names to emojis
const productEmojis: Record<string, string> = {
  "Classic Soya": "🥛",
  "Mango Soya": "🥭", 
  "Choco Soya": "🍫",
  "Strawberry Soya": "🍓",
  "Ube Soya": "🍠",
  "Coffee Soya": "☕",
  "Banana Soya": "🍌"
};

// Map product names to flavor classes
const flavorClasses: Record<string, string> = {
  "Classic Soya": "bg-flavor-classic border-slate-200",
  "Mango Soya": "bg-flavor-mango border-orange-200",
  "Choco Soya": "bg-flavor-chocolate border-amber-200",
  "Strawberry Soya": "bg-flavor-strawberry border-pink-200",
  "Ube Soya": "bg-flavor-ube border-purple-200",
  "Coffee Soya": "bg-flavor-coffee border-stone-200",
  "Banana Soya": "bg-flavor-banana border-yellow-200"
};

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const emoji = productEmojis[product.name] || "🥛";
  const flavorClass = flavorClasses[product.name] || "bg-flavor-classic border-slate-200";

  return (
    <div className={cn(
      "group rounded-3xl border-2 p-4 sm:p-6 shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden touch-manipulation",
      flavorClass,
      !product.available && "opacity-60 grayscale"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300" aria-hidden>
            {emoji}
          </div>
          <span className="text-xs sm:text-sm font-bold rounded-2xl bg-background/90 text-foreground px-2 sm:px-3 py-1 sm:py-2 border border-border shadow-soft">
            {currency.format(product.price)}
          </span>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 group-hover:text-brand-gradient transition-colors">
          {product.name}
        </h3>
        
        {!product.available && (
          <p className="text-xs text-red-500 mb-3 font-medium">Currently unavailable</p>
        )}
        
        <StoreButton 
          onClick={() => onAdd(product)} 
          className="w-full group-hover:from-primary-glow group-hover:to-primary text-sm sm:text-base" 
          icon={ShoppingCart}
          variant="primary"
          disabled={!product.available}
        >
          {product.available ? 'Add to cart' : 'Out of Stock'}
        </StoreButton>
      </div>
    </div>
  );
}