import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendBookingRequestEmail } from "@/app/_lib/email";
import { getStoreSettings } from "@/app/_lib/settings";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      purpose,
      factoryName,
      factoryAddress,
      visitDate,
    } = body;

    // Server-side validation
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !purpose?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Save booking
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          userId: session.user.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          purpose: purpose.trim(),
          factoryName: factoryName?.trim() || null,
          factoryAddress: factoryAddress?.trim() || null,
          visitDate: visitDate || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Booking insert error:", error);

      return NextResponse.json(
        { error: "Failed to save booking" },
        { status: 500 },
      );
    }

    // Notify the store/admin by email
    try {
      const settings = await getStoreSettings();

      if (settings?.storeEmail?.trim()) {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        await sendBookingRequestEmail({
          to: settings.storeEmail.trim(),
          bookingId: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          purpose: data.purpose,
          factoryName: data.factoryName,
          factoryAddress: data.factoryAddress,
          visitDate: data.visitDate,
          baseUrl,
        });
      } else {
        console.warn("Booking created, but no store email is configured.");
      }
    } catch (emailError) {
      // Booking was successfully created, so don't fail the request
      // just because the notification email failed.
      console.error("Booking notification email failed:", emailError);
    }

    return NextResponse.json(
      {
        booking: data,
        message: "Booking submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 },
    );
  }
}
