import { cache } from "react";
import { createClient } from "./supabase-server";

type Orders = {
  email: string;
  description: string;
  userId: string;
  images: string[];
  whatsapp: string;
};

export async function getUserRole(id: number) {
  const supabase = await createClient(true); // admin

  const { data: userRole, error } = await supabase
    .from("userRole")
    .select("*")
    .eq("userId", id)
    .single();

  if (error) throw new Error("Not admin");

  return userRole;
}

export async function getTempUserByToken(token: string) {
  const supabase = await createClient(); // regular user
  const { data, error } = await supabase
    .from("tempUsers")
    .select("*")
    .eq("token", token)
    .single();

  if (error) throw new Error("Invalid or expired token");

  return data;
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient(true); // admin
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flag,idd",
      { next: { revalidate: 86400 } }, // cache for 24 hours
    );

    if (!res.ok) return []; // return empty array instead of throwing the error

    const countries = await res.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return []; // return empty array instead of throwing the error
  }
}

export async function getCategories() {
  const supabase = await createClient(true);

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, created_at, name, slug, image_url")
    .order("name");

  if (error) {
    console.error("Failed to fetch categories:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return [];
  }

  const categoriesWithSignedUrls = await Promise.all(
    categories.map(async (category) => {
      if (!category.image_url) return category;

      // Already a full URL (old data) — return as-is
      if (category.image_url.startsWith("http")) return category;

      const { data } = await supabase.storage
        .from("category-images")
        .createSignedUrl(category.image_url, 60 * 60);

      return { ...category, image_url: data?.signedUrl ?? "" };
    }),
  );

  return categoriesWithSignedUrls;
}

type Category = {
  id: number;
  name: string;
};

export async function getCategoryByName(
  name: string,
): Promise<Category | null> {
  const supabase = await createClient(true); // public data
  const { data: category, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("name", name)
    .single();

  if (error) {
    throw new Error("Could not fetch category name");
  }

  return category;
}

type Product = {
  name: string;
  description: string;
  productType: string;
  colours: string[];
  quantity: number;
  price: number;
  discount?: number;
  discountType?: string;
  categoryId: number;
  target: string;
  imageUrl: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
};

export async function newProduct(product: Product) {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Could not create product");
  }

  return data;
}

export async function updateCurrentProduct(
  product: Partial<Product>,
  productId: number,
) {
  const supabase = await createClient(true); // admin
  const { data, error } = await supabase
    .from("products")
    .update([product])
    .eq("id", productId);

  if (error) {
    throw new Error("Could not update product");
  }

  return data;
}

export async function getAllProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, created_at, name, description, categoryId, price, discount, discountType, target, imageUrl, productType, colours, sizes, weight, shippingCost",
    );

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return products ?? [];
}

export async function getProductById(id: number) {
  const supabase = await createClient(); // public data
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, description, productType, colours, price, discount, discountType, categoryId, target, imageUrl, productType, colours, sizes, weight, shippingCost",
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch product:", error.message);
    return null;
  }

  return product;
}

export async function newSpecialOrders(orders: Orders) {
  const supabase = await createClient(true); // user operation
  const { data, error } = await supabase.from("specialOrders").insert([orders]);

  if (error) {
    console.error(error);
    throw new Error("Error placing order. Try again!");
  }

  return data;
}
