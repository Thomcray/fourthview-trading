import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, colour, size, productId } = await req.json();

  if (!id || !productId) {
    return NextResponse.json(
      { error: "Item id and productId are required" },
      { status: 400 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await getOrCreateCart(session.user.id);
  const supabase = await createClient(true);

  // Check if target variant already exists (excluding current item)
  const { data: existing } = await supabase
    .from("cartItems")
    .select("id")
    .eq("cartId", cart.id)
    .eq("productId", productId)
    .eq("colour", colour ?? null)
    .eq("size", size ?? null)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Variant already exists in cart" },
      { status: 409 },
    );
  }

  // Update in place - NO DELETE, NO FLASH
  const updates: Record<string, string | null> = {};
  if (colour !== undefined) updates.colour = colour;
  if (size !== undefined) updates.size = size;

  const { error } = await supabase
    .from("cartItems")
    .update(updates)
    .eq("id", id)
    .eq("cartId", cart.id);

  if (error) {
    console.error("Error updating variant:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return updated cart
  const { data: cartItems, error: fetchError } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id)
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("Error fetching cart:", fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ cart: cartItems });
}
