"use server";

import { newCar } from "../data-services";
import { uploadProductImage } from "./upload-actions";

export async function createCar(formData: FormData, images: File[]) {
  // Extract all fields from FormData
  const brandName = formData.get("brandName") as string;
  const year = parseInt(formData.get("year") as string);
  const condition = formData.get("condition") as string;
  const mileage = parseInt(formData.get("mileage") as string) || 0;
  const price = parseFloat(formData.get("price") as string);
  const shippingCost = parseFloat(formData.get("shippingCost") as string);
  const clearingCost = parseFloat(formData.get("clearingCost") as string);
  const totalPrice = parseFloat(formData.get("totalPrice") as string);

  // Validation
  if (!brandName?.trim()) {
    throw new Error("Brand name is required");
  }

  if (!year || isNaN(year)) {
    throw new Error("A valid year is required");
  }

  if (!condition || !["New", "Used"].includes(condition)) {
    throw new Error("Condition is required");
  }

  if (condition === "Used" && (isNaN(mileage) || mileage < 0)) {
    throw new Error("Mileage is required for used cars");
  }

  if (isNaN(price)) {
    throw new Error("A valid car price is required");
  }

  if (isNaN(shippingCost)) {
    throw new Error("A valid shipping cost is required");
  }

  if (isNaN(clearingCost)) {
    throw new Error("A valid clearing cost is required");
  }

  // Upload images
  if (images.length === 0) {
    throw new Error("At least one car image is required");
  }

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

  // Fall back to computing the total server-side if missing
  const finalTotalPrice = isNaN(totalPrice)
    ? price + shippingCost + clearingCost
    : totalPrice;

  // Create car and return result
  try {
    const result = await newCar({
      brandName: brandName.trim(),
      year,
      condition,
      mileage,
      price,
      shippingCost,
      clearingCost,
      totalPrice: finalTotalPrice,
      imageUrl: uploadedImageUrls,
    });

    return { success: true, car: result };
  } catch (error) {
    console.error("newCar failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Could not create car",
    );
  }
}
