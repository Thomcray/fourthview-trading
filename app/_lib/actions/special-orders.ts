"use server";

import { newSpecialOrders } from "../data-services";
import { uploadProductImage } from "./upload-actions";

export async function specialOrders(
  formData: FormData,
  userId: string | undefined,
  orderImages: File[],
) {
  const email = formData.get("email") as string;
  const description = formData.get("description") as string;
  const whatsapp = formData.get("whatsapp") as string;

  if (!userId) throw new Error("User ID is required");
  if (!email) throw new Error("User email not found!");
  if (!whatsapp) throw new Error("WhatsApp number is required");

  // upload images
  const uploadedImageUrls: string[] = [];

  for (const file of orderImages) {
    if (!file.type.startsWith("image/"))
      throw new Error(`Invalid file type: ${file.name} must be an image`);
    if (file.size > 2 * 1024 * 1024)
      throw new Error("File must be less than 2MB!");

    const fileURl = await uploadProductImage(file);
    if (fileURl) uploadedImageUrls.push(fileURl);
  }

  try {
    await newSpecialOrders({
      email,
      description,
      userId,
      images: uploadedImageUrls,
      whatsapp,
    });
  } catch {
    throw new Error("Could not submit special order.");
  }
}
