import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/_lib/auth";
import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { supabase } from "@/app/_lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  const { data: items } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id);

  return NextResponse.json({ cart: items || [] });
}
