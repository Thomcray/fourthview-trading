import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, quantity } = await req.json();

  if (!id || quantity === undefined) {
    return NextResponse.json(
      { error: "Item id and quantity are required" },
      { status: 400 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await getOrCreateCart(session.user.id);
  const supabase = await createClient(true);

  const { error } = await supabase
    .from("cartItems")
    .update({ quantity })
    .eq("id", id)
    .eq("cartId", cart.id);

  if (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
