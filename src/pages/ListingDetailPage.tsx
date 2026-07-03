import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageShell from "@/components/yoga/PageShell";
import { img } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BadgeCheck, MapPin, Phone, Mail, Globe, Star, Loader2 } from "lucide-react";
import type { Listing } from "@/components/yoga/ListingCard";

type Review = { id: string; rating: number; title?: string | null; body: string; created_at: string; user_id: string; vendor_reply?: string | null };

export default function ListingDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [l, setL] = useState<(Listing & { description: string; address: string; phone: string; email: string; website?: string | null; gallery: string[]; amenities: string[] }) | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [rTitle, setRTitle] = useState("");
  const [rBody, setRBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // inquiry form
  const [iName, setIName] = useState("");
  const [iPhone, setIPhone] = useState("");
  const [iMsg, setIMsg] = useState("I'd like to know class timings and drop-in fees.");
  const [sendingLead, setSendingLead] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const load = () => {
    if (!slug) return;
    supabase.from("listings").select("*").eq("slug", slug).maybeSingle().then(({ data }) => setL(data as any));
  };
  useEffect(load, [slug]);

  useEffect(() => {
    if (!l?.id) return;
    supabase.from("reviews").select("*").eq("listing_id", l.id).order("created_at", { ascending: false }).then(({ data }) => setReviews((data as Review[]) || []));
  }, [l?.id]);

  const submitReview = async () => {
    if (!user) { toast({ title: "Sign in to review", description: "Log in to share your experience." }); return; }
    if (!rBody.trim() || !l) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({ listing_id: l.id, user_id: user.id, rating, title: rTitle || null, body: rBody });
    setSubmitting(false);
    if (error) { toast({ title: "Couldn't post review", description: error.message, variant: "destructive" }); return; }
    setRTitle(""); setRBody(""); setRating(5);
    toast({ title: "Thanks for your review!" });
    load();
    supabase.from("reviews").select("*").eq("listing_id", l.id).order("created_at", { ascending: false }).then(({ data }) => setReviews((data as Review[]) || []));
  };

  const sendInquiry = async () => {
    if (!l || !iName.trim() || !iPhone.trim()) return;
    setSendingLead(true);
    const { error } = await supabase.from("leads").insert({ listing_id: l.id, user_id: user?.id ?? null, name: iName, phone: iPhone, email: user?.email ?? null, message: iMsg });
    setSendingLead(false);
    if (error) { toast({ title: "Couldn't send", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Inquiry sent!", description: "The studio will contact you shortly." });
    setInquiryOpen(false);
  };

  if (!l) {
    return <PageShell><div className="py-32 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></PageShell>;
  }

  const gallery = (l.gallery?.length ? l.gallery : [l.cover_image || "listing-1"]);

  return (
    <PageShell>
      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-6 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:rounded-3xl md:overflow-hidden">
          <div className="md:col-span-2 aspect-[4/3] md:aspect-[16/10] bg-muted rounded-2xl md:rounded-none overflow-hidden">
            <img src={img(gallery[0])} alt={l.name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="bg-muted overflow-hidden"><img src={img(gallery[1] ?? gallery[0])} alt="" className="w-full h-full object-cover" /></div>
            <div className="bg-muted overflow-hidden"><img src={img(gallery[2] ?? gallery[0])} alt="" className="w-full h-full object-cover" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:hidden">
            <div className="bg-muted aspect-[4/3] rounded-xl overflow-hidden"><img src={img(gallery[1] ?? gallery[0])} alt="" className="w-full h-full object-cover" /></div>
            <div className="bg-muted aspect-[4/3] rounded-xl overflow-hidden"><img src={img(gallery[2] ?? gallery[0])} alt="" className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs">
            {l.verified && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-1 font-medium"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>}
            {l.tier !== "free" && <span className="uppercase font-semibold tracking-wide bg-foreground text-background rounded-full px-2.5 py-1">{l.tier}</span>}
          </div>
          <h1 className="font-display text-3xl md:text-5xl mt-3 break-words">{l.name}</h1>
          {l.tagline && <p className="text-lg text-muted-foreground mt-2">{l.tagline}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {l.city}, {l.state}</div>
            <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /> <span className="text-foreground font-medium">{Number(l.rating_avg).toFixed(1)}</span> ({l.rating_count} reviews)</div>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">{l.description}</p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-lg mb-3">Yoga styles</h3>
              <div className="flex flex-wrap gap-2">
                {l.yoga_styles.map((s) => <span key={s} className="text-xs rounded-full bg-secondary px-3 py-1">{s}</span>)}
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {(l.amenities ?? []).map((s) => <span key={s} className="text-xs rounded-full border border-border px-3 py-1">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="font-display text-2xl mb-4">Reviews</h2>
            <div className="rounded-2xl border border-border bg-card p-5 mb-6">
              <div className="text-sm font-medium mb-2">Share your experience</div>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={`h-6 w-6 ${n <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Input value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="Title (optional)" className="mb-2" />
              <Textarea value={rBody} onChange={(e) => setRBody(e.target.value)} placeholder="Tell others about your class…" rows={3} />
              <div className="mt-3 flex justify-end">
                <Button onClick={submitReview} disabled={submitting || !rBody.trim()}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Post review
                </Button>
              </div>
              {!user && <div className="text-xs text-muted-foreground mt-2"><Link to="/login" className="underline">Sign in</Link> to post a review.</div>}
            </div>

            <div className="space-y-4">
              {reviews.length === 0 && <div className="text-sm text-muted-foreground">No reviews yet. Be the first!</div>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"}`} />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.title && <div className="font-medium mt-2">{r.title}</div>}
                  <div className="text-sm text-muted-foreground mt-1">{r.body}</div>
                  {r.vendor_reply && (
                    <div className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Studio response</div>
                      {r.vendor_reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6">
            {(l.price_min || l.price_max) && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Class fees</div>
                <div className="font-display text-2xl mt-1">₹{l.price_min}{l.price_max && l.price_max !== l.price_min && <span className="text-muted-foreground text-lg"> – ₹{l.price_max}</span>}</div>
              </div>
            )}
            <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">Send inquiry</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Enquire at {l.name}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input value={iName} onChange={(e) => setIName(e.target.value)} placeholder="Your name" />
                  <Input value={iPhone} onChange={(e) => setIPhone(e.target.value)} placeholder="Phone (+91…)" />
                  <Textarea value={iMsg} onChange={(e) => setIMsg(e.target.value)} rows={3} />
                </div>
                <DialogFooter>
                  <Button onClick={sendInquiry} disabled={sendingLead || !iName || !iPhone}>
                    {sendingLead && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send inquiry
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {l.phone && (<a href={`tel:${l.phone}`} className="mt-3 flex items-center justify-center gap-2 w-full rounded-md border border-border py-2 text-sm hover:bg-muted"><Phone className="h-4 w-4" /> {l.phone}</a>)}
            <div className="mt-6 space-y-3 text-sm">
              {l.address && <div className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" /><span>{l.address}</span></div>}
              {l.email && <div className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-muted-foreground" /><a href={`mailto:${l.email}`} className="hover:text-primary">{l.email}</a></div>}
              {l.website && <div className="flex gap-2"><Globe className="h-4 w-4 mt-0.5 text-muted-foreground" /><a href={l.website} className="hover:text-primary">Website</a></div>}
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}