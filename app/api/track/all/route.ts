import { NextResponse } from "next/server";
import Tracking from "@/models/Tracking";
import connect from "@/utils/db";

export async function GET() {
    try {
    await connect();
    const events = await Tracking.find().sort({ timestamp: -1 });
    return NextResponse.json({ events });
    } catch (err) {
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
    }
    }