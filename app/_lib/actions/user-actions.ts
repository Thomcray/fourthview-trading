"use server";

import { revalidatePath } from "next/cache";
import { getTempUserByToken } from "../data-services";
import { supabase } from "../supabase";

export async function createUser(token: string) {
  if (!token) return { success: false, message: "Missing token" };

  const record = await getTempUserByToken(token);
  if (!record) return { success: false, message: "Invalid or expired token" };

  const now = Date.now();
  const expiry = new Date(record.tokenExpiry).getTime();

  if (now > expiry) return { success: false, message: "Token expired" };

  const addressParts = [
    record.streetAddress,
    record.apartment,
    record.city,
    record.zipCode,
  ].filter((part) => part && part.trim() !== "");

  const fullAddress = addressParts.join(", ");

  const { data, error } = await supabase
    .from("users")
    .insert({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      country: record.country,
      countryCode: record.countryCode,
      phone: record.phone,
      password: record.password,
      isVerified: true,
      address: record.address || fullAddress,
      streetAddress: record.streetAddress,
      apartment: record.apartment,
      city: record.city,
      zipCode: record.zipCode,
    })
    .select()
    .single();

  if (error) throw new Error(`User could not be created: ${error.message}`);

  const { error: deleteError } = await supabase
    .from("tempUsers")
    .delete()
    .eq("id", record.id);

  if (deleteError) {
    throw new Error("Could not delete temp user.");
  }

  return { success: true, message: "User created successfully", data };
}

export async function updateUserProfile(
  countryCode: string,
  phone: string,
  country: string,
  address: string,
  userId: string,
  streetAddress?: string,
  apartment?: string,
  city?: string,
  zipCode?: string,
) {
  const updateData = {
    phone,
    country,
    address,
    countryCode,
    ...(streetAddress !== undefined && { streetAddress }),
    ...(apartment !== undefined && { apartment }),
    ...(city !== undefined && { city }),
    ...(zipCode !== undefined && { zipCode }),
  };

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) throw new Error(`Could not update user: ${error.message}`);

  revalidatePath("/account/profile");
}
