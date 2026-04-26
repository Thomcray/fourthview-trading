import { useMemo } from "react";
import { Products } from "@/components/AppContext";
import { CategoryColors, getColorsForCategory } from "@/lib/categoryColors";

export type GroupMode = "productType" | "target";

export type CategoryGroup = {
  name: string;
  slug: string; // URL-safe slug for linking
  items: Products[];
} & CategoryColors;

type GroupConfig = {
  keyField: keyof Products["_groupKeys"];
  linkParam: string; // ?q= or ?target=
  emptyLabel: string;
};

const MODE_CONFIG: Record<GroupMode, GroupConfig> = {
  productType: {
    keyField: "byProductType",
    linkParam: "q",
    emptyLabel: "Other",
  },
  target: {
    keyField: "byTarget",
    linkParam: "target",
    emptyLabel: "General",
  },
};

export function useCategoryGroups(
  products: Products[],
  mode: GroupMode,
): CategoryGroup[] {
  const config = MODE_CONFIG[mode];

  return useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        slug: string;
        items: Products[];
      }
    >();

    products.forEach((product) => {
      const rawKey = product._groupKeys[config.keyField];
      const displayName =
        rawKey === ""
          ? config.emptyLabel
          : rawKey.charAt(0).toUpperCase() + rawKey.slice(1);

      // Use displayName as map key to prevent "men" vs "Men" duplicates
      if (!map.has(displayName)) {
        map.set(displayName, {
          name: displayName,
          slug: rawKey.replace(/\s+/g, "-"),
          items: [],
        });
      }
      map.get(displayName)!.items.push(product);
    });

    // Sort by item count (popularity) then alphabetically
    return Array.from(map.values())
      .sort((a, b) => {
        if (b.items.length !== a.items.length) {
          return b.items.length - a.items.length;
        }
        return a.name.localeCompare(b.name);
      })
      .map((cat) => ({
        ...cat,
        items: cat.items.slice(0, 4),
        ...getColorsForCategory(cat.name),
      }));
  }, [products, mode, config]);
}
