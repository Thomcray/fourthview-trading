import { Product, NormalizedProduct } from "@/types/product";

function deriveSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function normalizeProducts(raw: Product[]): NormalizedProduct[] {
  return raw.map((p) => ({
    ...p,
    slug: deriveSlug(p.name),
    _groupKeys: {
      byProductType: (p.productType ?? "Other").toLowerCase().trim(),
      byTarget: (p.target ?? "General").toLowerCase().trim(),
    },
  }));
}
