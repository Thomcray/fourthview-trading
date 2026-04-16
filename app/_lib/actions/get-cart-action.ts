import { createClient } from "../supabase-server";

export async function getOrCreateCart(userId: string) {
  const supabase = await createClient(); // user context - their own cart

  // Check for existing cart
  const { data: cart } = await supabase
    .from("carts")
    .select("*")
    .eq("userId", userId)
    .eq("status", "active")
    .maybeSingle();

  if (cart) return cart;

  //   If none exists, create it
  const { data: newCart, error } = await supabase
    .from("carts")
    .insert([{ userId: userId, status: "active" }])
    .select()
    .single();

  if (error) throw error;

  return newCart;
}
