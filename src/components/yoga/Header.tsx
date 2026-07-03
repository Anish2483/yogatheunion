import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/browse", label: "Find Yoga" },
  { to: "/shop", label: "Shop" },
  { to: "/vendors", label: "List Your Studio" },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const nav2 = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full bg-primary/90 grid place-items-center text-primary-foreground font-display text-lg font-semibold">ॐ</div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold tracking-tight">Yoga the Union</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Dehradun · India</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn("px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors",
                  isActive && "text-primary")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav2("/dashboard")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav2("/login")}>Sign in</Button>
              <Button size="sm" onClick={() => nav2("/vendors")}>List your studio</Button>
            </>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">{n.label}</NavLink>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="py-2 text-sm">Dashboard</Link>
                <button onClick={() => signOut()} className="py-2 text-sm text-left">Sign out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}