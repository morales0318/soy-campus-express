import { useState } from "react";
import { Trash2, CheckCircle2, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  onCheckout: (deliveryOption: 'pickup' | 'delivery') => void;
}

export function CartSheet({ items, onClose, onRemove, onQtyChange, onCheckout }: CartSheetProps) {
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  
  // All products are now 25, delivery adds 5
  const basePrice = 25;
  const deliveryFee = deliveryOption === 'delivery' ? 5 : 0;
  const pricePerItem = basePrice + deliveryFee;
  const total = items.reduce((sum, item) => sum + pricePerItem * item.qty, 0);
  
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
                    <p className="text-sm text-muted-foreground">{currency.format(pricePerItem)} each</p>
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
                    {currency.format(pricePerItem * item.qty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with delivery options */}
        {items.length > 0 && (
          <div className="border-t border-border bg-gradient-card p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Delivery Option</h3>
              <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as 'pickup' | 'delivery')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Pickup - {currency.format(basePrice)} per item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery - {currency.format(basePrice + 5)} per item (+{currency.format(5)} delivery fee)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{currency.format(items.reduce((sum, item) => sum + basePrice * item.qty, 0))}</span>
              </div>
              {deliveryOption === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span>Delivery fee:</span>
                  <span>{currency.format(deliveryFee * items.reduce((sum, item) => sum + item.qty, 0))}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-brand-gradient text-xl">{currency.format(total)}</span>
              </div>
            </div>
            
            <StoreButton 
              onClick={() => onCheckout(deliveryOption)} 
              icon={CheckCircle2}
              variant="hero"
              className="w-full"
            >
              {deliveryOption === 'pickup' ? 'Place Order for Pickup' : 'Place Order for Delivery'}
            </StoreButton>
          </div>
        )}
      </div>
    </div>
  );
}