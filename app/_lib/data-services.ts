import { createClient } from "./supabase-server";
import countriesData from "./countries.json";
import { PRODUCT_COLUMNS } from "./products-query";

type SpecialOrder = {
  email: string;
  description: string;
  userId: string;
  images: string[];
  whatsapp: string;
  deposit_amount: number;
  deposit_reference: string;
  deposit_status: "paid";
  deposit_paid_at?: string | null;
};

type Car = {
  brandName: string;
  year: number;
  condition: string;
  mileage: number;
  price: number;
  shippingCost: number;
  clearingCost: number;
  totalPrice: number;
  imageUrl: string[];
};

export async function getUserRole(id: number) {
  const supabase = await createClient(true);

  const { data: userRole, error } = await supabase
    .from("userRole")
    .select("*")
    .eq("userId", id)
    .single();

  if (error) throw new Error("Not admin");

  return userRole;
}

export async function getTempUserByToken(token: string) {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from("tempUsers")
    .select("*")
    .eq("token", token)
    .single();

  if (error) throw new Error("Invalid or expired token");

  return data;
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient(true);
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

export async function getUserByPhone(phone: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("Error checking phone number:", error);
    return null;
  }

  return data;
}

export function getCountries() {
  return countriesData;
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
  const supabase = await createClient(true);
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
  const supabase = await createClient(true);
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
    .select(PRODUCT_COLUMNS);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return products ?? [];
}

export async function getProductById(id: number) {
  const supabase = await createClient();
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

export async function newSpecialOrders(order: SpecialOrder) {
  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("specialOrders")
    .insert([
      {
        email: order.email,
        description: order.description,
        userId: order.userId,
        images: order.images,
        whatsapp: order.whatsapp,
        deposit_amount: order.deposit_amount,
        deposit_reference: order.deposit_reference,
        deposit_status: order.deposit_status,
        deposit_paid_at: order.deposit_paid_at ?? new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Special order database error:", error);
    throw new Error("Error placing special order. Try again!");
  }

  return data;
}

export async function updateSpecialOrderImages(id: number, images: string[]) {
  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("specialOrders")
    .update({ images })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Special order image update error:", error);
    throw new Error("Could not attach special-order images.");
  }

  return data;
}

export async function newCar(car: Car) {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from("cars")
    .insert([car])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Could not create car");
  }

  return data;
}

export async function getAllCars() {
  const supabase = await createClient();

  const { data: cars, error } = await supabase
    .from("cars")
    .select(
      "id, created_at, brandName, year, condition, mileage, price, shippingCost, clearingCost, totalPrice, imageUrl",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch cars:", error.message);
    return [];
  }

  return cars ?? [];
}

export async function getCarById(id: number) {
  const supabase = await createClient();

  const { data: car, error } = await supabase
    .from("cars")
    .select(
      "id, created_at, brandName, year, condition, mileage, price, shippingCost, clearingCost, totalPrice, imageUrl, sold",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch car:", error.message);
    return null;
  }

  return car;
}

export async function updateCurrentCar(car: Partial<Car>, carId: number) {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from("cars")
    .update(car)
    .eq("id", carId);

  if (error) {
    throw new Error("Could not update car");
  }

  return data;
}
