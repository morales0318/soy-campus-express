import { useEffect, useState } from "react";
import { CheckCircle2, Package, Clock, ArrowLeft, Settings, Eye, EyeOff } from "lucide-react";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/orders";
import { getProducts, updateProductAvailability, Product } from "@/lib/products";
import { currency } from "@/utils/currency";
import { StoreButton } from "@/components/ui/store-button";
import { useToast } from "@/hooks/use-toast";

interface AdminViewProps {
  onBack: () => void;
}

export function AdminView({ onBack }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getAllOrders(),
          getProducts()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "delivered");
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: "delivered" as const } : order
      ));
      toast({
        title: "Order Updated",
        description: "Order marked as delivered",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleMarkPending = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "pending");
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: "pending" as const } : order
      ));
      toast({
        title: "Order Updated",
        description: "Order marked as pending",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (productId: string, currentAvailability: boolean) => {
    try {
      const newAvailability = !currentAvailability;
      await updateProductAvailability(productId, newAvailability);
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, available: newAvailability } : product
      ));
      toast({
        title: "Product Updated",
        description: `Product ${newAvailability ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product availability",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-brand-gradient">Admin Dashboard</h2>
            <p className="text-muted-foreground text-sm">Manage orders and product availability</p>
          </div>
        </div>
        <StoreButton variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Logout
        </StoreButton>
      </div>

      <div className="flex gap-4 mb-8">
        <StoreButton 
          variant={activeTab === "orders" ? "primary" : "outline"} 
          onClick={() => setActiveTab("orders")}
          icon={Package}
        >
          Orders Management
        </StoreButton>
        <StoreButton 
          variant={activeTab === "products" ? "primary" : "outline"} 
          onClick={() => setActiveTab("products")}
          icon={Settings}
        >
          Product Availability
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

      {activeTab === "orders" && (
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
                        <p className="font-semibold text-foreground">Order #{order.id.slice(0, 8)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered" 
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}>
                          {order.status === "delivered" ? "Delivered" : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(order.created_at).toLocaleString('en-PH', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Product:</span> {order.product_name}</p>
                        <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Product Availability</h3>
          <div className="grid gap-4">
            {products.map((product) => {
              // Map product names to emojis
              const emoji = {
                "Classic Soya": "🥛",
                "Mango Soya": "🥭", 
                "Choco Soya": "🍫",
                "Strawberry Soya": "🍓",
                "Ube Soya": "🍠",
                "Coffee Soya": "☕",
                "Banana Soya": "🍌"
              }[product.name] || "🥛";

              return (
                <div key={product.id} className="rounded-3xl border border-border bg-gradient-card shadow-card p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{currency.format(product.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${
                      product.available ? "text-green-600" : "text-red-600"
                    }`}>
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                    <StoreButton
                      variant={product.available ? "outline" : "primary"}
                      onClick={() => handleToggleAvailability(product.id, product.available)}
                      icon={product.available ? EyeOff : Eye}
                    >
                      {product.available ? "Make Unavailable" : "Make Available"}
                    </StoreButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}