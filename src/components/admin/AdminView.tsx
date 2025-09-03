import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, Users, ShoppingCart, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProducts, Product } from "@/lib/products";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/orders";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementManager } from "./AnnouncementManager";

interface AdminViewProps {
  onBack: () => void;
}

export function AdminView({ onBack }: AdminViewProps) {
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

  const handleProductToggle = async (productId: string, available: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ available })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, available } : product
      ));
      toast({
        title: "Product Updated",
        description: `Product ${available ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleOrderStatusToggle = async (orderId: string, status: 'pending' | 'delivered') => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast({
        title: "Order Updated",
        description: `Order marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-brand-gradient">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">₱{product.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.available ? "default" : "secondary"}>
                          {product.available ? "Available" : "Unavailable"}
                        </Badge>
                        <Switch
                          checked={product.available}
                          onCheckedChange={(checked) => handleProductToggle(product.id, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{order.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {order.quantity} | {order.delivery_option} | ₱{order.total_amount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === 'pending' ? "destructive" : "default"}>
                          {order.status}
                        </Badge>
                        <Switch
                          checked={order.status === 'delivered'}
                          onCheckedChange={(checked) => handleOrderStatusToggle(order.id, checked ? 'delivered' : 'pending')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}