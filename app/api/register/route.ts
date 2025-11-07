import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { username, email, password } = await request.json();

  await connect();

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return new NextResponse("Username is already taken", { status: 400 });
  }

  // Hash password (if provided)
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 5);
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("User registered successfully", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
