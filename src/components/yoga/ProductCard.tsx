import { img } from "@/lib/images";

export type Product = {
  id: string; slug: string; name: string; brand?: string | null;
  price: number; mrp?: number | null; image?: string | null; is_ad?: boolean;
};

export default function ProductCard({ p }: { p: Product }) {
  const off = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <div className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={img(p.image, "ad-mat")} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {p.is_ad && <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest bg-background/90 backdrop-blur rounded px-1.5 py-0.5 text-muted-foreground border border-border">Ad · Sponsored</span>}
        {off > 0 && <span className="absolute top-2 right-2 text-[11px] bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-semibold">{off}% off</span>}
      </div>
      <div className="p-4">
        {p.brand && <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.brand}</div>}
        <div className="font-medium mt-1 line-clamp-1">{p.name}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold">₹{p.price.toLocaleString()}</span>
          {p.mrp && p.mrp > p.price && <span className="text-xs text-muted-foreground line-through">₹{p.mrp.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}