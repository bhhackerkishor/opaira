// app/403/page.tsx
import { Shield, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-black flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <Shield className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-red-600 mb-3">403</h1>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Restricted Access
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Only <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">kishornaveen2193@gmail.com</code> can access this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
          <a
            href="mailto:kishornaveen2193@gmail.com"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            <Mail className="w-4 h-4" />
            Contact Admin
          </a>
        </div>
      </div>
    </div>
  );
}