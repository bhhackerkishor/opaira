import { NextResponse } from "next/server";
import connect  from "@/utils/db";
import Tracking from "@/models/Tracking";

export async function POST({req}:{req:any}) {
  try {
    await connect();
    const body = await req.json();

    const { userId, eventName, page, data } = body;

    // Validation
    if (!userId || !eventName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save event
    await Tracking.create({
      userId,
      eventName,
      page,
      data,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Tracking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
