// /api/complete-onboarding/route.ts
import connect from "@/utils/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  await connect();
  const session = await getServerSession();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  await User.updateOne({ email: session.user.email }, { $set: { onhasOnboarded: false } });

  return Response.json({ success: true });
}
