"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "@/components/Loader";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await signup(name, email, password);
      if (response.success) {
        router.push("/");
      } else {
        setError(response.message);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-16 bg-gray-50 dark:bg-[#0B0F1A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[#E3A857]">Create Account</h1>
          <p className="text-gray-500 dark:text-[#8B92A5] mt-2">Join us and start your movie journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8B92A5] hover:text-[#E3A857] transition-colors"
              >
                {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8B92A5] hover:text-[#E3A857] transition-colors"
              >
                {showConfirmPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#E3A857] text-white dark:text-[#0B0F1A] px-6 py-2.5 text-sm font-semibold hover:bg-[#F5C518] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isLoading ? (
              <>
                <Loader size="sm" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 dark:text-[#8B92A5] text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E3A857] hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </section>
  );
}