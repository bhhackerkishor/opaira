import connect from "@/utils/db";
import Redirect from "@/models/Redirect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const redirect = await Redirect.findOne({ user: user._id });
  return new Response(JSON.stringify(redirect), { status: 200 });
}

export async function POST(req: Request) {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const body = await req.json();

  let redirect = await Redirect.findOne({ user: user._id });

  if (redirect) {
    redirect.links = body.links || redirect.links;
    redirect.defaultRedirect = body.defaultRedirect || redirect.defaultRedirect;
    redirect.qrCodeUrl = body.qrCodeUrl || redirect.qrCodeUrl;
    await redirect.save();
  } else {
    redirect = await Redirect.create({
      user: user._id,
      links: body.links || {},
      defaultRedirect: body.defaultRedirect,
      qrCodeUrl: body.qrCodeUrl,
    });
  }

  return new Response(JSON.stringify(redirect), { status: 200 });
}
