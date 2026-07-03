import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/90 grid place-items-center text-primary-foreground font-display">ॐ</div>
            <span className="font-display text-lg font-semibold">Yoga the Union</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            India's verified directory for yoga studios, instructors and retreats. Headquartered in Dehradun — the gateway to the Himalayas — and scaling across every Indian city.
          </p>
          <p className="text-xs text-muted-foreground mt-4">12 Rajpur Road, Dehradun 248001 · +91 98765 43210</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Discover</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/browse" className="hover:text-primary">All studios</Link></li>
            <li><Link to="/browse?city=Dehradun" className="hover:text-primary">Dehradun</Link></li>
            <li><Link to="/browse?city=Rishikesh" className="hover:text-primary">Rishikesh</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">For business</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vendors" className="hover:text-primary">List your studio</Link></li>
            <li><Link to="/vendors#pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link to="/login" className="hover:text-primary">Vendor login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Yoga the Union. All rights reserved.</div>
          <div>Made with intention in Dehradun 🌄</div>
        </div>
      </div>
    </footer>
  );
}