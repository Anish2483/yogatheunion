import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/yoga/PageShell";
import SearchBar from "@/components/yoga/SearchBar";
import ListingCard, { Listing } from "@/components/yoga/ListingCard";
import { Loader2 } from "lucide-react";

const ALL_STYLES = ["Hatha", "Ashtanga", "Vinyasa", "Iyengar", "Kundalini", "Yin", "Pranayama", "Aerial", "Prenatal", "Power Yoga", "Hot Yoga", "Meditation", "Sound Healing", "Therapeutic", "Restorative"];

export default function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const city = params.get("city") ?? "";
  const style = params.get("style") ?? "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("listings").select("*").eq("status", "approved").order("featured", { ascending: false }).order("tier", { ascending: false }).order("rating_avg", { ascending: false });
    if (city) query = query.ilike("city", `%${city}%`);
    if (style) query = query.contains("yoga_styles", [style]);
    query.then(({ data }) => {
      let rows = (data as Listing[]) || [];
      if (q) {
        const needle = q.toLowerCase();
        rows = rows.filter((r) => r.name.toLowerCase().includes(needle) || (r.tagline ?? "").toLowerCase().includes(needle) || r.yoga_styles.some((s) => s.toLowerCase().includes(needle)));
      }
      setListings(rows);
      setLoading(false);
    });
  }, [q, city, style]);

  const setStyle = (s: string) => {
    const p = new URLSearchParams(params);
    if (s === style) p.delete("style"); else p.set("style", s);
    setParams(p, { replace: true });
  };

  return (
    <PageShell>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Find yoga</div>
          <h1 className="font-display text-3xl md:text-4xl mt-2 mb-6">
            {city ? `Yoga in ${city}` : "All verified studios & instructors"}
          </h1>
          <SearchBar compact />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {ALL_STYLES.map((s) => (
            <button key={s} onClick={() => setStyle(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${style === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : listings.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No studios match your search. Try clearing filters.</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">{listings.length} result{listings.length === 1 ? "" : "s"}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {listings.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}