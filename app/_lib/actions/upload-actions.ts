"use server";

import { supabase } from "../supabase";

export async function uploadProductImage(file: File) {
  const fileName = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  //   get image path from bucket
  const { data: publicUrlData } = await supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
