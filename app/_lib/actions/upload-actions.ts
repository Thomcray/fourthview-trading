"use server";

import { supabase } from "../supabase";

export async function uploadProductImage(file: File) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false, //prevents overwrite files with the same name
    });

  if (error) throw new Error(error.message);

  //   get image path from bucket
  const { data: publicUrlData } = await supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
