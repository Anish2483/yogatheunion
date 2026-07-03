import { Link } from "react-router-dom";
import { img } from "@/lib/images";
import { MapPin, Star, BadgeCheck } from "lucide-react";

export type Listing = {
  id: string; slug: string; name: string; tagline?: string | null;
  city: string; state: string;
  yoga_styles: string[]; cover_image?: string | null;
  price_min?: number | null; price_max?: number | null;
  rating_avg: number; rating_count: number;
  tier: string; verified: boolean; featured?: boolean;
};

const tierBadge: Record<string, string> = {
  platinum: "bg-deep-teal text-primary-foreground",
  gold: "bg-amber-500 text-white",
  silver: "bg-slate-300 text-slate-900",
  free: "bg-muted text-muted-foreground",
};

export default function ListingCard({ l }: { l: Listing }) {
  return (
    <Link to={`/studio/${l.slug}`} className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={img(l.cover_image)} alt={l.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {l.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2 py-1 text-[11px] font-medium">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified
            </span>
          )}
          {l.tier !== "free" && (
            <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${l.tier === "platinum" ? "bg-foreground text-background" : l.tier === "gold" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-800"}`}>
              {l.tier}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{l.name}</h3>
          <div className="flex items-center gap-1 shrink-0 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{Number(l.rating_avg).toFixed(1)}</span>
            <span className="text-muted-foreground">({l.rating_count})</span>
          </div>
        </div>
        {l.tagline && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{l.tagline}</p>}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <MapPin className="h-3.5 w-3.5" /> {l.city}, {l.state}
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {l.yoga_styles.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{s}</span>
          ))}
        </div>
        {(l.price_min || l.price_max) && (
          <div className="mt-3 text-sm">
            <span className="font-semibold">₹{l.price_min}</span>
            {l.price_max && l.price_max !== l.price_min && <span className="text-muted-foreground"> – ₹{l.price_max}</span>}
            <span className="text-xs text-muted-foreground"> / class</span>
          </div>
        )}
      </div>
    </Link>
  );
}