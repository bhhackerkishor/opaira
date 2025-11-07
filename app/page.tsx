"use client";
import React from "react";
import { motion } from "framer-motion";
//import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      

      {/* HERO */}
      <main className="relative pt-28">
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Open up. <span className="text-yellow-600">Pair up. Speak up.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-gray-700 text-lg"
            >
              Opaira connects you to real people for short, meaningful conversations — voice or chat — so you can practice English and build confidence.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex gap-4">
              <a href="/" className="rounded-full bg-yellow-500 px-6 py-3 text-white font-semibold shadow hover:bg-yellow-600 transition">Get Started</a>
              <a href="#features" className="rounded-full border border-yellow-200 px-6 py-3 text-yellow-700 font-semibold hover:bg-yellow-50 transition">See Features</a>
            </motion.div>

            <motion.div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
              <div className="bg-white/60 p-2 rounded-full shadow-sm">
                {/* placeholder icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 1v22" stroke="#111827" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div className="text-xs">Early testers:</div>
                <div className="font-medium">Join the waitlist — limited early access</div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="w-full max-w-lg">
            {/* Hero illustration placeholder */}
            <div className="p-8 flex items-center justify-center">
              <img src="/hero.png" alt="Opaira hero" className="w-full h-auto max-h-96" />
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-yellow-600">Features</h2>
            <p className="text-center text-gray-600 mt-2">Designed for practice, speed, and safety.</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Quick Voice Pairing", desc: "Instant 1-on-1 voice matches — jump in and speak within seconds." },
                { title: "Topic Prompts", desc: "Begin with guided questions when you want a little help starting the conversation." },
                { title: "Profile Preferences", desc: "Match by level, goal, or interest — control your experience." },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 * i }} className="p-6 rounded-2xl bg-yellow-50/40 border border-yellow-100">
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-600 mt-2">Simple steps to start speaking confidently.</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Create Profile", desc: "Tell us your name, level and goal." },
                { step: "2", title: "Find Partner", desc: "Tap Find — get paired randomly or by interest." },
                { step: "3", title: "Start Speaking", desc: "Short calls, guided prompts, and friendly practice." },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 * i }} className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="text-yellow-600 font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center bg-yellow-50 mb-3">{s.step}</div>
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-gray-600 mt-2">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-yellow-50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Early Feedback</h2>
            <p className="text-gray-600 mt-2">We’re testing with real learners — here’s what they say.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Priya, India", text: "I improved my confidence in just a week!" },
                { name: "Ahmed, Egypt", text: "Quick matches and helpful topics." },
                { name: "Lina, Spain", text: "Love the friendly vibe and short calls." },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="font-medium text-gray-800">{t.name}</div>
                  <p className="text-gray-600 mt-2">&quot;{t.text}&quot;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">Ready to speak with real people?</motion.h3>
            <p className="text-gray-600 mt-2">Join the early waitlist and start practicing today.</p>
            <div className="mt-6">
              <a href="/" className="rounded-full bg-yellow-500 px-8 py-3 font-semibold text-white shadow hover:bg-yellow-600">Join Waitlist</a>
            </div>
          </div>
        </section>

        <footer className="py-8 bg-white border-t border-yellow-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo 1.png" alt="Opaira" className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-sm font-semibold text-gray-800">Opaira</div>
                <div className="text-xs text-gray-500">Open up. Pair up. Speak up.</div>
              </div>
            </div>

            <div className="text-sm text-gray-500">© {new Date().getFullYear()} Opaira · All rights reserved</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
