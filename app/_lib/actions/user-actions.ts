"use server";

import { revalidatePath } from "next/cache";
import { getTempUserByToken } from "../data-services";
import { supabase } from "../supabase";

export async function createUser(token: string) {
  if (!token) return { success: false, message: "Missing token" };

  /**
   * check if token exists in temp location containing user token
   * if email with token exists and token isn't expired, create user
   * else if expired token, return token expired
   * then, delete user in temp user table after user is created
   */

  // get user by token from temp location in db
  const record = await getTempUserByToken(token);
  if (!record) return { success: false, message: "Invalid or expired token" };

  const now = Date.now();
  const expiry = new Date(record.tokenExpiry).getTime();

  // if current time is greater than expiry, token is expired
  if (now > expiry) return { success: false, message: "Token expired" };

  // Create full address from components for backward compatibility
  const addressParts = [
    record.streetAddress,
    record.apartment,
    record.city,
    record.zipCode,
  ].filter((part) => part && part.trim() !== "");

  const fullAddress = addressParts.join(", ");

  // proceed to create user with all address fields
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
      // Address fields
      address: record.address || fullAddress, // Keep original for compatibility
      streetAddress: record.streetAddress,
      apartment: record.apartment,
      city: record.city,
      zipCode: record.zipCode,
    })
    .select()
    .single();

  if (error) throw new Error(`User could not be created: ${error.message}`);

  // delete user in temp location in db after user is created
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
  const updateData: any = {
    phone,
    country,
    address,
    countryCode,
    streetAddress,
    apartment,
    city,
    zipCode,
  };

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) throw new Error(`Could not update user: ${error.message}`);

  revalidatePath("/account/profile");
}
