// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, SessionStrategy } from "next-auth";
import bcrypt from "bcryptjs";
import connect from "@/utils/db";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();

        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("No user found");
        if (!user.password) throw new Error("Use OAuth provider to login");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid password");
        console.log(user)
        
        return { id: user._id.toString(), email: user.email, name: user.username ,hasOnboarded: user.hasOnboarded };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Runs whenever token is created or updated
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.hasOnboarded = user.hasOnboarded ?? false; // ✅ add explicitly
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.hasOnboarded = token.hasOnboarded ?? false; // ✅ persist here too
      }
      return session;
    },
  },
  
  
};