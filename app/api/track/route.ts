import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import TrackModel from "@/models/Tracking";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json(); // <-- THIS fixes your error

    await TrackModel.create({
      userId: body.userId,
      eventName: body.eventName,
      page: body.page,
      data: body.data || {},
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Error saving event" }, { status: 500 });
  }
}
