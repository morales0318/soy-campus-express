import { useEffect, useState } from "react";
import { MapPin, Phone, Facebook } from "lucide-react";
import { User, CartItem, Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { getAuthedUser, findUser, logout, saveOrder } from "@/utils/storage";
import { currency } from "@/utils/currency";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthView } from "@/components/auth/AuthView";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartSheet } from "@/components/shop/CartSheet";
import { OrdersView } from "@/components/shop/OrdersView";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<"shop" | "orders">("shop");
  const [banner, setBanner] = useState("");

  useEffect(() => {
    const authed = getAuthedUser();
    if (authed) {
      const u = findUser(authed);
      if (u) setUser(u);
    }
  }, []);

  function handleAddToCart(product: Product) {
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

  function handleRemoveFromCart(id: number) { 
    setCart((prev) => prev.filter((p) => p.id !== id)); 
  }

  function handleQtyChange(id: number, qty: number) {
    if (!qty || qty < 1) qty = 1;
    setCart((prev) => prev.map((p) => 
      p.id === id ? { ...p, qty } : p
    ));
  }

  function handleLogout() { 
    logout(); 
    setUser(null); 
    setCart([]); 
    setView("shop"); 
  }

  function handleCheckout() {
    if (!user) return;
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const order = {
      items: cart,
      total,
      createdAt: new Date().toISOString(),
      delivery: { 
        campus: user.campus, 
        contact: user.contact, 
        facebook: user.facebook, 
        username: user.username 
      },
      status: "pending",
    };
    saveOrder(user.username, order);
    setCart([]);
    setCartOpen(false);
    setBanner("Order placed successfully! 🎉 Check your orders to track delivery.");
    setTimeout(() => setBanner(""), 3000);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar user={null} onLogout={handleLogout} cartCount={0} onCartClick={() => {}} onShowOrders={() => {}} />
        <AuthView onAuthed={(u) => setUser(u)} />
        <Footer />
      </div>
    );
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
      />

      {banner && (
        <div className="mx-auto max-w-5xl px-4 pt-6">
          <div className="rounded-2xl bg-primary/10 text-primary border border-primary/20 px-6 py-4 text-sm font-medium shadow-soft animate-in slide-in-from-top-2 duration-300">
            {banner}
          </div>
        </div>
      )}

      {view === "shop" && (
        <main className="mx-auto max-w-5xl px-4 py-8">
          <header className="mb-10 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold text-brand-gradient mb-3 tracking-tight">
                Choose Your Flavor
              </h2>
              <p className="text-muted-foreground text-lg mb-4">
                Classic soy milk for {currency.format(20)}. Premium flavors for {currency.format(25)}.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{user.campus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{user.contact}</span>
                </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={handleAddToCart} 
              />
            ))}
          </div>
        </main>
      )}

      {view === "orders" && (
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
