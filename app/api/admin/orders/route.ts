import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const { searchParams } = new URL(request.url);

    const cursorParam = searchParams.get("cursor");
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all";

    const parsedLimit = Number(searchParams.get("limit"));

    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const cursor = cursorParam ? Number(cursorParam) : null;

    if (cursorParam && (!Number.isFinite(cursor) || cursor! <= 0)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }

    /*
     * -------------------------------------------------------------
     * Find users matching the search.
     *
     * This allows searches such as:
     * - customer name
     * - customer email
     *
     * to be applied before order pagination.
     * -------------------------------------------------------------
     */

    let matchingUserIds: number[] = [];

    if (search) {
      const escapedSearch = search
        .replace(/\\/g, "\\\\")
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_")
        .replace(/,/g, " ");

      const { data: matchingUsers, error: usersSearchError } = await supabase
        .from("users")
        .select("id")
        .or(
          `email.ilike.%${escapedSearch}%,firstName.ilike.%${escapedSearch}%,lastName.ilike.%${escapedSearch}%`,
        );

      if (usersSearchError) {
        console.error("Search users error:", usersSearchError);

        return NextResponse.json(
          { error: "Failed to search customers" },
          { status: 500 },
        );
      }

      matchingUserIds = (matchingUsers ?? []).map((user) => user.id);
    }

    // Build the orders query.

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("is_deleted", false);

    // Status filter

    if (status !== "all") {
      query = query.eq("order_status", status);
    }

    /*
     * Server-side search
     *
     * Searches:
     * - reference
     * - customer ID
     * - order ID
     * - matching customer IDs
     */

    if (search) {
      const searchConditions: string[] = [];

      const escapedSearch = search
        .replace(/\\/g, "\\\\")
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_")
        .replace(/,/g, " ");

      searchConditions.push(`reference.ilike.%${escapedSearch}%`);

      // Search order ID when the search value is numeric.

      const numericSearch = Number(search);

      if (Number.isInteger(numericSearch) && numericSearch > 0) {
        searchConditions.push(`id.eq.${numericSearch}`);
      }

      // Search by customer IDs returned from the users query.

      if (matchingUserIds.length > 0) {
        searchConditions.push(`userId.in.(${matchingUserIds.join(",")})`);
      }

      /*
       * If the search isn't numeric and didn't match any users,
       * reference search is still valid, so we don't return early.
       */

      query = query.or(searchConditions.join(","));
    }

    /*
     * Cursor pagination.
     *
     * Orders are sorted by ID descending.
     * The next page starts with IDs smaller than the cursor.
     */

    if (cursor !== null) {
      query = query.lt("id", cursor);
    }

    query = query.order("id", { ascending: false }).limit(limit + 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error("Fetch orders error:", error);

      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    // Determine whether another page exists.

    const hasMore = (orders?.length ?? 0) > limit;

    const items = hasMore ? orders!.slice(0, limit) : (orders ?? []);

    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Fetch customer information for the current page.

    const userIds = [
      ...new Set(items.map((order) => order.userId).filter(Boolean)),
    ];

    const { data: users, error: usersError } = userIds.length
      ? await supabase
          .from("users")
          .select("id, email, firstName, lastName")
          .in("id", userIds)
      : { data: [], error: null };

    if (usersError) {
      console.error("Fetch order users error:", usersError);
    }

    const userMap = Object.fromEntries(
      (users ?? []).map((user) => [user.id, user]),
    );

    const mappedOrders = items.map((order) => {
      const user = userMap[order.userId];

      return {
        ...order,

        customerName: user
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown"
          : "Unknown",

        customerEmail: user?.email ?? "Unknown",
      };
    });

    return NextResponse.json({
      orders: mappedOrders,
      nextCursor,
      hasMore,
      total: count ?? 0,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
