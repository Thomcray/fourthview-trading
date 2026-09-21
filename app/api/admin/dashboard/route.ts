import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const { data, error } = await supabase.rpc("get_admin_dashboard");

    if (error) {
      console.error("Admin dashboard RPC error:", error);

      return NextResponse.json(
        { error: "Failed to fetch dashboard data" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin dashboard route error:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
