import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/_lib/auth";
import { getOrCreateCart } from "@/app/_lib/actions/get-cart-action";
import { createClient } from "@/app/_lib/supabase-server";

// Define Cart type here (or import from a shared types file)
type Cart = {
  id?: number;
  productId?: number;
  itemName: string;
  image?: string;
  price?: number;
  discount?: number;
  quantity?: number;
  description?: string;
  size: string | null; // required, no ?
  colour: string | null; // required, no ?
  shippingCost?: number;
  productSizes?: string[];
  productColours?: string[];
};

// Normalize to ensure size/colour are never undefined
const normalizeCartItems = (items: any[] | null): Cart[] => {
  if (!items) return [];

  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    itemName: item.itemName,
    image: item.image,
    price: item.price,
    discount: item.discount,
    quantity: item.quantity,
    description: item.description,
    size: item.size ?? null, // ensure null, not undefined
    colour: item.colour ?? null, // ensure null, not undefined
    shippingCost: item.shippingCost,
    productSizes: item.productSizes,
    productColours: item.productColours,
  }));
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const cart = await getOrCreateCart(userId);

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cart.id);

  return NextResponse.json({ cart: normalizeCartItems(items) });
}
