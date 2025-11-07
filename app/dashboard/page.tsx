"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User as ProfileIcon,
  Target,
  Languages,
  TrendingUp,
  Trophy,
} from "lucide-react";
import SettingsMenu from "@/components/SettingsMenu";

type UserData = {
  xp: number;
  name: string;
  learningLanguage: string;
  level: string;
  goal: string;
  email: string;
  joinedAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${session?.user?.email}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data[0]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  if (status === "loading" || !user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading your dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  const xpLevel = Math.floor(user.xp / 100);
  const xpProgress = user.xp % 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100/60 via-white to-yellow-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Hey, <span className="text-yellow-600">{user.name}</span> 👋
          </h1>
          
          
          
          <SettingsMenu/>
          
          
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md border border-yellow-200 shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="bg-yellow-100 p-5 rounded-full shadow-md">
            <ProfileIcon className="w-12 h-12 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-1 flex items-center gap-1">
              <Languages size={16} /> Learning:{" "}
              <span className="text-yellow-700 font-medium">
                {user.learningLanguage}
              </span>
            </p>
            <p className="text-gray-600 mt-1 flex items-center gap-1">
              <TrendingUp size={16} /> Level:{" "}
              <span className="text-yellow-700 font-medium">{user.level}</span>
            </p>
            <p className="text-gray-600 mt-1 flex items-center gap-1">
              <Target size={16} /> Goal:{" "}
              <span className="text-yellow-700 font-medium">{user.goal}</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Joined on {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {/* XP Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 text-white shadow-lg rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">XP Progress</h3>
            <div className="flex items-center gap-1 text-sm">
              <Trophy size={16} /> Level {xpLevel}
            </div>
          </div>
          <div className="w-full bg-yellow-200/40 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-white h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 text-sm opacity-90">
            {user.xp} XP • {100 - xpProgress} XP to next level
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: "Start Conversation", href: "/Talk", emoji: "🎙️" },
            { label: "Daily Challenge", href: "/dashboard", emoji: "🔥" },
            { label: "View Stats", href: "/dashboard", emoji: "📊" },
          ].map((btn, idx) => (
            <Link
              key={idx}
              href={btn.href}
              className="bg-white/80 hover:bg-yellow-50 border border-yellow-200 shadow-md text-gray-800 rounded-2xl text-center py-6 text-lg font-semibold transition-all hover:scale-[1.02]"
            >
              {btn.emoji} {btn.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
