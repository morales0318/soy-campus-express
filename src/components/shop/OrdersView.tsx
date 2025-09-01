import { useEffect, useState } from "react";
import { ClipboardList, ArrowLeft, Package } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { getUserOrders, Order } from "@/lib/orders";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";

interface OrdersViewProps {
  user: AuthUser;
  onBack: () => void;
}

export function OrdersView({ user, onBack }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      </div>
    );
  }
  
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
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-border bg-gradient-card shadow-card p-6 hover:shadow-glow transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(order.created_at).toLocaleString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">Product:</span> {order.product_name}</p>
                    <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered" 
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}>
                    {order.status === "delivered" ? "✅ Delivered" : "🕐 Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}