import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/_lib/auth";
import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { createClient } from "@/app/_lib/supabase-server";
import { Cart } from "@/components/AppContext";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id);

  if (error) {
    console.error("Failed to fetch cart items:", error);

    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    cart: (items ?? []) as Cart[],
  });
}
