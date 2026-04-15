"use server";

import { getCategoryByName, newProduct } from "../data-services";
import { uploadProductImage } from "./upload-actions";

export async function createProduct(
  formData: FormData,
  colours: string[],
  images: File[],
) {
  // Extract all fields from FormData
  const productName = formData.get("productName") as string;
  const description = formData.get("description") as string;
  const productType = formData.get("type") as string;
  const sizes = formData.getAll("sizes") as string[];
  const weight = formData.get("weight") as string;
  const shippingCost = parseFloat(formData.get("shippingCost") as string);
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat(formData.get("discount") as string) || 0; // Default to 0
  const discountType = formData.get("discountType") as string;
  const category = formData.get("category") as string;
  const target = formData.get("target") as string;

  // Log what we received
  console.log("createProduct received:", {
    productName: productName || "MISSING!",
    description: description || "MISSING!",
    productType: productType || "MISSING!",
    category: category || "MISSING!",
    price: price || "MISSING!",
  });

  // Throw errors instead of returning null
  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  if (!category) {
    throw new Error("Category is required"); // ← FIXED: Was returning null
  }

  const getCategory = await getCategoryByName(category);
  if (!getCategory) {
    throw new Error(`Category "${category}" not found!`);
  }

  const categoryID = getCategory.id;

  // Upload images
  const uploadedImageUrls: string[] = [];

  for (const file of images) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`Invalid file type: ${file.name} must be an image`);
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error(`File ${file.name} must be less than 2MB!`);
    }

    const fileUrl = await uploadProductImage(file);
    if (fileUrl) uploadedImageUrls.push(fileUrl);
  }

  // Create product and return result
  try {
    const result = await newProduct({
      name: productName.trim(),
      description: description,
      productType,
      colours,
      quantity: 0,
      price,
      discount: isNaN(discount) ? 0 : discount,
      discountType: discountType,
      categoryId: categoryID,
      target: target,
      imageUrl: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
      sizes: sizes.length > 0 ? sizes : [],
      weight: weight,
      shippingCost: shippingCost,
    });

    return { success: true, product: result };
  } catch (error) {
    console.error("newProduct failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Could not create product",
    );
  }
}
