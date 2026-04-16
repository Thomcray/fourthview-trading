import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
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
    colour,
    shippingCost,
    productSizes,
    productColours,
  } = body;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  const supabase = await createClient(true);

  // Check if item already exists with same size and colour
  const { data: existingItem } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id)
    .eq("itemName", itemName)
    .eq("size", size || "")
    .eq("colour", colour || "")
    .maybeSingle();

  if (existingItem) {
    // Update quantity
    const { error: updateError } = await supabase
      .from("cartItems")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
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
          size: size || null,
          colour: colour || null,
          shippingCost,
          productSizes: productSizes || [],
          productColours: productColours || [],
        },
      ])
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  // Return updated cart
  const { data: items, error: fetchError } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id);

  if (fetchError) {
    console.error("Fetch error:", fetchError);
  }

  return NextResponse.json({ cart: items || [] });
}
