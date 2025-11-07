import { NextResponse } from "next/server";
import connect from "@/utils/db";
import UserProfile from "@/models/UserProfile";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect();
    if(params.id ==="undefined") return null;
    console.log(params.id)
    
    const user = await UserProfile.find({"email": `${params.id}`}); 
    console.log(user,"usere")
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}
