import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const go = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    nav(`/browse?${params.toString()}`);
  };
  return (
    <form onSubmit={go} className={`flex flex-col md:flex-row gap-2 p-2 rounded-2xl bg-card border border-border shadow-lg ${compact ? "" : "md:p-3"}`}>
      <div className="flex items-center gap-2 flex-1 px-3">
        <Search className="h-5 w-5 text-muted-foreground shrink-0" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hatha, Ashtanga, teacher training…" className="border-0 shadow-none focus-visible:ring-0 px-0" />
      </div>
      <div className="hidden md:block w-px bg-border" />
      <div className="flex items-center gap-2 md:w-64 px-3">
        <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (e.g. Dehradun)" className="border-0 shadow-none focus-visible:ring-0 px-0" />
      </div>
      <Button type="submit" size="lg" className="md:h-auto">Search</Button>
    </form>
  );
}