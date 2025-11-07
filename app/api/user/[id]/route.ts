import { NextResponse } from "next/server";
import connect from "@/utils/db";
import UserProfile from "@/models/UserProfile";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await UserProfile.find({ email: params.id });

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}
