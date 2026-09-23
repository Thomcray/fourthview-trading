import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

type OrderItem = {
  productId?: number | string;
};

export async function GET(req: NextRequest) {
  try {
    const productId = new URL(req.url).searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    const numericProductId = Number(productId);

    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: reviews, error } = await supabase
      .from("productReviews")
      .select("*")
      .eq("productId", numericProductId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase productReviews GET error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return NextResponse.json(
        {
          error: "Failed to fetch reviews",
          details: error.message,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
    });
  } catch (error) {
    console.error("Product reviews GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    const numericProductId = Number(productId);
    const numericRating = Number(rating);

    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          error: "A rating between 1 and 5 is required",
        },
        { status: 400 },
      );
    }

    const email = session.user.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unable to identify user" },
        { status: 401 },
      );
    }

    const userName =
      [session.user.firstName, session.user.lastName]
        .filter(Boolean)
        .join(" ") ||
      email ||
      "Customer";

    const reviewComment = String(comment || "").trim();

    if (reviewComment.length > 1000) {
      return NextResponse.json(
        {
          error: "Review must be 1000 characters or less",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    /*
     * Resolve the actual application user ID

     * orders.userId contains values such as "25099".
     * public.users.id is the numeric application user ID.
     *
     * We therefore resolve the user by email first instead of
     * assuming session.user.id has the same value.
     */
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id, email, firstName, lastName")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      console.error("User lookup error:", {
        message: userError.message,
        details: userError.details,
        hint: userError.hint,
        code: userError.code,
      });

      throw userError;
    }

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "User account could not be found",
        },
        { status: 404 },
      );
    }

    const userId = String(dbUser.id);

    // Confirm product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", numericProductId)
      .maybeSingle();

    if (productError) {
      console.error("Product lookup error:", {
        message: productError.message,
        details: productError.details,
        hint: productError.hint,
        code: productError.code,
      });

      throw productError;
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    /*
     *  Find the user's completed/purchased orders
     *
     * A customer can review a product if it exists inside an
     * order whose status is shipped or delivered.
     */
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, items, order_status")
      .eq("userId", userId)
      .eq("is_deleted", false)
      .in("order_status", ["shipped", "delivered"]);

    if (ordersError) {
      console.error("Order lookup error:", {
        message: ordersError.message,
        details: ordersError.details,
        hint: ordersError.hint,
        code: ordersError.code,
      });

      throw ordersError;
    }

    console.log("Product review purchase check:", {
      userEmail: email,
      resolvedUserId: userId,
      productId: numericProductId,
      matchingOrders: orders?.length || 0,
    });

    // Check the JSONB order items

    const purchasedProduct = (orders || []).some((order) => {
      if (!Array.isArray(order.items)) {
        return false;
      }

      return (order.items as OrderItem[]).some(
        (item) => Number(item.productId) === numericProductId,
      );
    });

    if (!purchasedProduct) {
      return NextResponse.json(
        {
          error: "You can only review products you have purchased",
        },
        { status: 403 },
      );
    }

    // Prevent duplicate reviews

    const { data: existing, error: existingError } = await supabase
      .from("productReviews")
      .select("id")
      .eq("productId", numericProductId)
      .eq("userId", userId)
      .maybeSingle();

    if (existingError) {
      console.error("Existing review lookup error:", {
        message: existingError.message,
        details: existingError.details,
        hint: existingError.hint,
        code: existingError.code,
      });

      throw existingError;
    }

    if (existing) {
      return NextResponse.json(
        {
          error: "You have already reviewed this product",
        },
        { status: 400 },
      );
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("productReviews")
      .insert([
        {
          productId: numericProductId,
          userId,
          userName,
          rating: numericRating,
          comment: reviewComment,
        },
      ])
      .select()
      .single();

    if (reviewError) {
      console.error("Product review insert error:", {
        message: reviewError.message,
        details: reviewError.details,
        hint: reviewError.hint,
        code: reviewError.code,
      });

      throw reviewError;
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating product review:", error);

    return NextResponse.json(
      {
        error: "Failed to submit review",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
