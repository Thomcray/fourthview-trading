import { supabase } from "./../../_lib/supabase";
import { getUserByEmail } from "@/app/_lib/data-services";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const address = formData.get("address") as string;
    const countryCode = formData.get("countryCode") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // NEW
    const streetAddress = formData.get("streetAddress") as string;
    const apartment = formData.get("apartment") as string;
    const city = formData.get("city") as string;
    const zipCode = formData.get("zipCode") as string;

    const token = uuidv4();

    const passwordCheck =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!passwordCheck.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * first check if user already exist in db
     * if already exist, throw Error "User already exists"
     * else store new user in temp location in db
     * then send verify token to user email
     */

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 400 },
      );
    }

    //convert expiry to iso string to prevent timezone issues
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 10).toISOString(); // valid for 10 minutes

    // store user in temp location in db - ADD the new fields here
    const { error } = await supabase.from("tempUsers").insert({
      firstName,
      lastName,
      email,
      country,
      address, // Keep original for compatibility
      countryCode,
      phone,
      password: hashedPassword,
      token,
      tokenExpiry,
      // NEW
      streetAddress,
      apartment,
      city,
      zipCode,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Something went wrong." },
        { status: 500 },
      );
    }

    // Send confirmation email containing token to user
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: mailErr } = await resend.emails.send({
      from: "Fourthview <onboarding@resend.dev>",
      to: email,
      subject: "Confirm your email",
      html: `<h1>Hello, ${firstName}!</h1>
      <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
      <a href="http://localhost:3000/verify-email?token=${token}">Confirm Email</a>
      <p>This link will expire in 10 minutes. </p>
      
      <p>If you did not sign up for this account, please ignore this email.</p>`,
    });

    if (mailErr) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not send email",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error", error);
    return NextResponse.json(
      {
        success: false,
        message: error || "Internal server error",
      },
      { status: 500 },
    );
  }
}
