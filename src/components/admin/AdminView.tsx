import { CheckCircle2, Package, Clock, ArrowLeft } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/utils/storage";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";

interface AdminViewProps {
  onBack: () => void;
}

export function AdminView({ onBack }: AdminViewProps) {
  const orders = getAllOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "delivered");
    window.location.reload(); // Simple refresh to update the view
  };

  const handleMarkPending = (orderId: string) => {
    updateOrderStatus(orderId, "pending");
    window.location.reload(); // Simple refresh to update the view
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-brand-gradient">Admin Dashboard</h2>
            <p className="text-muted-foreground text-sm">Manage daily orders and deliveries</p>
          </div>
        </div>
        <StoreButton variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back to Shop
        </StoreButton>
      </div>
      
      <div className="grid gap-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-border bg-gradient-card shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayOrders.length}</p>
                <p className="text-sm text-muted-foreground">Today's Orders</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-card shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {todayOrders.filter(o => o.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-card shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {todayOrders.filter(o => o.status === "delivered").length}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Today's Orders</h3>
        {todayOrders.length === 0 ? (
          <div className="text-center py-16 bg-gradient-card rounded-3xl border border-border shadow-soft">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No orders today</h3>
            <p className="text-muted-foreground">Check back when customers start ordering!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {todayOrders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-border bg-gradient-card shadow-card p-6 hover:shadow-glow transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-foreground">@{order.username}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered" 
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}>
                        {order.status === "delivered" ? "Delivered" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(order.createdAt).toLocaleString('en-PH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Delivery:</span> {order.delivery.campus}</p>
                      <p><span className="font-medium">Contact:</span> {order.delivery.contact}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-gradient mb-3">{currency.format(order.total)}</p>
                    {order.status === "pending" ? (
                      <StoreButton 
                        variant="success" 
                        onClick={() => handleMarkDelivered(order.id)}
                        icon={CheckCircle2}
                      >
                        Mark Delivered
                      </StoreButton>
                    ) : (
                      <StoreButton 
                        variant="outline" 
                        onClick={() => handleMarkPending(order.id)}
                        icon={Clock}
                      >
                        Mark Pending
                      </StoreButton>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-3">Items Ordered:</h4>
                  <div className="grid gap-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-xl bg-background/50">
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
    </div>
  );
}