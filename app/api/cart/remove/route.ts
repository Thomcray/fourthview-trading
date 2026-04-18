import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Item id is required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await getOrCreateCart(session.user.id);
  const supabase = await createClient(true);

  // Scope deletion to cartId as well so a user can never delete another user's item
  const { error } = await supabase
    .from("cartItems")
    .delete()
    .eq("id", id)
    .eq("cartId", cart.id);

  if (error) {
    console.error("Error removing item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
