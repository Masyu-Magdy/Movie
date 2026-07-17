"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  supabase,
  upsertUserProfile,
  updateUserProfileFields,
  getOrCreateUserProfile,
  UserProfile,
} from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  updateWatchlist: (movieIds: number[]) => Promise<void>;
  updateProfile: (
    name: string,
  ) => Promise<{ success: boolean; message: string }>;
  getWatchlist: () => number[];
  userWatchlist: number[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userWatchlist, setUserWatchlist] = useState<number[]>([]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setSession(currentSession);
          const profile = await getOrCreateUserProfile(
            currentSession.user.id,
            currentSession.user.email || "",
            currentSession.user.user_metadata?.name || "",
          );
          if (profile) {
            setUser(profile);
            setUserWatchlist(profile.watchlist || []);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        const profile = await getOrCreateUserProfile(
          newSession.user.id,
          newSession.user.email || "",
          newSession.user.user_metadata?.name || "",
        );
        if (profile) {
          setUser(profile);
          setUserWatchlist(profile.watchlist || []);
        }
      } else {
        setUser(null);
        setUserWatchlist([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message:
            error.message === "Invalid login credentials"
              ? "Invalid email or password"
              : error.message,
        };
      }

      if (data.user) {
        const profile = await getOrCreateUserProfile(
          data.user.id,
          data.user.email || email,
          data.user.user_metadata?.name || "",
        );
        if (profile) {
          setUser(profile);
          setUserWatchlist(profile.watchlist || []);
        }
        setSession(data.session);

        if (!profile) {

          return {
            success: false,
            message:
              "Signed in, but couldn't load your profile. Please check the profiles table's RLS policies in Supabase.",
          };
        }

        return {
          success: true,
          message: "Login successful!",
          user: profile,
        };
      }

      return {
        success: false,
        message: "An error occurred during login",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          return {
            success: false,
            message:
              "This email is already registered. Please use a different email or login.",
          };
        }
        return {
          success: false,
          message: error.message,
        };
      }

      if (data.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          created_at: new Date().toISOString(),
          watchlist: [],
        };

        const createdProfile = await upsertUserProfile(newProfile);
        setSession(data.session);

        if (!createdProfile) {
          return {
            success: false,
            message:
              "Account created, but we couldn't set up your profile. Please check the profiles table's RLS policies in Supabase, then try logging in.",
          };
        }

        setUser(createdProfile);
        setUserWatchlist([]);

        return {
          success: true,
          message: "Account created successfully!",
          user: createdProfile,
        };
      }

      return {
        success: false,
        message: "An error occurred during signup",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserWatchlist([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: "Password reset link sent to your email.",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  };

  const updateWatchlist = async (movieIds: number[]) => {
    if (!user) return;

    try {
      const updatedProfile = await updateUserProfileFields(user.id, {
        watchlist: movieIds,
      });

      if (updatedProfile) {
        setUser(updatedProfile);
        setUserWatchlist(movieIds);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  const updateProfile = async (name: string) => {
    if (!user) return { success: false, message: "Not logged in" };

    try {
      const updatedProfile = await updateUserProfileFields(user.id, { name });

      if (updatedProfile) {
        setUser(updatedProfile);
        return { success: true, message: "Profile updated!" };
      }

      return { success: false, message: "Could not update profile." };
    } catch (error) {
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const getWatchlist = () => {
    return userWatchlist;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        isAuthenticated: !!user,
        updateWatchlist,
        updateProfile,
        getWatchlist,
        userWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
