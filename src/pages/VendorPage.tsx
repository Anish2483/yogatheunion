import PageShell from "@/components/yoga/PageShell";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const tiers = [
  { name: "Free", price: "₹0", period: "forever", cta: "Start free", features: ["Business listing", "3 photos", "5 inquiries/month", "Basic analytics"] },
  { name: "Silver", price: "₹999", period: "/month", cta: "Go Silver", features: ["15 photos + 1 video", "25 inquiries/month", "Silver search badge", "Views + clicks analytics"] },
  { name: "Gold", price: "₹2,499", period: "/month", cta: "Go Gold", features: ["50 photos", "Unlimited inquiries", "Verified badge eligible", "Lead marketplace access"], highlight: true },
  { name: "Platinum", price: "₹5,999", period: "/month", cta: "Go Platinum", features: ["Unlimited media", "Own storefront", "API + priority ranking", "Dedicated account manager"] },
];

export default function VendorPage() {
  const { user } = useAuth();
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-medium"><Sparkles className="h-4 w-4" /> For studios & instructors</div>
        <h1 className="font-display text-5xl md:text-6xl mt-4">Get discovered by every yoga seeker in your city.</h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">List your studio in 3 minutes. Start free, upgrade any time. Trusted by 300+ studios from Dehradun to Bengaluru.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" asChild><Link to={user ? "/dashboard" : "/login"}>List your studio</Link></Button>
          <Button size="lg" variant="outline" asChild><a href="#pricing">See pricing</a></Button>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl">Choose a plan that fits</h2>
          <p className="text-muted-foreground mt-2">Cancel any time. Founders' pricing — locked forever.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-6 bg-card ${t.highlight ? "border-primary shadow-xl scale-[1.02] relative" : "border-border"}`}>
              {t.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground rounded-full px-3 py-1 font-semibold">Most popular</span>}
              <div className="font-display text-2xl">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{t.price}</span>
                <span className="text-muted-foreground text-sm">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> {f}</li>)}
              </ul>
              <Button className="w-full mt-6" variant={t.highlight ? "default" : "outline"} asChild>
                <Link to={user ? "/dashboard" : "/login"}>{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}