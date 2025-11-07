"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    country: "",
    nativeLanguage: "",
    learningLanguage: "English",
    level: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {  update } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    console.log(res)

    if (res.ok){
      const ress=await update(); // 🔄 refresh session so session.user.hasOnboarded = true
      console.log(ress)
      router.push("/Talk");
      
    } 


    else alert("Something went wrong");

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-white to-yellow-50 flex justify-center items-center px-4 mt-20">
      <div className=" w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-2">Welcome to TalkPair 👋</h1>
        <p className="text-gray-600 text-center mb-8">
          Let’s personalize your learning experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2 font-medium">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2 font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="e.g. India"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2 font-medium">Native Language</label>
              <input
                type="text"
                name="nativeLanguage"
                value={form.nativeLanguage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="e.g. Tamil"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2 font-medium">Learning Language</label>
              <select
                name="learningLanguage"
                value={form.learningLanguage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option>English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">Your English Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="">Select</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2 font-medium">Your Goal</label>
            <input
              type="text"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="e.g. Improve fluency, speak naturally"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Saving..." : "Continue →"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our <span className="text-yellow-600 cursor-pointer">Terms</span> and{" "}
            <span className="text-yellow-600 cursor-pointer">Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
}
