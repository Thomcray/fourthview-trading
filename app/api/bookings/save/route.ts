import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient(); // user context - their own booking

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
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  // Insert with trimmed values
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
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 },
    );
  }

  return NextResponse.json({ booking: data });
}
