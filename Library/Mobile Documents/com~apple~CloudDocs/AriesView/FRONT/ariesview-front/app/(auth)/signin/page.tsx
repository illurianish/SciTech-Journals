"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInUser } from "@/app/firebase/authenticationService";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    signInUser(email, password)
      .then(() => {
        router.push("/operations-dashboard/home");
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setError("Login Error.");
      });

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Title Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
        <p className="text-gray-600">Sign in to your AriesView account</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full py-3 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  href="/reset-password"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full py-3 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="btn w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-200 flex justify-center items-center shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      {/* Signup Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            className="text-blue-600 hover:text-blue-800 font-medium"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
