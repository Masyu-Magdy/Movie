"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Email as EmailIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const {
    user,
    logout,
    isAuthenticated,
    isLoading: authLoading,
    userWatchlist,
    updateProfile,
  } = useAuth();
  const { mode } = useTheme();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const stats = {
    watchlist: userWatchlist.length,
    watched: 0,
    reviews: 0,
    rating: 0,
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  if (authLoading || !isAuthenticated) {
    return (
      <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)] flex items-center justify-center">
        {authLoading ? (
          <Loader size="lg" label="Loading your profile…" />
        ) : null}
      </section>
    );
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setSaveError("Name can't be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError("");
    const result = await updateProfile(name.trim());
    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
    } else {
      setSaveError(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const statCards = [
    {
      icon: <BookmarkIcon />,
      label: "Watchlist",
      value: stats.watchlist,
      color: "#E3A857",
    },
  ];

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-5xl mx-auto mt-8 ">
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-6 md:p-8 md:flex justify-between"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="profile-avatar">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-[#E3A857] to-[#F5C518] flex items-center justify-center text-4xl font-display text-[#0B0F1A]">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="avatar-ring" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field flex-1 max-w-xs"
                        placeholder="Your name"
                      />
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setSaveError("");
                          setName(user?.name || "");
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-display text-2xl md:text-3xl text-[var(--text-primary)]">
                        {user?.name}
                      </h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[#E3A857] transition-colors"
                        aria-label="Edit profile"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </button>
                    </>
                  )}
                </div>

                {saveError && (
                  <p className="text-red-500 text-xs mt-1">{saveError}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
                  <EmailIcon sx={{ fontSize: 16 }} />
                  <span>{user?.email}</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogoutIcon sx={{ fontSize: 18 }} />
                    Sign Out
                  </button>
                  <Link
                    href="/watchlist"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[#E3A857] hover:bg-[#E3A857]/10 rounded-lg transition-colors"
                  >
                    <BookmarkIcon sx={{ fontSize: 18 }} />
                    View Watchlist
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='md:mt-0 mt-5'
            >
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="card px-24 py-12 text-center"
                >
                  <div
                    className="flex justify-center mb-2"
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-display text-[var(--text-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6 md:p-8 mt-6"
        >
          <h2 className="font-display text-xl text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <HistoryIcon className="text-[#E3A857]" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {stats.watchlist > 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-input)]">
                <div className="p-2 rounded-full bg-[#E3A857]/10">
                  <BookmarkIcon
                    className="text-[#E3A857]"
                    sx={{ fontSize: 20 }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">
                    You have{" "}
                    <span className="font-semibold text-[#E3A857]">
                      {stats.watchlist}
                    </span>{" "}
                    movies in your watchlist
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Keep discovering new movies!
                  </p>
                </div>
                <Link
                  href="/watchlist"
                  className="text-sm text-[#E3A857] hover:underline"
                >
                  View all →
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-input)]">
                <div className="p-2 rounded-full bg-[#E3A857]/10">
                  <MovieIcon className="text-[#E3A857]" sx={{ fontSize: 20 }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-secondary)]">
                    No activity yet. Start exploring movies!
                  </p>
                </div>
                <Link
                  href="/"
                  className="text-sm text-[#E3A857] hover:underline"
                >
                  Browse now →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6 md:p-8 mt-6"
        >
          <h2 className="font-display text-xl text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <SettingsIcon className="text-[#E3A857]" />
            Preferences
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)]">
              <div>
                <p className="text-sm text-[var(--text-primary)]">Theme</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Currently in{" "}
                  <span className="font-medium">
                    {mode === "dark" ? "Dark" : "Light"} Mode
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)]">
                  {mode === "dark" ? "🌙" : "☀️"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)]">
              <div>
                <p className="text-sm text-[var(--text-primary)]">
                  Email Notifications
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Receive updates about new movies
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-[#232B3D] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#E3A857] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E3A857]"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
