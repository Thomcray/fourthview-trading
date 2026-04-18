"use server";

import { createClient } from "../supabase-server";

export async function uploadProductImage(file: File) {
  const supabase = await createClient(true); // admin - storage operations need service role

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  return fileName;
}
