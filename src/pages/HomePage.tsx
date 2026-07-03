import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/yoga/PageShell";
import SearchBar from "@/components/yoga/SearchBar";
import ListingCard, { Listing } from "@/components/yoga/ListingCard";
import ProductCard, { Product } from "@/components/yoga/ProductCard";
import { img } from "@/lib/images";
import { BadgeCheck, Sparkles, ShieldCheck, Users, ArrowRight, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

const CITIES = [
  { name: "Dehradun", count: "2 studios", tag: "HQ" },
  { name: "Rishikesh", count: "1 ashram" },
  { name: "Mumbai", count: "1 studio" },
  { name: "Bengaluru", count: "1 studio" },
  { name: "New Delhi", count: "1 studio" },
  { name: "Gurgaon", count: "1 collective" },
];

const STYLES = ["Hatha", "Ashtanga", "Vinyasa", "Iyengar", "Kundalini", "Yin", "Pranayama", "Aerial", "Prenatal"];

export default function HomePage() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [ads, setAds] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("listings").select("*").eq("featured", true).limit(3).then(({ data }) => setFeatured((data as Listing[]) || []));
    supabase.from("products").select("*").eq("is_ad", true).limit(3).then(({ data }) => setAds((data as Product[]) || []));
  }, []);

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={img("hero-dehradun")} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-medium mb-6">
              <Mountain className="h-4 w-4" /> Dehradun · Gateway to the Himalayas
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Find your <em className="not-italic text-primary">flow</em>.<br />Verified centres.<br />Real reviews.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
              India's most trusted directory of yoga studios, ashrams, instructors and retreats — from the mountain towns of Uttarakhand to metro rooftops in Mumbai and Bengaluru.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              Popular:
              {STYLES.slice(0, 5).map((s) => (
                <Link key={s} to={`/browse?q=${s}`} className="underline underline-offset-2 hover:text-primary">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border/50 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "300+", l: "Verified centres" },
            { n: "18", l: "Cities across India" },
            { n: "2,400+", l: "Real reviews" },
            { n: "45+", l: "Yoga styles indexed" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl font-semibold">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CITIES */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore by city</div>
            <h2 className="font-display text-3xl md:text-4xl mt-2">From the mountains to the metros</h2>
          </div>
          <Link to="/browse" className="hidden md:inline-flex items-center gap-1 text-sm text-primary">See all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CITIES.map((c) => (
            <Link key={c.name} to={`/browse?city=${c.name}`} className="group relative rounded-2xl border border-border bg-card hover:border-primary/50 p-5 transition-colors">
              <div className="font-display text-lg font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.count}</div>
              {c.tag && <span className="absolute top-3 right-3 text-[10px] bg-primary text-primary-foreground rounded-full px-2 py-0.5 uppercase font-semibold tracking-wide">{c.tag}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16 md:pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Handpicked</div>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Featured studios & retreats</h2>
          </div>
          <Link to="/browse" className="text-sm text-primary flex items-center gap-1 shrink-0">Browse all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      {/* SHOP RAIL */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Marketplace</div>
              <h2 className="font-display text-3xl md:text-4xl mt-2">Everything for your practice</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">Mats, apparel, singing bowls & malas — sourced from Indian makers. <span className="text-xs">(These are sample sponsored listings shown for demo.)</span></p>
            </div>
            <Link to="/shop" className="text-sm text-primary flex items-center gap-1 shrink-0">Shop all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {ads.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why Yoga the Union</div>
          <h2 className="font-display text-3xl md:text-4xl mt-2">Trust, built into every listing</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: BadgeCheck, t: "Verified centres", d: "Every studio is background-checked — GST, address and instructor credentials verified in-person by our Dehradun team." },
            { icon: Users, t: "Real reviews", d: "Only practitioners who booked can leave reviews. No fakes. Vendors can respond publicly." },
            { icon: ShieldCheck, t: "Safe inquiries", d: "Your phone number stays private. Enquire once, get responses from up to 3 matching studios." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4"><f.icon className="h-5 w-5" /></div>
              <div className="font-display text-xl font-semibold">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16 md:pb-20">
        <div className="rounded-3xl overflow-hidden relative bg-foreground text-background p-8 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">For studio owners</div>
            <h2 className="font-display text-3xl md:text-5xl mt-3">Fill your classes. Grow your practice.</h2>
            <p className="mt-4 text-background/80 max-w-lg">Join 300+ studios reaching 50,000+ practitioners a month. Start free, upgrade when you're ready.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild><Link to="/vendors">List your studio — Free</Link></Button>
              <Button size="lg" variant="outline" className="bg-transparent text-background border-background/40 hover:bg-background hover:text-foreground" asChild>
                <Link to="/vendors#pricing">See pricing</Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 hidden md:block">
            <img src={img("listing-2")} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}