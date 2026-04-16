import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { itemName, size } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await getOrCreateCart(session.user.id);

  const supabase = await createClient();

  const { error } = await supabase
    .from("cartItems")
    .update({ size })
    .eq("cartId", cart.id)
    .eq("itemName", itemName);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update size" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
