"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { login, resetPassword, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
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

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setIsResetting(true);

    try {
      const response = await resetPassword(resetEmail);
      if (response.success) {
        setResetMessage(response.message);
        setResetEmail("");
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage("");
        }, 4000);
      } else {
        setResetError(response.message);
      }
    } catch {
      setResetError("An error occurred. Please try again.");
    } finally {
      setIsResetting(false);
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
          <h1 className="font-display text-4xl text-[#E3A857]">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-[#8B92A5] mt-2">
            Log in to manage your watchlist
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showForgotPassword ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8B92A5] hover:text-[#E3A857] transition-colors"
                  >
                    {showPassword ? (
                      <VisibilityOff className="w-5 h-5" />
                    ) : (
                      <Visibility className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#E3A857] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
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
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-sm mb-1 text-gray-700 dark:text-[#8B92A5]"
                  htmlFor="resetEmail"
                >
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetError("");
                    setResetMessage("");
                  }}
                  className="w-full rounded-lg bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] px-4 py-2.5 text-gray-900 dark:text-[#F2F0EA] focus:outline-none focus:border-[#E3A857] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {resetError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {resetError}
                </motion.p>
              )}

              {resetMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-sm"
                >
                  {resetMessage}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isResetting}
                className="w-full rounded-full bg-[#E3A857] text-white dark:text-[#0B0F1A] px-6 py-2.5 text-sm font-semibold hover:bg-[#F5C518] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetError("");
                  setResetMessage("");
                }}
                className="w-full text-sm text-gray-500 dark:text-[#8B92A5] hover:text-[#E3A857] transition-colors"
              >
                ← Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-sm text-gray-500 dark:text-[#8B92A5] text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#E3A857] hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
