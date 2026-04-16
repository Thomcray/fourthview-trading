"use server";

import { getCategoryByName, updateCurrentProduct } from "../data-services";
import { createClient } from "../supabase-server";
import { uploadProductImage } from "./upload-actions";

export async function updateProduct(
  productId: number,
  formData: FormData,
  colours: string[],
  images: File[],
) {
  const productName = formData.get("productName") as string;
  const description = formData.get("description") as string;
  const productType = formData.get("type") as string;
  const sizes = formData.getAll("sizes") as string[];
  const weight = formData.get("weight") as string;
  const shippingCost = parseFloat(formData.get("shippingCost") as string);
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat(formData.get("discount") as string);
  const discountType = formData.get("discountType") as string;
  const category = formData.get("category") as string;
  const target = formData.get("target") as string;

  if (!category) return null;

  const getCategory = await getCategoryByName(category);
  if (!getCategory) return { status: "error", message: "Category not found!" };

  const categoryID = getCategory.id;

  // upload images
  const uploadedImageUrls: string[] = [];

  for (const file of images) {
    if (!file.type.startsWith("image/"))
      throw new Error(`Invalid file type: ${file.name} must be an image`);
    if (file.size > 2 * 1024 * 1024)
      throw new Error("File must be less than 2MB!");

    const fileURl = await uploadProductImage(file);
    if (fileURl) uploadedImageUrls.push(fileURl);
  }

  const supabase = await createClient(true); // admin

  //   fetch current product images from db and merge with the new image(s)
  const { data: productData, error: fetchError } = await supabase
    .from("products")
    .select("imageUrl")
    .eq("id", productId)
    .single();

  if (fetchError) throw new Error("Could not fetch product data");

  //   Merge with new image(s)
  const mergedImages = [...(productData?.imageUrl || []), ...uploadedImageUrls];

  try {
    await updateCurrentProduct(
      {
        name: productName,
        description,
        productType,
        sizes,
        weight,
        shippingCost,
        colours,
        quantity: 0,
        price,
        discount,
        discountType,
        categoryId: categoryID,
        target,
        imageUrl: mergedImages,
      },
      productId,
    );
  } catch {
    throw new Error("Could not update product");
  }
}

export async function deleteExistingImage(
  imageUrl: string,
  productId?: number,
) {
  const supabase = await createClient(true); // admin

  try {
    const partPath = imageUrl.split("/");
    const fileName = partPath[partPath.length - 1].split("?")[0]; // remove query params | token;

    const { error } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (error) {
      throw new Error("Could not delete image: " + error.message);
    }

    // get current product data with imageUrl
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("imageUrl")
      .eq("id", productId)
      .single();

    if (productError) {
      throw new Error("Could not fetch product data: " + productError.message);
    }

    // Remove the image Url from the product's imageUrl array
    const updatedImageUrls = productData.imageUrl.filter(
      (url: string) => url !== imageUrl,
    );

    // Update the product record with the new imageUrl array
    const { error: updateError } = await supabase
      .from("products")
      .update({ imageUrl: updatedImageUrls })
      .eq("id", productId);

    if (updateError) {
      throw new Error(
        "Could not update product images: " + updateError.message,
      );
    }

    return { success: true };
  } catch (error) {
    throw new Error("Could not delete image: " + (error as Error).message);
  }
}
