import { useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore, useUIStore } from "../store";
import type { SignupSchema, LoginSchema } from "../lib/schemas";
import type { Database } from "../lib/supabase-types";
import { UserRole } from "../types/user";
import { SafeProfile } from "../types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useAuth() {
  const { user, profile, isLoading, setUser, setProfile, setLoading, reset } =
    useAuthStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab visible - refreshing session...");
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
          }
        });
      }
    };

    const handleFocus = () => {
      console.log("Window focused - refreshing session...");
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  function normalizeProfile(row: Profile): SafeProfile {
    const safeRole: UserRole =
      row.role === "patient" || row.role === "caretaker" || row.role === "both"
        ? row.role
        : "patient";

    return {
      id: row.id,
      full_name: row.full_name ?? "",
      role: safeRole,
      caretaker_email: row.caretaker_email,
      notification_time: row.notification_time ?? "20:00",
    };
  }

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return;
    }
    if (data) {
      setProfile(normalizeProfile(data));
    }
  };

  const signUp = useCallback(async (formData: SignupSchema) => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.full_name },
      },
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: formData.full_name,
        role: "both",
        caretaker_email: formData.caretaker_email || null,
        notification_time: "14:30",
      });

      if (profileError) throw new Error(profileError.message);
    }

    addToast({
      type: "success",
      title: "Account created!",
      message: "Please check your email to verify your account.",
    });

    return data;
  }, []);

  const signIn = useCallback(async ({ email, password }: LoginSchema) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    addToast({
      type: "success",
      title: "Welcome back!",
      message: "You've successfully signed in.",
    });

    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    reset();
    addToast({
      type: "info",
      title: "Signed out",
      message: "See you next time!",
    });
  }, []);

  const updateProfile = useCallback(
    async (
      updates: Partial<{
        full_name: string;
        caretaker_email: string;
        notification_time: string;
      }>,
    ) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (data) {
        setProfile(normalizeProfile(data));
      }
      addToast({ type: "success", title: "Profile updated!" });

      return data;
    },
    [user],
  );

  return {
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id),
  };
}
