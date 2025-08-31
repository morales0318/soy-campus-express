import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { currency } from "@/utils/currency";
import { isProductAvailable } from "@/utils/storage";
import { StoreButton } from "@/components/ui/store-button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const available = isProductAvailable(product.id);
  
  const flavorClasses = {
    classic: "bg-flavor-classic border-slate-200",
    mango: "bg-flavor-mango border-orange-200",
    chocolate: "bg-flavor-chocolate border-amber-200",
    strawberry: "bg-flavor-strawberry border-pink-200",
    ube: "bg-flavor-ube border-purple-200",
    coffee: "bg-flavor-coffee border-stone-200",
    banana: "bg-flavor-banana border-yellow-200"
  };

  return (
    <div className={cn(
      "group rounded-3xl border-2 p-6 shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105 relative overflow-hidden",
      flavorClasses[product.flavorKey as keyof typeof flavorClasses],
      !available && "opacity-60 grayscale"
    )}> 
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300" aria-hidden>
            {product.emoji}
          </div>
          <span className="text-sm font-bold rounded-2xl bg-background/90 text-foreground px-3 py-2 border border-border shadow-soft">
            {currency.format(product.price)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-brand-gradient transition-colors">
          {product.name}
        </h3>
        
        {!available && (
          <p className="text-xs text-red-500 mb-3 font-medium">Currently unavailable</p>
        )}
        
        <StoreButton 
          onClick={() => onAdd(product)} 
          className="w-full group-hover:from-primary-glow group-hover:to-primary" 
          icon={ShoppingCart}
          variant="primary"
          disabled={!available}
        >
          {available ? 'Add to cart' : 'Out of Stock'}
        </StoreButton>
      </div>
    </div>
  );
}