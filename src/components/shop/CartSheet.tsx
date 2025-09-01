import { useMemo } from "react";
import { Trash2, CheckCircle2, X } from "lucide-react";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartSheetProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export function CartSheet({ items, onClose, onRemove, onQtyChange, onCheckout }: CartSheetProps) {
  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-card">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h3 className="text-xl font-bold text-brand-gradient">Your Cart</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-accent transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl opacity-50 block mb-4">🛒</span>
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add some delicious soy milk!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-gradient-card p-4 shadow-soft">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{currency.format(item.price)} each</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-muted-foreground">Qty:</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={item.qty} 
                      onChange={(e) => onQtyChange(item.id, parseInt(e.target.value || "1", 10))} 
                      className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-center text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <p className="font-bold text-primary">
                    {currency.format(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-gradient-card p-6 space-y-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-brand-gradient text-xl">{currency.format(total)}</span>
          </div>
          <StoreButton 
            onClick={onCheckout} 
            icon={CheckCircle2} 
            disabled={items.length === 0}
            variant="hero"
            className="w-full"
          >
            Checkout Order
          </StoreButton>
        </div>
      </div>
    </div>
  );
}