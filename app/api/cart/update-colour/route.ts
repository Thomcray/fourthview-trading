// app/api/cart/update-colour/route.ts
import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { itemName, colour } = await req.json();

  if (!itemName || !colour) {
    return NextResponse.json(
      { error: "Item name and colour are required" },
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
    .eq("cartId", cart.id)
    .eq("itemName", itemName);

  if (error) {
    console.error("Error updating colour:", error);
    return NextResponse.json(
      { error: "Failed to update colour" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, colour });
}
