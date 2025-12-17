import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  await supabase.from("cartItems").delete().eq("cartId", cart.id);

  return NextResponse.json({ success: true });
}
