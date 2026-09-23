import { createClient } from "./../../_lib/supabase-server";
import { getUserByEmail, getUserByPhone } from "@/app/_lib/data-services";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName")?.toString().trim() || "";
    const lastName = formData.get("lastName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const country = formData.get("country")?.toString().trim() || "";
    const address = formData.get("address")?.toString().trim() || "";
    const countryCode = formData.get("countryCode")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    // Address fields
    const streetAddress =
      formData.get("streetAddress")?.toString().trim() || "";
    const apartment = formData.get("apartment")?.toString().trim() || "";
    const city = formData.get("city")?.toString().trim() || "";
    const zipCode = formData.get("zipCode")?.toString().trim() || "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !country ||
      !countryCode ||
      !phone ||
      !password ||
      !streetAddress ||
      !city ||
      !zipCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 },
      );
    }

    const token = uuidv4();

    const passwordCheck =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

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

    // Check if email already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        { status: 400 },
      );
    }

    // Check if phone number already exists
    const existingPhone = await getUserByPhone(phone);

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number already exists.",
        },
        { status: 400 },
      );
    }

    // Token expires in 10 minutes
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 10).toISOString();

    const supabase = await createClient(true);

    // Store temporary user data
    const { error } = await supabase.from("tempUsers").insert({
      firstName,
      lastName,
      email,
      country,
      address,
      countryCode,
      phone,
      password: hashedPassword,
      token,
      tokenExpiry,
      streetAddress,
      apartment,
      city,
      zipCode,
    });

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong.",
        },
        { status: 500 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(
      token,
    )}`;

    // Send confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: mailErr } = await resend.emails.send({
      from: "Fourthview <onboarding@fourthview.online>",
      to: email,
      subject: "Confirm your email",
      html: `
        <h1>Hello, ${firstName}!</h1>

        <p>
          Thank you for signing up. Please confirm your email address
          by clicking the link below:
        </p>

        <a href="${verificationUrl}">
          Confirm Email
        </a>

        <p>This link will expire in 10 minutes.</p>

        <p>
          If you did not sign up for this account, please ignore this email.
        </p>
      `,
    });

    if (mailErr) {
      console.error("Resend error:", mailErr);

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
    console.error("Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
