import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageShell from "@/components/yoga/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Loader2, Plus, Users, Eye, Star } from "lucide-react";
import type { Listing } from "@/components/yoga/ListingCard";

type Lead = { id: string; name: string; phone: string; email?: string | null; message?: string | null; created_at: string; status: string; listing_id: string };

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mine, setMine] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Dehradun");
  const [description, setDescription] = useState("");
  const [styles, setStyles] = useState("Hatha, Vinyasa");
  const [phone, setPhone] = useState("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: ls }, { data: lds }] = await Promise.all([
      supabase.from("listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setMine((ls as Listing[]) || []);
    setLeads((lds as Lead[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [user?.id]);

  const createListing = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);
    const { error } = await supabase.from("listings").insert({
      owner_id: user.id, slug, name, description, city,
      yoga_styles: styles.split(",").map((s) => s.trim()).filter(Boolean),
      phone, price_min: priceMin ? Number(priceMin) : null,
      cover_image: "listing-4", status: "pending",
    });
    setSaving(false);
    if (error) { toast({ title: "Couldn't create", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Listing submitted", description: "It'll appear once approved." });
    setShowForm(false); setName(""); setDescription(""); setStyles("Hatha, Vinyasa"); setPhone(""); setPriceMin("");
    load();
  };

  const myLeads = leads.filter((ld) => mine.some((m) => m.id === ld.listing_id));

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vendor dashboard</div>
            <h1 className="font-display text-4xl mt-2">Welcome back, {user?.email?.split("@")[0]}</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add a new listing</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Eye, label: "My listings", value: mine.length },
            { icon: Users, label: "Total inquiries", value: myLeads.length },
            { icon: Star, label: "Avg rating", value: mine.length ? (mine.reduce((a, b) => a + Number(b.rating_avg), 0) / mine.length).toFixed(1) : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-display text-3xl mt-2">{s.value}</div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl mb-4">Create a listing</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input placeholder="Studio name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input placeholder="Starting price (₹/class)" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input placeholder="Yoga styles (comma-separated)" className="md:col-span-2" value={styles} onChange={(e) => setStyles(e.target.value)} />
              <Textarea className="md:col-span-2" placeholder="Describe your studio, teachers, and vibe…" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={createListing} disabled={saving || !name}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Submit for review</Button>
            </div>
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-display text-2xl mb-4">Your listings</h2>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : mine.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                You don't have any listings yet. Create one to appear in search.
              </div>
            ) : (
              <div className="space-y-3">
                {mine.map((m) => (
                  <Link key={m.id} to={`/studio/${m.slug}`} className="block rounded-xl border border-border p-4 bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.city} · {m.rating_count} reviews</div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wide font-semibold rounded-full px-2 py-1 ${(m as any).status === "approved" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-800"}`}>
                        {(m as any).status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl mb-4">Recent inquiries</h2>
            {myLeads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">No inquiries yet.</div>
            ) : (
              <div className="space-y-3">
                {myLeads.map((l) => (
                  <div key={l.id} className="rounded-xl border border-border p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{l.name}</div>
                      <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{l.phone}</div>
                    {l.message && <div className="text-sm mt-2">{l.message}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}