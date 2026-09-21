import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createClient } from "@/app/_lib/supabase-server";
import { getUserByEmail } from "@/app/_lib/data-services";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email address.",
        },
        { status: 400 },
      );
    }

    const genericMessage =
      "If an account exists with that email, a password reset link has been sent.";

    const user = await getUserByEmail(email);

    // Do not reveal whether an account exists.
    if (!user) {
      return NextResponse.json({
        success: true,
        message: genericMessage,
      });
    }

    const supabase = await createClient(true);

    // Remove previous unused reset tokens for this user.
    const { error: deleteError } = await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("user_id", user.id)
      .is("used_at", null);

    if (deleteError) {
      console.error("Failed to remove old password reset tokens:", deleteError);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong. Please try again.",
        },
        { status: 500 },
      );
    }

    // Generate a cryptographically secure reset token.
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    // Reset link expires after 10 minutes.
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Failed to create password reset token:", insertError);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong. Please try again.",
        },
        { status: 500 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/reset-password?token=` + encodeURIComponent(token);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: mailError } = await resend.emails.send({
      from: "Fourthview <onboarding@fourthview.online>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">
            Reset your password
          </h1>

          <p>
            Hello ${user.firstName || "there"},
          </p>

          <p>
            We received a request to reset the password for your
            Fourthview Trading account.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <p style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 10 minutes and can only be used once.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Fourthview Trading
          </p>
        </div>
      `,
    });

    if (mailError) {
      console.error("Resend password reset error:", mailError);

      // Remove the token if the email could not be sent.
      await supabase
        .from("password_reset_tokens")
        .delete()
        .eq("token_hash", tokenHash);

      return NextResponse.json(
        {
          success: false,
          message: "Could not send the password reset email.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
