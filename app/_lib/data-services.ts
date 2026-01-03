import { supabase } from "./supabase";

type Orders = {
  email: string;
  description: string;
  userId: string;
  images: string[];
};

export async function getUserRole(id: number) {
  const { data: userRole, error } = await supabase
    .from("userRole")
    .select("*")
    .eq("userId", id)
    .single();

  if (error) throw new Error("Not admin");

  return userRole;
}

export async function getTempUserByToken(token: string) {
  const { data, error } = await supabase
    .from("tempUsers")
    .select("*")
    .eq("token", token)
    .single();

  if (error) throw new Error("Invalid or expired token");

  return data;
}

export async function getUserByEmail(email: string) {
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
      "https://restcountries.com/v3.1/all?fields=name,flag,idd"
    );

    const countries = await res.json();
    return countries;
  } catch {
    // throw new Error("Could not fetch countries");
    return null;
  }
}

export async function getCategories() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, created_at, name, image_url")
    .order("name");

  if (error) {
    // throw new Error("Could not fetch categories");
    return null;
  }

  return categories;
}

type Category = {
  id: number;
  name: string;
};
export async function getCategoryByName(
  name: string
): Promise<Category | null> {
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
  const { data, error } = await supabase.from("products").insert([product]);

  if (error) {
    console.log(error);

    throw new Error("Could not create product");
  }

  return data;
}

export async function updateCurrentProduct(
  product: Partial<Product>,
  productId: number
) {
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
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, created_at, name, description, categoryId, price, discount, discountType, target, imageUrl, productType, colours"
    );

  if (error) {
    return null;
  }

  return products;
}

export async function getProductById(id: number) {
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, description, productType, colours, price, discount, discountType, categoryId, target, imageUrl, productType, colours, sizes, weight, shippingCost"
    )
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return product;
}

export async function newSpecialOrders(orders: Orders) {
  const { data, error } = await supabase.from("specialOrders").insert([orders]);

  if (error) {
    console.log(error);

    throw new Error("Error placing order. Try again!");
  }

  return data;
}
