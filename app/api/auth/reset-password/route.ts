import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createClient } from "@/app/_lib/supabase-server";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = typeof body.token === "string" ? body.token.trim() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset request.",
        },
        { status: 400 },
      );
    }

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

    const tokenHash = hashToken(token);

    const supabase = await createClient(true);

    const { data: resetToken, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("id, user_id, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (tokenError) {
      console.error("Password reset token lookup error:", tokenError);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong. Please request a new reset link.",
        },
        { status: 500 },
      );
    }

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message: "This password reset link is invalid or has expired.",
        },
        { status: 400 },
      );
    }

    const expiresAtMs = new Date(resetToken.expires_at).getTime();
    const nowMs = Date.now();

    if (resetToken.used_at) {
      return NextResponse.json(
        {
          success: false,
          message: "This password reset link has already been used.",
        },
        { status: 400 },
      );
    }

    if (expiresAtMs <= nowMs) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
      })
      .eq("id", resetToken.user_id);

    if (updateError) {
      console.error("Password update error:", updateError);

      return NextResponse.json(
        {
          success: false,
          message: "Could not update your password. Please try again.",
        },
        { status: 500 },
      );
    }

    // Mark the token as used so it cannot be reused.
    const { error: usedError } = await supabase
      .from("password_reset_tokens")
      .update({
        used_at: new Date().toISOString(),
      })
      .eq("id", resetToken.id);

    if (usedError) {
      console.error("Password reset token update error:", usedError);

      return NextResponse.json(
        {
          success: false,
          message:
            "Your password was changed, but the reset token could not be finalized.",
        },
        { status: 500 },
      );
    }

    // Remove any other unused reset tokens for this user.
    await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("user_id", resetToken.user_id)
      .is("used_at", null);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
