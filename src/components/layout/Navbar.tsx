import { ShoppingCart, LogOut, UserCircle2, ClipboardList, Shield } from "lucide-react";
import { User } from "@/types";
import { StoreButton } from "@/components/ui/store-button";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  onShowOrders: () => void;
  onShowAdmin: () => void;
}

export function Navbar({ user, onLogout, cartCount, onCartClick, onShowOrders, onShowAdmin }: NavbarProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border shadow-soft">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥛</span>
            <div>
              <h1 className="text-2xl font-bold text-brand-gradient tracking-tight">Soy Fresh</h1>
              <p className="text-xs text-muted-foreground">Campus Soy Milk</p>
            </div>
          </div>
          <span className="ml-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">
            MVP
          </span>
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            {user.username !== 'TechnoAdmin' && (
              <>
                <StoreButton variant="ghost" onClick={onShowOrders} icon={ClipboardList}>
                  Orders
                </StoreButton>
                <StoreButton variant="secondary" onClick={onCartClick} icon={ShoppingCart}>
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs w-6 h-6 font-bold shadow-soft">
                      {cartCount}
                    </span>
                  )}
                </StoreButton>
              </>
            )}
            {user.username === 'TechnoAdmin' && (
              <StoreButton variant="ghost" onClick={onShowAdmin} icon={Shield}>
                Dashboard
              </StoreButton>
            )}
            <div className="flex items-center gap-3 pl-4 ml-3 border-l border-border">
              <UserCircle2 className="h-6 w-6 text-primary" />
              <span className="text-sm text-foreground font-medium">{user.username}</span>
            </div>
            <StoreButton variant="ghost" onClick={onLogout} icon={LogOut}>
              Logout
            </StoreButton>
          </div>
        )}
      </div>
    </div>
  );
}