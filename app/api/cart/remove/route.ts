import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { itemName } = body;
  console.log(itemName);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  await supabase
    .from("cartItems")
    .delete()
    .eq("cartId", cart.id)
    .eq("itemName", itemName);

  return NextResponse.json({ success: true });
}
