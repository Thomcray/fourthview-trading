import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getStoreSettings } from "@/app/_lib/settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const settings = await getStoreSettings();

  if (!settings?.storeEmail) {
    return NextResponse.json(
      { error: "Store email not configured." },
      { status: 500 },
    );
  }

  const { error } = await resend.emails.send({
    from: "Fourthview Contact Form <onboarding@resend.dev>",
    to: settings.storeEmail,
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
