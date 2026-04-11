import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  const { data: booking, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }

  // Send email notification via Resend
  try {
    const { error: emailError } = await resend.emails.send({
      from: "FourthView <no-reply@yourdomain.com>",
      to: booking.email,
      subject: `Your booking has been ${status}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">Booking Status Update</h2>
          <p>Hi ${booking.firstName},</p>
          <p>Your booking for <strong>${booking.purpose}</strong> has been <strong>${status}</strong>.</p>
          ${booking.factoryName ? `<p>Factory: ${booking.factoryName}</p>` : ""}
          ${booking.visitDate ? `<p>Visit Date: ${new Date(booking.visitDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
          <p>If you have any questions, please contact our support team.</p>
          <br />
          <p>Thank you,<br/>FourthView Trading Company</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      // Status was updated but email failed — return partial success
      return NextResponse.json(
        {
          booking,
          warning: "Status updated but email notification failed to send.",
        },
        { status: 207 },
      );
    }
  } catch (err) {
    console.error("Email send exception:", err);
    return NextResponse.json(
      {
        booking,
        warning: "Status updated but email notification failed to send.",
      },
      { status: 207 },
    );
  }

  return NextResponse.json({ booking });
}
