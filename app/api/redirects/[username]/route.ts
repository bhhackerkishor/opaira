import { NextResponse } from "next/server";
import connect from "@/utils/db"; // your db connection utility
import Redirect from "@/models/Redirect"; // your mongoose model

// GET /api/redirects/:username
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  await connect();

  try {
    const { username } = params;

    const userRedirect = await Redirect.findOne({ username });
	console.log(userRedirect)

    if (!userRedirect) {
      return NextResponse.json(
        { error: "Redirect not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ GoodOne:userRedirect.defaultRedirect });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
