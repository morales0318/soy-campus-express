import { ClipboardList, ArrowLeft, Package } from "lucide-react";
import { User } from "@/types";
import { getOrders } from "@/utils/storage";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";

interface OrdersViewProps {
  user: User;
  onBack: () => void;
}

export function OrdersView({ user, onBack }: OrdersViewProps) {
  const orders = getOrders(user.username);
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-brand-gradient">Order History</h2>
            <p className="text-muted-foreground text-sm">View your past soy milk orders</p>
          </div>
        </div>
        <StoreButton variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back to Shop
        </StoreButton>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gradient-card rounded-3xl border border-border shadow-soft">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Start shopping to see your order history here!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.slice().reverse().map((order, idx) => (
            <div key={idx} className="rounded-3xl border border-border bg-gradient-card shadow-card p-6 hover:shadow-glow transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(order.createdAt).toLocaleString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">Delivery:</span> {order.delivery.campus}</p>
                    <p><span className="font-medium">Contact:</span> {order.delivery.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-gradient">{currency.format(order.total)}</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    Pending
                  </span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-3">Items Ordered:</h4>
                <div className="grid gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-background/50">
                      <span className="text-sm text-foreground">
                        {item.name} × {item.qty}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {currency.format(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}