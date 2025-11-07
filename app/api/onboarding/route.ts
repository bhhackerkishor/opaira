import { NextResponse } from "next/server";
import  connect  from "@/utils/db";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import UserProfile from "@/models/UserProfile";

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const { name, gender, level, goal ,nativeLanguage,country} = body;
    //console.log(body,"body")
    

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const session = await getServerSession();
    const userEmail=session?.user?.email;

    const newUser = await UserProfile.create({ name, email: userEmail, level, goal ,nativeLanguage ,country,gender});
    
    
    
    if (!userEmail) return new Response("Unauthorized", { status: 401 });
    const res = await User.updateOne({ email: userEmail }, { $set: { hasOnboarded: true } });
    
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
