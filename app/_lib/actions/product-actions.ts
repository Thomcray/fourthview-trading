"use server";

import { getCategoryByName, newProduct } from "../data-services";
import { uploadProductImage } from "./upload-actions";

export async function createProduct(
  formData: FormData,
  colours: string[],
  images: File[]
) {
  const productName = formData.get("productName") as string;
  const description = formData.get("description") as string;
  const productType = formData.get("type") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat(formData.get("discount") as string);
  const discountType = formData.get("discountType") as string;
  const category = formData.get("category") as string;
  const target = formData.get("target") as string;

  // if (!file_.type.startsWith("image/"))
  //   throw new Error("File must be an image!");
  // if (file_.size > 1 * 1024 * 1024)
  //   throw new Error("File must be less than 2MB");

  // const fileUrl = await uploadProductImage(file_);

  if (!category) return null;

  const getCategory = await getCategoryByName(category);
  if (!getCategory) throw new Error("Category not found!");

  const categoryID = getCategory.id;

  // upload images
  const uploadedImageUrls: string[] = [];

  for (const file of images) {
    if (!file.type.startsWith("image/"))
      throw new Error(`Invalid file type: ${file.name} must be an image`);
    if (file.size > 2 * 1024 * 1024)
      throw new Error("File must be less than 2MB!");

    const fileURl = await uploadProductImage(file);
    uploadedImageUrls.push(fileURl);
  }

  try {
    await newProduct({
      name: productName,
      description,
      productType,
      colours,
      quantity: 0,
      price,
      discount,
      discountType,
      categoryId: categoryID,
      target,
      imageUrl: uploadedImageUrls,
    });
  } catch {
    throw new Error("Could not create product");
  }
}
