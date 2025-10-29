"use server";

import { getCategoryByName, newProduct } from "../data-services";
import { uploadProductImage } from "./upload-actions";

export async function createProduct(formData: FormData) {
  const productName = formData.get("productName") as string;
  const description = formData.get("description") as string;
  const file_ = formData.get("productImage") as File;
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat(formData.get("discount") as string);
  const discountType = formData.get("discountType") as string;
  const category = formData.get("category") as string;
  const target = formData.get("target") as string;

  if (!file_.type.startsWith("image/"))
    throw new Error("File must be an image!");
  if (file_.size > 1 * 1024 * 1024)
    throw new Error("File must be less than 2MB");

  const fileUrl = await uploadProductImage(file_);

  if (!category) return null;

  const getCategory = await getCategoryByName(category);
  if (!getCategory) throw new Error("Category not found!");

  const categoryID = getCategory.id;

  try {
    await newProduct({
      name: productName,
      description,
      quantity: 0,
      price,
      discount,
      discountType,
      categoryId: categoryID,
      target,
      imageUrl: fileUrl,
    });
  } catch (error) {
    throw new Error("Could not create product");
  }
}
