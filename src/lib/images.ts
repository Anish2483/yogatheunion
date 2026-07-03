import heroDehradun from "@/assets/hero-dehradun.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import adMat from "@/assets/ad-mat.jpg";
import adApparel from "@/assets/ad-apparel.jpg";
import adBowl from "@/assets/ad-bowl.jpg";

export const IMAGES: Record<string, string> = {
  "hero-dehradun": heroDehradun,
  "listing-1": listing1,
  "listing-2": listing2,
  "listing-3": listing3,
  "listing-4": listing4,
  "ad-mat": adMat,
  "ad-apparel": adApparel,
  "ad-bowl": adBowl,
};

export function img(key?: string | null, fallback = "listing-1") {
  if (!key) return IMAGES[fallback];
  return IMAGES[key] ?? IMAGES[fallback];
}