// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, SessionStrategy } from "next-auth";
import bcrypt from "bcryptjs";
import connect from "@/utils/db";
import User from "@/models/User";

declare module "next-auth" {
  interface User {
    hasOnboarded?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      hasOnboarded?: boolean;
    };
  }

  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    hasOnboarded?: boolean;
  }
}

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
    async jwt({ token, user, trigger }) {
      // When user logs in for the first time
      if (user) {
        token.id = (user as any).id;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.hasOnboarded = (user as any).hasOnboarded ?? false;
      }
  
      // 🔄 When client calls `await update()` OR session refreshes
      if (trigger === "update" || !user) {
        try {
          await connect();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            token.hasOnboarded = dbUser.hasOnboarded;
          }
        } catch (err) {
          console.error("Error syncing JWT from DB:", err);
        }
      }
  
      return token;
    },
  
    async session({ session, token }) {
      if (!session.user) session.user = {} as any;
  
      session.user.id = token.id as string | undefined;
      session.user.name = token.name as string | null;
      session.user.email = token.email as string | null;
      session.user.hasOnboarded = token.hasOnboarded as boolean | undefined;
  
      return session;
    },
  },
  
  
  
};
