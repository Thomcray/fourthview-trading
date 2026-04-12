import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    itemName,
    description,
    price,
    discount,
    categoryId,
    productId,
    image,
    size,
    shippingCost,
    productSizes,
  } = body;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);
  console.log("userId:", userId, "cartId:", cart.id);

  //   Check if item already exists
  const { data: existingItem } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id)
    .eq("itemName", itemName)
    .maybeSingle();

  if (existingItem) {
    // Update quantity
    await supabase
      .from("cartItems")
      .update({ quantity: existingItem.quantity + 1, size })
      .eq("id", existingItem.id);
  } else {
    // Insert new item
    const { data: insertData, error: insertError } = await supabase
      .from("cartItems")
      .insert([
        {
          cartId: cart.id,
          productId,
          quantity: 1,
          itemName,
          price,
          discount,
          description,
          image,
          size,
          shippingCost,
          productSizes,
        },
      ])
      .select();

    console.log("Insert result:", insertData);
    console.log("Insert error:", insertError);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  //   Return updated cart
  const { data: items } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id);

  console.log("Items:", items);
  return NextResponse.json({ cart: items });
}
