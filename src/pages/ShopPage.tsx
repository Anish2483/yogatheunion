import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/yoga/PageShell";
import ProductCard, { Product } from "@/components/yoga/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    supabase.from("products").select("*").eq("active", true).order("is_ad", { ascending: false }).then(({ data }) => setProducts((data as Product[]) || []));
  }, []);
  return (
    <PageShell>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Marketplace</div>
          <h1 className="font-display text-4xl mt-2">Shop yoga essentials</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">Curated mats, apparel, singing bowls and malas from Indian makers. Ads shown are sample sponsored listings.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </PageShell>
  );
}