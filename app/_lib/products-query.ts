import { createClient } from "./supabase-server";

export const PRODUCT_COLUMNS =
  "id, created_at, name, description, categoryId, price, discount, discountType, target, imageUrl, productType, colours, sizes, weight, shippingCost";

const PRODUCT_FILTERS = {
  target: { column: "target", fallback: "general" },
  productType: { column: "productType", fallback: "other" },
} as const;

const PRODUCT_SORTS = {
  "price-asc": { column: "price", ascending: true },
  "price-desc": { column: "price", ascending: false },
  name: { column: "name", ascending: true },
} as const;

// ilike treats % and _ as wildcards, so escape them in user input
const escapeLike = (v: string) => v.replace(/[\\%_]/g, "\\$&");

export async function getProductsPage({
  mode,
  value,
  sort,
  cursor,
  limit,
}: {
  mode: keyof typeof PRODUCT_FILTERS | null;
  value: string;
  sort: string;
  cursor: number | null;
  limit: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS, { count: "exact" });

  if (mode && value && mode in PRODUCT_FILTERS) {
    const { column, fallback } = PRODUCT_FILTERS[mode];
    const safe = escapeLike(value);

    if (value === fallback) {
      // Fallback group = empty values + anything literally named that
      query = query.or(
        `${column}.is.null,${column}.eq.,${column}.ilike.${safe}`,
      );
    } else {
      query = query.ilike(column, safe);
    }
  }

  const sortConfig = PRODUCT_SORTS[sort as keyof typeof PRODUCT_SORTS];
  const offset = cursor ?? 0;

  if (sortConfig) {
    // Price/name sort: the cursor is an offset
    query = query
      .order(sortConfig.column, { ascending: sortConfig.ascending })
      .order("id", { ascending: false }) // tie-breaker keeps paging stable
      .range(offset, offset + limit); // limit + 1 rows
  } else {
    if (cursor !== null) query = query.lt("id", cursor);
    query = query.order("id", { ascending: false }).limit(limit + 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch products page:", error.message);
    throw new Error("Could not fetch products");
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const products = hasMore ? rows.slice(0, limit) : rows;

  const nextCursor = !hasMore
    ? null
    : sortConfig
      ? offset + limit
      : (products[products.length - 1]?.id ?? null);

  return { products, nextCursor, total: count ?? 0, hasMore };
}
