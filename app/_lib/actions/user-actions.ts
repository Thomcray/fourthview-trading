"use server";

import { getTempUserByToken } from "../data-services";
import { supabase } from "../supabase";

export async function createUser(token: string) {
  if (!token) return { success: false, message: "Missing token" };

  /**
   * check if token exists in temp location containing user token
   * if email with token exists and token isn&apos;t expired, create user
   * else if expired token, return token expired
   * then, delete user in temp user table after user is created
   */

  // get user by token from temp location in db
  const record = await getTempUserByToken(token);
  if (!record) return { success: false, message: "Invalid or expired token" };

  const now = Date.now();
  const expiry = new Date(record.tokenExpiry).getTime();

  //  if current time is greater than expiry, token is expired
  if (now > expiry) return { success: false, message: "Token expired" };

  // proceed to create user
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
    })
    .select()
    .single();

  if (error) throw new Error("User could not be created.");

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
