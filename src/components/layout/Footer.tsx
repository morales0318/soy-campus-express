export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-10">
      <div className="mt-12 rounded-3xl border border-border bg-gradient-card shadow-soft p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🥛</span>
          <span className="font-bold text-brand-gradient">Soy Fresh</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Demo only • No real payments • Data is stored locally in your browser.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Soy Fresh Campus Delivery
        </p>
      </div>
    </footer>
  );
}