import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Facebook } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, signOut, AuthUser } from "@/lib/auth";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, Order, OrderItem } from "@/lib/orders";
import { getProducts, Product } from "@/lib/products";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { currency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartSheet } from "@/components/shop/CartSheet";
import { OrdersView } from "@/components/shop/OrdersView";
import { AdminView } from "@/components/admin/AdminView";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<"shop" | "orders" | "admin">("shop");
  const [banner, setBanner] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        if (session?.user) {
          try {
            const authUser = await getCurrentUser();
            setUser(authUser);
          } catch (error) {
            console.error('Error getting user:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Existing session:', session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        if (session?.user) {
          const authUser = await getCurrentUser();
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const productList = await getProducts();
      setProducts(productList);
    };
    loadProducts();
  }, []);

  function handleAddToCart(product: Product) {
    if (!product.available) {
      setBanner("Sorry, this product is currently unavailable.");
      setTimeout(() => setBanner(""), 2000);
      return;
    }
    
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => 
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        qty: 1 
      }];
    });
    setBanner(`${product.name} added to cart! 🎉`);
    setTimeout(() => setBanner(""), 2000);
  }

  function handleRemoveFromCart(id: string) { 
    setCart((prev) => prev.filter((p) => p.id !== id)); 
  }

  function handleQtyChange(id: string, qty: number) {
    if (!qty || qty < 1) qty = 1;
    setCart((prev) => prev.map((p) => 
      p.id === id ? { ...p, qty } : p
    ));
  }

  async function handleLogout() { 
    await signOut();
    setUser(null); 
    setCart([]); 
    setView("shop");
    navigate('/auth');
  }

  async function handleCheckout(deliveryOption: 'pickup' | 'delivery') {
    if (!user) return;
    
    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.qty,
        price: 25 // All products are now 25
      }));

      await createOrder(orderItems, deliveryOption);
      setCart([]);
      setCartOpen(false);
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order for ${deliveryOption} has been placed. Check your orders to track status.`,
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle redirect to auth page
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth...');
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render main content if no user
  if (!user) {
    return null;
  }

  if (!user) {
    return null; // Auth redirect will handle this
  }

  // Allow admin access for email admin or admin login session
  const canAccessAdmin = user?.isAdmin || isAdminLoggedIn();
  
  // Redirect non-admin users away from admin view
  if (view === "admin" && !canAccessAdmin) {
    setView("shop");
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onShowOrders={() => setView("orders")}
        onShowAdmin={() => setView("admin")}
        onAdminLogin={() => setView("admin")}
      />
      
      <AnnouncementBanner />

      {banner && (
        <div className="mx-auto max-w-5xl px-3 sm:px-4 pt-4 sm:pt-6">
          <div className="rounded-2xl bg-primary/10 text-primary border border-primary/20 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium shadow-soft animate-in slide-in-from-top-2 duration-300">
            {banner}
          </div>
        </div>
      )}

      {view === "shop" && !user.isAdmin && (
        <main className="mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-8">
          <header className="mb-8 sm:mb-10 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-gradient mb-3 tracking-tight">
                Choose Your Flavor
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-4">
                Classic soy milk for {currency.format(20)}. Premium flavors for {currency.format(25)}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-sm text-muted-foreground">
                 {user.campus && (
                   <div className="flex items-center gap-2">
                     <MapPin className="h-4 w-4 text-primary" />
                     <span>{user.campus}</span>
                   </div>
                 )}
                 {user.contact && (
                   <div className="flex items-center gap-2">
                     <Phone className="h-4 w-4 text-primary" />
                     <span>{user.contact}</span>
                   </div>
                 )}
                 {user.facebook && (
                   <div className="flex items-center gap-2">
                     <Facebook className="h-4 w-4 text-primary" />
                     <a 
                       className="underline hover:text-primary transition-colors" 
                       href={user.facebook} 
                       target="_blank" 
                       rel="noreferrer"
                     >
                       Facebook
                     </a>
                   </div>
                 )}
              </div>
            </div>
          </header>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
             {products.map((product) => (
               <ProductCard 
                 key={product.id} 
                 product={product} 
                 onAdd={handleAddToCart} 
               />
             ))}
           </div>
        </main>
      )}

       {view === "admin" && canAccessAdmin && (
         <AdminView onBack={() => setView("shop")} />
       )}

       {view === "orders" && !user.isAdmin && (
         <OrdersView user={user} onBack={() => setView("shop")} />
       )}

      <Footer />

      {cartOpen && (
        <CartSheet
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onQtyChange={handleQtyChange}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default Index;
