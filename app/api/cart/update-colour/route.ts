// app/api/cart/update-colour/route.ts
import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, colour } = await req.json();

  if (!id || !colour) {
    return NextResponse.json(
      { error: "Item id and colour are required" },
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
    .update({ colour })
    .eq("id", id)
    .eq("cartId", cart.id);

  if (error) {
    console.error("Error updating colour:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
