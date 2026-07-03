
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','vendor','user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

-- Listings (yoga centers / instructors)
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'studio', -- studio, instructor, retreat, ashram
  yoga_styles TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  city TEXT NOT NULL DEFAULT 'Dehradun',
  state TEXT NOT NULL DEFAULT 'Uttarakhand',
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  email TEXT,
  website TEXT,
  cover_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  price_min INT,
  price_max INT,
  tier TEXT NOT NULL DEFAULT 'free', -- free, silver, gold, platinum
  verified BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'approved', -- pending, approved, rejected
  rating_avg NUMERIC NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings public read" ON public.listings FOR SELECT USING (status='approved' OR owner_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "listings insert own" ON public.listings FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "listings update own or admin" ON public.listings FOR UPDATE TO authenticated USING (owner_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "listings delete own or admin" ON public.listings FOR DELETE TO authenticated USING (owner_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_styles ON public.listings USING GIN (yoga_styles);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT NOT NULL,
  vendor_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews insert own" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid());
CREATE POLICY "reviews update own or listing owner" ON public.reviews FOR UPDATE TO authenticated USING (user_id=auth.uid() OR EXISTS(SELECT 1 FROM public.listings l WHERE l.id=listing_id AND l.owner_id=auth.uid()));
CREATE POLICY "reviews delete own or admin" ON public.reviews FOR DELETE TO authenticated USING (user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Trigger to keep rating aggregate
CREATE OR REPLACE FUNCTION public.recalc_listing_rating() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE lid UUID;
BEGIN
  lid := COALESCE(NEW.listing_id, OLD.listing_id);
  UPDATE public.listings SET
    rating_avg = COALESCE((SELECT ROUND(AVG(rating)::numeric,2) FROM public.reviews WHERE listing_id=lid),0),
    rating_count = (SELECT COUNT(*) FROM public.reviews WHERE listing_id=lid)
  WHERE id=lid;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_recalc_rating AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalc_listing_rating();

-- Favorites
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fav own" ON public.favorites FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());

-- Leads / inquiries
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads insert anyone" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads read owner/admin/self" ON public.leads FOR SELECT TO authenticated USING (
  user_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR EXISTS(SELECT 1 FROM public.listings l WHERE l.id=listing_id AND l.owner_id=auth.uid())
);
CREATE POLICY "leads update owner/admin" ON public.leads FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR EXISTS(SELECT 1 FROM public.listings l WHERE l.id=listing_id AND l.owner_id=auth.uid())
);

-- Products (yoga mats etc.)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL DEFAULT 'mat',
  description TEXT,
  price INT NOT NULL,
  mrp INT,
  image TEXT,
  is_ad BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (active=true);

-- updated_at triggers
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
