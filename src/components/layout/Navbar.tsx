import { ShoppingCart, LogOut, UserCircle2, ClipboardList, Shield } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { StoreButton } from "@/components/ui/store-button";

interface NavbarProps {
  user: AuthUser | null;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  onShowOrders: () => void;
  onShowAdmin: () => void;
}

export function Navbar({ user, onLogout, cartCount, onCartClick, onShowOrders, onShowAdmin }: NavbarProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border shadow-soft">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🥛</span>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-brand-gradient tracking-tight">Soy Fresh</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Campus Soy Milk</p>
            </div>
          </div>
          <span className="ml-1 sm:ml-2 text-xs bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full font-medium border border-primary/20">
            MVP
          </span>
        </div>
        
        {user && (
          <div className="flex items-center gap-1 sm:gap-3">
            {!user.isAdmin && (
              <>
                <StoreButton 
                  variant="ghost" 
                  onClick={onShowOrders} 
                  icon={ClipboardList}
                  className="hidden sm:flex"
                >
                  Orders
                </StoreButton>
                
                {/* Mobile: Orders icon only */}
                <StoreButton 
                  variant="ghost" 
                  onClick={onShowOrders}
                  className="sm:hidden p-2"
                  iconOnly
                >
                  <ClipboardList className="h-5 w-5" />
                </StoreButton>
                
                <StoreButton 
                  variant="secondary" 
                  onClick={onCartClick} 
                  icon={ShoppingCart}
                  className="hidden sm:flex"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs w-6 h-6 font-bold shadow-soft">
                      {cartCount}
                    </span>
                  )}
                </StoreButton>
                
                {/* Mobile: Cart with badge */}
                <div className="relative sm:hidden">
                  <StoreButton 
                    variant="secondary" 
                    onClick={onCartClick}
                    className="p-2"
                    iconOnly
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </StoreButton>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
              </>
            )}
            
            {user.isAdmin && (
              <>
                <StoreButton 
                  variant="ghost" 
                  onClick={onShowAdmin} 
                  icon={Shield}
                  className="hidden sm:flex"
                >
                  Dashboard
                </StoreButton>
                <StoreButton 
                  variant="ghost" 
                  onClick={onShowAdmin}
                  className="sm:hidden p-2"
                  iconOnly
                >
                  <Shield className="h-5 w-5" />
                </StoreButton>
              </>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 ml-2 sm:ml-3 border-l border-border">
              <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-xs sm:text-sm text-foreground font-medium hidden sm:block">{user.username}</span>
            </div>
            
            <StoreButton 
              variant="ghost" 
              onClick={onLogout} 
              icon={LogOut}
              className="hidden sm:flex"
            >
              Logout
            </StoreButton>
            
            {/* Mobile: Logout icon only */}
            <StoreButton 
              variant="ghost" 
              onClick={onLogout}
              className="sm:hidden p-2"
              iconOnly
            >
              <LogOut className="h-5 w-5" />
            </StoreButton>
          </div>
        )}
      </div>
    </div>
  );
}