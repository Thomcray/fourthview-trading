import { supabase } from "./supabase";

export async function getUserRole(id: number) {
  let { data: userRole, error } = await supabase
    .from("userRole")
    .select("*")
    .eq("userId", id)
    .single();

  if (error) throw new Error("Not admin");

  return userRole;
}

export async function getTempUserByToken(token: string) {
  let { data, error } = await supabase
    .from("tempUsers")
    .select("*")
    .eq("token", token)
    .single();

  if (error) throw new Error("Invalid or expired token");

  return data;
}

export async function getUserByEmail(email: string) {
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flag,idd"
    );

    const countries = await res.json();
    return countries;
  } catch (error) {
    return null;
    // throw new Error("Could not fetch countries");
  }
}

export async function getCategories() {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("name, image_url")
    .order("name");

  if (error) {
    console.log(error);
    throw new Error("Could not fetch categories");
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
  let { data: category, error } = await supabase
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
  quantity: number;
  price: number;
  discount?: number;
  discountType?: string;
  categoryId: number;
  target: string;
  imageUrl: string;
};

export async function newProduct(product: Product) {
  const { data, error } = await supabase.from("products").insert([product]);

  if (error) {
    console.log(error);

    throw new Error("Could not create product");
  }

  return data;
}
